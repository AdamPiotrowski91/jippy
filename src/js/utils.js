'use strict';

/**
 * Copy some data to clipboard. Can be either string, directly, or object with proper structure.
 *
 * _Supported MIME Types: <https://stackoverflow.com/questions/68897154/list-of-supported-mime-types-for-clipboard-write>_
 *
 * If `navigator.permissions` or `navigator.clipboard` is not available or operation fails for some reason, returns `false`.
 * Otherwise, returns `true`.
 * @param {string | { type: MIMETypeString, value: string }} data either text or object with type (MIME Type) and value, to copy to clipboard
 * @returns {Promise<boolean>} boolean representing success of the operation
 */
const copyToClipboard = async (data) => { // data == either "string" or obj { type: 'text/<type>', value: '<string>' }
    if (!navigator?.permissions || !navigator?.clipboard) return false;

    const result = await navigator.permissions.query({ name: 'clipboard-write' });
    if (!['granted', 'prompt'].includes(result.state)) return false;

    let ret = null;
    if (typeof data !== 'string') {
        try {
            const { type, value } = data;
            const blob = new Blob([value], { type });
            ret = navigator.clipboard.write([new ClipboardItem({ [type]: blob })])
        } catch (err) { return false; }
    } else {
        ret = navigator.clipboard.writeText(data);
    }
    return ret
        .then(() => true)
        .catch(() => false);
}
