(function () {
    'use strict';
    if (window.tonghuajiBackupCodec) return;
    var tag = '__tonghuajiBackupType';
    var own = Object.prototype.hasOwnProperty;
    var viewTypes = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array', 'DataView'];

    function toHex(buffer) {
        var bytes = new Uint8Array(buffer), chunks = [];
        for (var start = 0; start < bytes.length; start += 8192) {
            var chunk = '';
            for (var i = start; i < Math.min(start + 8192, bytes.length); i += 1) chunk += bytes[i].toString(16).padStart(2, '0');
            chunks.push(chunk);
        }
        return chunks.join('');
    }

    function fromHex(hex) {
        if (typeof hex !== 'string' || hex.length % 2 || /[^0-9a-f]/i.test(hex)) throw new Error('备份中的二进制数据无效');
        var bytes = new Uint8Array(hex.length / 2);
        for (var i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        return bytes.buffer;
    }

    function binary(type, buffer) {
        var result = { version: 1, hex: toHex(buffer) };
        result[tag] = type;
        return result;
    }

    function readBlob(blob) {
        if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer();
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { resolve(reader.result); };
            reader.onerror = function () { reject(reader.error || new Error('无法读取备份附件')); };
            reader.onabort = function () { reject(new Error('备份附件读取被中止')); };
            reader.readAsArrayBuffer(blob);
        });
    }

    async function encodeValue(value, ancestors) {
        if (!value || typeof value !== 'object') return value;
        if (typeof Blob !== 'undefined' && value instanceof Blob) {
            var isFile = typeof File !== 'undefined' && value instanceof File;
            var item = binary(isFile ? 'File' : 'Blob', await readBlob(value));
            item.mime = value.type;
            if (isFile) { item.name = value.name; item.lastModified = value.lastModified; }
            return item;
        }
        if (value instanceof ArrayBuffer) return binary('ArrayBuffer', value);
        if (ArrayBuffer.isView(value)) {
            // Copy only the view's bytes, including offsets, without changing numeric precision.
            var type = Object.prototype.toString.call(value).slice(8, -1);
            if (viewTypes.indexOf(type) === -1) throw new Error('不支持的二进制数据类型：' + type);
            return binary(type, value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
        }
        if (value instanceof Date) return value.toJSON();
        if (ancestors.has(value)) throw new Error('备份记录包含循环引用');
        ancestors.add(value);
        try {
            if (Array.isArray(value)) {
                var array = [];
                for (var i = 0; i < value.length; i += 1) array.push(await encodeValue(value[i], ancestors));
                return array;
            }
            var result = Object.create(null);
            var keys = Object.keys(value);
            for (var j = 0; j < keys.length; j += 1) result[keys[j]] = await encodeValue(value[keys[j]], ancestors);
            // Escape ordinary user objects that happen to contain the reserved marker.
            if (own.call(value, tag)) {
                var escaped = { version: 1, entries: keys.map(function (key) { return [key, result[key]]; }) };
                escaped[tag] = 'Object';
                return escaped;
            }
            return result;
        } finally { ancestors.delete(value); }
    }

    function decode(value) {
        if (!value || typeof value !== 'object') return value;
        if (Array.isArray(value)) return value.map(decode);
        if (own.call(value, tag)) {
            if (value.version !== 1) throw new Error('不支持的二进制备份版本，请更新后导入');
            var type = value[tag];
            if (type === 'Object') {
                if (!Array.isArray(value.entries)) throw new Error('备份对象格式无效');
                var escaped = {};
                value.entries.forEach(function (entry) {
                    if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string') throw new Error('备份对象字段无效');
                    Object.defineProperty(escaped, entry[0], { value: decode(entry[1]), enumerable: true, configurable: true, writable: true });
                });
                return escaped;
            }
            var buffer = fromHex(value.hex);
            if (type === 'ArrayBuffer') return buffer;
            if (type === 'Blob') return new Blob([buffer], { type: value.mime || '' });
            if (type === 'File') {
                if (typeof File !== 'function') throw new Error('当前浏览器无法恢复文件附件，请使用支持文件导入的浏览器');
                return new File([buffer], value.name || '', { type: value.mime || '', lastModified: value.lastModified });
            }
            if (viewTypes.indexOf(type) !== -1 && typeof window[type] === 'function') {
                var Constructor = window[type];
                if (type !== 'DataView' && buffer.byteLength % Constructor.BYTES_PER_ELEMENT) throw new Error('备份中的向量长度无效');
                return new Constructor(buffer);
            }
            throw new Error('无法恢复二进制数据类型：' + type);
        }
        var result = {};
        Object.keys(value).forEach(function (key) {
            Object.defineProperty(result, key, { value: decode(value[key]), enumerable: true, configurable: true, writable: true });
        });
        return result;
    }

    window.tonghuajiBackupCodec = Object.freeze({
        encode: function (value) { return encodeValue(value, new WeakSet()); },
        decode: decode
    });
}());
