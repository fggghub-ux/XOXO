/* Shared, side-effect-free chat clocks and proactive decisions for browser and Worker. */
(function (root) {
    'use strict';
    const MINUTE = 60000;
    const RETURN_GAP = 30 * MINUTE;

    function readTimestamp(value) {
        if (value === null || value === undefined || value === '' || typeof value === 'boolean') return 0;
        const numeric = Number(value);
        if (Number.isFinite(numeric)) return numeric > 0 ? numeric : 0;
        const parsed = Date.parse(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

    function validTimeZone(value, fallback = 'UTC') {
        try {
            const zone = String(value || '').trim();
            if (!zone) return fallback;
            new Intl.DateTimeFormat('en', { timeZone: zone }).format(0);
            return zone;
        } catch (_) { return fallback; }
    }

    function formatGap(ms) {
        if (!Number.isFinite(ms) || ms < 0) return '未知';
        const minutes = Math.floor(ms / MINUTE);
        if (minutes < 1) return '不到1分钟';
        if (minutes < 60) return minutes + '分钟';
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return hours + '小时' + (minutes % 60 ? minutes % 60 + '分钟' : '');
        return Math.floor(hours / 24) + '天' + (hours % 24 ? hours % 24 + '小时' : '');
    }

    function clock(value, zone) {
        const time = readTimestamp(value);
        if (!time) return null;
        const timeZone = validTimeZone(zone);
        const parts = new Intl.DateTimeFormat('zh-CN', {
            timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
            weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).formatToParts(new Date(time));
        const get = type => parts.find(part => part.type === type)?.value || '';
        const hour = Number(get('hour'));
        const phase = hour < 5 ? '凌晨/深夜' : hour < 9 ? '早晨' : hour < 12 ? '上午'
            : hour < 14 ? '中午' : hour < 18 ? '下午' : hour < 20 ? '傍晚' : '晚上';
        const dayKey = get('year') + '-' + get('month') + '-' + get('day');
        const hm = get('hour') + ':' + get('minute');
        return { timeZone, phase, dayKey, compact: dayKey + ' ' + hm,
            timelineLabel: get('month') + '-' + get('day') + ' ' + hm,
            text: dayKey + ' ' + hm + '（' + get('weekday') + '，' + timeZone + '）' };
    }

    function effectiveHistory(history) {
        return (Array.isArray(history) ? history : []).map((message, index) => ({
            message, index, type: message?.type, timestamp: readTimestamp(message?.createdAt)
        })).filter(item => ['sent', 'received'].includes(item.type) && item.timestamp > 0)
            .sort((a, b) => a.timestamp - b.timestamp || a.index - b.index);
    }

    function historyContent(content, timestamp, timeZone, enabled = true) {
        const snapshot = enabled ? clock(timestamp, timeZone) : null;
        if (!snapshot) return content;
        const label = '[发言时间：' + snapshot.text + ']\n';
        return Array.isArray(content) ? [{ type: 'text', text: label }, ...content] : label + String(content || '');
    }

    function build({ history = [], now = Date.now(), userTimeZone = 'UTC', charTimeZone = '',
        userName = 'User', charName = 'Char', enabled = true, trigger = 'manual', lastUserAt = 0, previousUserAt = 0 } = {}) {
        const entries = effectiveHistory(history);
        const latest = entries.at(-1) || null;
        const latestUserIndex = entries.findLastIndex(item => item.type === 'sent');
        const latestUser = entries[latestUserIndex] || (readTimestamp(lastUserAt) ? { timestamp: readTimestamp(lastUserAt), message: {} } : null);
        const pendingUser = latest?.type === 'sent';
        let burstStart = latestUserIndex;
        while (burstStart > 0 && entries[burstStart - 1].type === 'sent'
            && entries[burstStart].timestamp - entries[burstStart - 1].timestamp <= 5 * MINUTE) burstStart -= 1;
        const previousUser = entries.slice(0, Math.max(0, burstStart)).findLast(item => item.type === 'sent')
            || (readTimestamp(previousUserAt) ? { timestamp: readTimestamp(previousUserAt) } : null);
        const userAbsenceMs = latestUser ? Math.max(0, now - latestUser.timestamp) : null;
        const returnGapMs = pendingUser && previousUser
            ? Math.max(0, entries[burstStart].timestamp - previousUser.timestamp)
            : (trigger === 'manual' ? userAbsenceMs : null);
        const previousInteraction = pendingUser ? entries[burstStart - 1] || null : latest;
        const previousCharacter = pendingUser ? entries.slice(0, burstStart).findLast(item => item.type === 'received') : null;
        const characterReplyGapMs = previousCharacter && latestUser
            ? Math.max(0, latestUser.timestamp - previousCharacter.timestamp) : null;
        const interactionGapMs = previousInteraction ? Math.max(0, now - previousInteraction.timestamp) : null;
        // A blank-input continuation is not a new user message or a user return.
        const userReturned = enabled && pendingUser && trigger === 'manual' && returnGapMs !== null && returnGapMs >= RETURN_GAP;
        const betweenUserTurns = entries.slice(Math.max(0, burstStart), pendingUser ? burstStart : entries.length);
        const interveningCharacterCount = pendingUser && previousUser
            ? entries.filter(item => item.type === 'received' && item.timestamp > previousUser.timestamp
                && item.timestamp < entries[burstStart].timestamp).length
            : betweenUserTurns.filter(item => item.type === 'received').length;
        const userZone = validTimeZone(userTimeZone);
        const snapshot = clock(now, userZone);
        const charSnapshot = charTimeZone ? clock(now, charTimeZone) : null;
        const latestUserClock = latestUser ? clock(latestUser.timestamp, userZone) : null;
        const previousUserClock = previousUser ? clock(previousUser.timestamp, userZone) : null;
        const returnClock = pendingUser ? previousUserClock : latestUserClock;
        const crossDay = Boolean(returnClock && snapshot && returnClock.dayKey !== snapshot.dayKey);
        const timeline = entries.slice(-5).map(item => (item.type === 'sent' ? userName : charName)
            + ' ' + clock(item.timestamp, userZone).timelineLabel).join(' → ');
        const facts = enabled ? [
            'User 当前当地时间：' + snapshot.text + '；时段：' + snapshot.phase + '。',
            charSnapshot ? 'Char 当前当地时间：' + charSnapshot.text + '；时段：' + charSnapshot.phase + '。'
                : 'Char 未提供可解析的独立时区，不能猜测其当地几点。',
            '最近发言时间线：' + (timeline || '无有效记录') + '。',
            pendingUser ? 'User 本轮发言时间：' + (latestUserClock?.text || '未知') + '。'
                + (previousCharacter ? 'Char 在此之前的消息发送于：' + clock(previousCharacter.timestamp, userZone).text
                    + '；User 在 ' + formatGap(characterReplyGapMs) + ' 后才发来本轮消息。' : '') : '',
            userReturned ? '本轮事件：User 重新回来发言。此前已有 ' + formatGap(returnGapMs)
                + ' 没有参与聊天' + (crossDay ? '，已跨日' : '') + '。'
                : 'User 上次有效发言：' + (latestUserClock?.text || '未知') + '；距今：' + formatGap(userAbsenceMs) + '。',
            '距离上一段有效互动：' + formatGap(interactionGapMs) + '；期间角色发言不会重置 User 未参与的时长。',
            '在这段用户发言间隔内，Char 发过 ' + interveningCharacterCount + ' 条消息；这不代表 User 已回来或读过消息。'
        ].filter(Boolean).join('\n') : '现实时间感知关闭，不注入或猜测日期、时间、时段及现实中的离开时长。';
        let behavior = '保持角色自己的想法和说话方式，主动组织本轮回应；有 User 新消息时先接住其内容，没有新消息时自然发起联系。';
        if (trigger === 'background' || (trigger === 'manual' && !pendingUser)) {
            behavior = (pendingUser
                ? '本轮由系统触发角色联系；历史末条是 User 真实发送且尚未被回复的消息，可以补回该消息，但触发本身不代表 User 又说了话。'
                : '本轮是角色主动发起联系；User 没有发送本轮新消息。' + (latest?.type === 'received' ? '最近的角色发言仍未得到用户回复。' : '当前没有真实待回复的用户消息。')
                    + '不要将历史中的用户旧话重复当成本轮新输入。')
                + '\n' + behavior;
        }
        if (trigger === 'regenerate') behavior = '本轮重新生成原用户轮次，保留原轮次语境，不追加一轮假定的用户回归或后台联系。';
        else if (userReturned) behavior += '\n先让“User 隔了一段时间重新出现”引起符合人设、关系和旧情绪的反应，并自然围绕这段空白接住最新消息。可以惦记、好奇、想念或克制；不要统一套用查岗、责备或“怎么这么久才回来”。需要紧急回答时先处理用户的事。';
        if (enabled && (userReturned || interactionGapMs >= RETURN_GAP)) behavior += '\n上一轮的即时动作、地点和“马上/等你”等状态不能默认一直持续到现在。保留关系与已确认事实，重新落到当下；不要编造用户离开的原因、中间具体经历或已读状态。';
        if (enabled) behavior += '\n时间要影响对话的连续性和切入点，可以自然提及间隔；无需逐次报时，也不要仅凭时段催睡、催吃饭或机械安排作息。';
        if (enabled && pendingUser && characterReplyGapMs >= RETURN_GAP) behavior += '\nUser 是现在才回复此前的角色消息。回应落在本轮当前时间，不要把用户的新回复当成角色旧消息发送时就收到，也不能默认旧现场仍在持续。';
        return { entries, latestUser, previousUser, previousInteraction, pendingUser, userReturned, returnGapMs,
            userAbsenceMs, interactionGapMs, characterReplyGapMs, interveningCharacterCount, crossDay, facts, behavior,
            text: '<temporal_turn>\n' + facts + '\n' + behavior + '\n</temporal_turn>' };
    }

    function initiativePrompt() {
        return '<initiative_boundary>\n本轮是角色主动联系，系统触发、预设指令、格式纠正和时间信息均不是 User 发来的消息。只能把真实聊天历史中的 user/sent 内容归属于 User；不得补造用户轮次，也不得把“无新输入”解释为 User 发了省略号、空消息、标点、催促或隐藏消息。\n'
            + '若历史末条来自角色，表示 User 尚未回复；从角色自己的念头、已知生活与关系自然发起或补充话题，不得声称“你刚发了/你说了/你问了”不存在的内容。若历史末条来自 User，可回应那条真实待回复消息，但不能修改其内容或当成刚收到的新消息。\n'
            + '思考模板中的“本轮用户输入/最新用户消息”只检查真实历史；没有新输入时明确按角色主动联系处理，不为填满模板虚构用户输入、动作、心理或已读状态。此边界同时适用于 thinking、mind 和对白；不要在对白中提及系统触发或这些规则。\n</initiative_boundary>';
    }

    function decisionPrompt(format = 'json') {
        const formatRule = format === 'frames'
            ? '保持现有 FrameBus JSONL 格式，每行一个合法 JSON 对象。需要发送时，按本轮聊天格式输出 chat、translation、mind 等帧；若启用 thinking，仍先输出 thinking。最后额外输出 {"channel":"schedule","send":true,"nextCheckMinutes":30}，分钟数由你决定。暂不发送时只输出 {"channel":"schedule","send":false,"nextCheckMinutes":30}；此时不要求 chat、thinking、mind 或 translation。send 与 nextCheckMinutes 只写在 schedule 帧中，不要改成 send/text 包装对象，不要把聊天帧塞进字符串。'
            : '只输出 JSON {"send":true或false,"text":"实际消息或空字符串","nextCheckMinutes":整数}。send=false 时 text 必须为空。';
        return '<proactive_decision>\n当前未设置固定主动消息间隔。以角色自己的性格、职业、作息、关系、已知情绪和最近聊天决定现在是否想联系 User，以及下次多久后再考虑联系。用户持续未回复时自然放缓，不能默认用户正在做什么。\n'
            + formatRule + '\nnextCheckMinutes 为 1 至 1440 分钟，表达角色下一次考虑联系的时机；禁止输出给用户看。判断和消息在同一次响应完成。\n</proactive_decision>';
    }

    function readDecision(value) {
        if (!value || typeof value !== 'object' || typeof value.send !== 'boolean') return null;
        const minutes = Number(value.nextCheckMinutes);
        if (!Number.isFinite(minutes) || minutes < 1 || minutes > 1440) return null;
        return { send: value.send, nextCheckMinutes: Math.round(minutes), text: String(value.text || '').trim() };
    }

    function isDuplicate(text, history) {
        const normalize = value => String(value || '').normalize('NFKC').replace(/\s+/g, '').trim();
        const value = normalize(text);
        if (!value) return false;
        const recent = (Array.isArray(history) ? history : []).filter(item => item?.type === 'received').slice(-5);
        if (recent.some(item => normalize(item.text) === value)) return true;
        return recent.length > 1 && normalize(recent.slice(-3).map(item => item.text).join('\n')) === value;
    }

    root.WcChatTemporal = Object.freeze({ readTimestamp, validTimeZone, formatGap, clock,
        effectiveHistory, historyContent, build, initiativePrompt, decisionPrompt, readDecision, isDuplicate });
})(globalThis);
