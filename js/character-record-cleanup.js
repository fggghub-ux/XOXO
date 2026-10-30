(function () {
    'use strict';
    const KEY = 'contactsCharacterDeletionV1';
    const DROP = Symbol('deleted character');
    const families = /^(?:wechat|memory|meeting|charphoneContentV1:|calling|todayAppData_|icity_|__x_|qqCharacterBridge_|fanfictionAppDataV1:|photosAppData$|photoAlbumData$|readenAppData$|musicAppData$|appSettings$)/;
    const identityFields = new Set(['contactId', 'linkedContactId', 'characterId', 'charId', 'bindingId', 'sourceContactId', 'sourceCharacterId', 'authorWechatId', 'speakerId', 'senderId', 'memberId', 'userId', 'authorId', 'targetId', 'actorMemberId', 'targetMemberId', 'fromId']);
    const identityLists = new Set(['bindingIds', 'memberIds', 'sharedMemberIds', 'adminIds', 'mentions', 'chars', 'characterIds', 'contactIds', 'participants']);
    let committed = { sourceIds: [], wechatIds: [], stories: [], works: [], assetKeys: [] };

    function aliases(plan) {
        const ids = new Set([...plan.sourceIds, ...plan.wechatIds].map(String));
        for (const id of plan.sourceIds) {
            ids.add('char_' + id); ids.add('catalog-char:' + id); ids.add('char:char_' + id);
            ids.add('icity_thread_char_' + id.toLowerCase());
        }
        for (const id of [...ids]) { ids.add('character:' + id); ids.add('shared:' + id); }
        return ids;
    }
    function matches(value, ids) {
        if (value == null || typeof value === 'object') return false;
        const id = String(value);
        if (ids.has(id)) return true;
        if (id.startsWith('npc:')) return [...ids].some(parent => id.startsWith('npc:' + parent + ':') || id.startsWith('npc:' + encodeURIComponent(parent) + ':'));
        return false;
    }
    function deletedCast(member, ids) { return matches(member?.sourceId, ids) || matches(member?.id, ids); }
    function roleOnlyWork(work, ids) {
        const cast = Array.isArray(work?.cast) ? work.cast.filter(member => member.type !== 'User') : [];
        return cast.length > 0 && cast.every(member => deletedCast(member, ids));
    }
    function walk(value, ids, field = '', removed = null) {
        if (value == null || typeof value !== 'object') return value;
        if (value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return value;
        if (Array.isArray(value)) {
            const result = [];
            for (const item of value) {
                if ((identityLists.has(field) || field === 'cast' || field === 'members') && matches(item, ids)) continue;
                const next = walk(item, ids, field, removed);
                if (next !== DROP) result.push(next);
            }
            return result.length === value.length && result.every((item, index) => item === value[index]) ? value : result;
        }
        const ownIdentity = matches(value.id, ids) || [...identityFields].some(key => matches(value[key], ids))
            || ((value.type === 'Char' || value.type === 'NPC' || value.sourceType === 'char' || value.sourceType === 'npc') && matches(value.sourceId, ids));
        const sharedWork = Array.isArray(value.cast) && value.cast.some(member => member.type !== 'User' && !deletedCast(member, ids));
        if ((ownIdentity && !sharedWork) || (field === 'drafts' && roleOnlyWork(value, ids))) { if (removed && value.id != null) removed.add(String(value.id)); return DROP; }
        const result = {};
        for (const [key, item] of Object.entries(value)) {
            if (matches(key, ids)) continue;
            if (sharedWork && identityFields.has(key) && matches(item, ids)) continue;
            if (['selectedContactId', 'role', 'ownerId', 'hostId', 'parentWechatId', 'selectedCharacterId'].includes(key) && matches(item, ids)) { result[key] = ''; continue; }
            if (key === 'owner' && matches(item, ids)) return DROP;
            const next = walk(item, ids, key, removed);
            if (next !== DROP) Object.defineProperty(result, key, { value: next, writable: true, enumerable: true, configurable: true });
        }
        if (Array.isArray(value.bindingIds) && value.bindingIds.length && !result.bindingIds.length) return DROP;
        if (matches(value.selectedContactId, ids) && Array.isArray(value.connections)) delete result.draft;
        if (Array.isArray(value.members) && result.members?.length && result.members.length < value.members.length
            && (matches(value.ownerId, ids) || value.members.some(member => member.role === 'owner' && matches(member.id, ids)))
            && !result.members.some(member => member.role === 'owner')) {
            const owner = result.members.find(member => member.role === 'admin') || result.members.find(member => member.id === 'user') || result.members[0];
            result.members = result.members.map(member => member === owner ? { ...member, role: 'owner' } : member);
            if ('ownerId' in value) result.ownerId = owner.id;
        }
        if (Array.isArray(value.observations) && result.observations?.length !== value.observations.length) {
            if (!result.observations.length) return DROP;
            // Aggregates are derived from observations and must not retain the deleted person's text.
            for (const key of ['summary', 'text', 'content', 'manualText']) if (key in result) result[key] = '';
            if ('title' in result) result.title = '共同事件';
            for (const key of ['terms', 'entityIds', 'visibleTerms', 'visibleEntityIds']) if (key in result) result[key] = [];
        }
        return Object.keys(result).length === Object.keys(value).length && Object.entries(result).every(([key, item]) => item === value[key]) ? value : result;
    }
    function clean(record, plan = committed, removed = null) {
        if (!record || record.id === KEY || !families.test(String(record.id))) return record;
        const ids = aliases(plan);
        if (!ids.size) return record;
        if ((plan.works || []).some(work => work.key === record.id) || (plan.assetKeys || []).includes(record.id)) return null;
        if (String(record.id).startsWith('fanfictionAppDataV1:') && String(record.id).includes(':work:') && roleOnlyWork(record.data, ids)) return null;
        if (String(record.id).startsWith('wechatChatContactData_') && plan.wechatIds.some(id => String(record.id).endsWith('_' + id))) return null;
        let input = record;
        let encoded = false;
        if (typeof record.value === 'string') {
            try { input = { ...record, value: JSON.parse(record.value) }; encoded = true; } catch { return record; }
        }
        if (String(record.id).startsWith('meetingImage:')) {
            try { const parts = String(record.id).split(':'); if ((plan.stories || []).some(story => story.owner === decodeURIComponent(parts[1]) && story.id === decodeURIComponent(parts[2]))) return null; } catch { /* Keep unrelated malformed keys. */ }
        }
        if (String(record.id).startsWith('charphoneContentV1:')) {
            try { if (matches(JSON.parse(String(record.id).slice('charphoneContentV1:'.length))[1], ids)) return null; } catch { /* Keep malformed unrelated keys. */ }
        }
        const result = walk(input, ids, '', removed);
        if (result === DROP) return null;
        let next = result;
        const deletedWorks = (plan.works || []).filter(work => work.owner === record.id).map(work => work.id);
        if (deletedWorks.length && next.data) {
            next = { ...next, data: { ...next.data } };
            if (Array.isArray(next.data.workIds)) next.data.workIds = next.data.workIds.filter(id => !deletedWorks.includes(String(id)));
            for (const key of ['likes', 'saved']) if (Array.isArray(next.data[key])) next.data[key] = next.data[key].filter(id => !deletedWorks.includes(String(id)));
            for (const key of ['progress', 'commentsByWork', 'commentDrafts', 'updateRequests', 'pendingReaderResults']) if (next.data[key] && typeof next.data[key] === 'object') {
                next.data[key] = Object.fromEntries(Object.entries(next.data[key]).filter(([id]) => !deletedWorks.includes(String(id))));
            }
        }
        const deletedStories = (plan.stories || []).filter(story => record.id === 'meetingStoryV2:' + encodeURIComponent(story.owner) + ':index').map(story => story.id);
        if (Array.isArray(result.storyIds) && result.storyIds.some(id => deletedStories.includes(String(id)))) next = { ...result, storyIds: result.storyIds.filter(id => !deletedStories.includes(String(id))) };
        if (next === input) return record;
        if (record.story && !next.story) return null;
        if (encoded) next.value = JSON.stringify(next.value);
        return next;
    }
    function collect(records, sourceContacts, explicit = []) {
        const activeSources = new Set(sourceContacts.filter(Boolean).map(item => String(item.id)));
        const prior = records.find(record => record?.id === KEY) || committed;
        const sourceIds = new Set([...(prior.sourceIds || []), ...explicit].map(String));
        const wechatIds = new Set((prior.wechatIds || []).map(String));
        const activeStandalone = new Set();
        const observe = (id, linked = false) => {
            if (typeof id !== 'string' || !id) return;
            const sourceId = id.startsWith('char_') ? id.slice(5) : id;
            if ((linked || id.startsWith('char_') || id.startsWith('contact_')) && !activeSources.has(sourceId) && !activeStandalone.has(id)) {
                sourceIds.add(sourceId); wechatIds.add(id.startsWith('char_') ? id : 'char_' + sourceId);
            }
        };
        for (const record of records) if (/^wechatContactsData(?:_|$)/.test(String(record?.id))) {
            for (const contact of record.contacts || []) {
                if (!contact || contact.isGroup || contact.type === 'group') continue;
                if (!contact.linkedContactId && !String(contact.id).startsWith('char_')) activeStandalone.add(String(contact.id));
                observe(String(contact.id));
                if (contact.linkedContactId) {
                    observe(String(contact.linkedContactId), true);
                    if (!activeSources.has(String(contact.linkedContactId))) wechatIds.add(String(contact.id));
                    else { wechatIds.delete(String(contact.id)); sourceIds.delete(String(contact.id)); }
                }
            }
        }
        const scan = value => {
            if (!value || typeof value !== 'object' || value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return;
            if (Array.isArray(value)) { value.forEach(scan); return; }
            for (const [key, item] of Object.entries(value)) {
                if (identityLists.has(key) && Array.isArray(item)) item.forEach(id => observe(id));
                if (identityFields.has(key) || key === 'sourceId') observe(item, ['linkedContactId', 'sourceContactId', 'sourceCharacterId'].includes(key)
                    || (key === 'sourceId' && (value.type === 'Char' || value.type === 'NPC' || value.sourceType === 'char')));
                if (key.startsWith('char_')) observe(key);
                scan(item);
            }
        };
        for (const record of records) {
            if (!record || !families.test(String(record.id))) continue;
            scan(record);
            if (String(record.id).startsWith('__x_') && typeof record.value === 'string') {
                try { scan(JSON.parse(record.value)); } catch { /* Ignore non-JSON settings. */ }
            }
            if (String(record.id).startsWith('charphoneContentV1:')) {
                try { observe(JSON.parse(String(record.id).slice('charphoneContentV1:'.length))[1]); } catch { /* Keep unrelated malformed records. */ }
            }
        }
        for (const id of activeSources) { sourceIds.delete(id); wechatIds.delete('char_' + id); }
        for (const id of sourceIds) wechatIds.add('char_' + id);
        return { id: KEY, version: 1, sourceIds: [...sourceIds], wechatIds: [...wechatIds], stories: [...(prior.stories || [])], works: [...(prior.works || [])], assetKeys: [...(prior.assetKeys || [])] };
    }
    function plan(records, sourceContacts, explicit = []) {
        const deletion = collect(records, sourceContacts, explicit);
        const ids = aliases(deletion);
        deletion.works = deletion.works.filter(work => {
            const restored = records.find(record => record.id === work.key);
            return !restored?.data?.cast?.length || roleOnlyWork(restored.data, ids);
        });
        for (const record of records) if (String(record.id).startsWith('fanfictionAppDataV1:') && String(record.id).includes(':work:') && roleOnlyWork(record.data, ids)) {
            if (!deletion.works.some(work => work.key === record.id)) deletion.works.push({ key: record.id, owner: String(record.id).slice(0, String(record.id).lastIndexOf(':work:')), id: String(record.data.id) });
        }
        const assetRefs = (value, refs = new Set()) => {
            if (!value || typeof value !== 'object' || value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return refs;
            for (const [key, item] of Object.entries(value)) {
                if (/assetId$/i.test(key) && typeof item === 'string') refs.add(item);
                if (/assetIds$/i.test(key) && Array.isArray(item)) item.forEach(id => refs.add(String(id)));
                assetRefs(item, refs);
            }
            return refs;
        };
        const candidates = new Set(deletion.assetKeys), liveAssets = new Set();
        for (const record of records) {
            if (!String(record.id).startsWith('fanfictionAppDataV1:') || String(record.id).includes(':asset:')) continue;
            const work = deletion.works.find(item => item.key === record.id);
            const owner = work?.owner || String(record.id).split(':work:')[0];
            const refs = assetRefs(work ? record : clean(record, { ...deletion, assetKeys: [] }));
            for (const id of refs) (work ? candidates : liveAssets).add(owner + ':asset:' + id);
        }
        deletion.assetKeys = [...candidates].filter(key => !liveAssets.has(key));
        const activeIds = new Set(sourceContacts.filter(Boolean).flatMap(contact => [String(contact.id), 'char_' + contact.id]));
        for (const record of records) if (/^wechatContactsData(?:_|$)/.test(String(record.id))) {
            for (const contact of record.contacts || []) if (contact?.linkedContactId && activeIds.has(String(contact.linkedContactId))) activeIds.add(String(contact.id));
        }
        const storyOwner = record => String(record.owner || decodeURIComponent(String(record.id).split(':')[1] || ''));
        const restoredStories = new Set(records.filter(record => record.story && [...identityFields].some(key => activeIds.has(String(record.story[key] || '')))).map(record => storyOwner(record) + ':' + String(record.story.id)));
        deletion.stories = deletion.stories.filter(story => !restoredStories.has(story.owner + ':' + story.id));
        for (const record of records) if (record.story && [...identityFields].some(key => matches(record.story[key], ids))) {
            if (!deletion.stories.some(story => story.key === record.id)) deletion.stories.push({ key: record.id, owner: storyOwner(record), id: String(record.story.id) });
        }
        const removed = new Set();
        const writes = [], deletes = [];
        for (const record of records) {
            if (record.id === KEY) continue;
            const next = clean(record, deletion, removed);
            if (next === null) {
                deletes.push(record.id);
            } else if (next !== record) writes.push(structuredClone(next));
        }
        for (const record of writes) {
            const recordIds = (value, result = new Set()) => {
                if (!value || typeof value !== 'object' || value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return result;
                if (!Array.isArray(value) && value.id != null) result.add(String(value.id));
                Object.values(value).forEach(item => recordIds(item, result));
                return result;
            };
            const remainingIds = recordIds(record);
            const removedInRecord = new Set([...recordIds(records.find(item => item.id === record.id))].filter(id => !remainingIds.has(id)));
            const clearReferences = value => {
                if (!value || typeof value !== 'object' || value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return;
                if (Array.isArray(value)) { value.forEach(clearReferences); return; }
                if (removedInRecord.has(String(value.replyTo || ''))) { delete value.replyTo; delete value.reply; delete value.quote; delete value.replyPreview; }
                Object.values(value).forEach(clearReferences);
            };
            clearReferences(record);
        }
        return { deletion, writes, deletes };
    }
    function adopt(deletion) { committed = { sourceIds: [...(deletion.sourceIds || [])], wechatIds: [...(deletion.wechatIds || [])], stories: [...(deletion.stories || [])], works: [...(deletion.works || [])], assetKeys: [...(deletion.assetKeys || [])] }; }
    function wrap(store) {
        return new Proxy(store, { get(target, key) {
            if (key === 'put' || key === 'add') return (record, ...args) => {
                const next = clean(record);
                if (next === null && String(record.id).startsWith('fanfictionAppDataV1:') && String(record.id).includes(':work:') && !committed.works.some(work => work.key === record.id)) {
                    committed.works.push({ key: record.id, owner: String(record.id).slice(0, String(record.id).lastIndexOf(':work:')), id: String(record.data.id) });
                    target.put({ id: KEY, version: 1, ...committed });
                }
                return next === null ? target.delete(record.id) : target[key](next, ...args);
            };
            const value = target[key];
            return typeof value === 'function' ? value.bind(target) : value;
        } });
    }
    window.CharacterRecordCleanup = Object.freeze({ key: KEY, plan, clean, adopt, wrap });
})();
