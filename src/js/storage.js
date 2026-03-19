"use strict";

const STORAGE_KEY = "jippy_data"

/**
 * @typedef {{
 *      showWelcomeMessage?: boolean,
 *      animateJippy?: boolean,
 *      makeNotifsNotPersistent?: boolean,
 * }} tStoredData
 */

/**
 * Get data from cache storage
 * @returns {Promise<tStoredData>} dictionary with session data information
 */
const getStorageData = async () => new Promise((resolve) => {
    chrome.storage.sync.get(
        [STORAGE_KEY],
        (data) => {
            const { [STORAGE_KEY]: ret } = data ?? {};
            resolve(ret || {});
        }
    );
});

/**
 * Cache data into storage. Can be partial, without losing what is already stored.
 * @param {Partial<tStoredData>} changes dictionary of changes to apply to stored data
 * @returns {Promise<void>}
 */
const setStorageData = async (changes) => {
    const data = await getStorageData();

    return new Promise((resolve) => {
        chrome.storage.sync.set({ [STORAGE_KEY]: { ...data, ...changes } }, resolve());
    });
}


/**
 * Directly save a `value` to a storage cache under `key`.
 * @template T
 * @param {keyof tStoredData} key
 * @param {T} value
 */
const storeDirectValue = async (key, value) => {
    return setStorageData({ [key]: value });
}
