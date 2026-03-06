"use strict";

/**
 * @typedef {{ tab: Record<string, any> }} tMessage
 * @typedef {(id: number, info: Record<string, any>, tab: Record<string, any>) => void} tConnectListenerFN
 * @typedef {(id: number, message: tMessage, options?: {}, fn?: (res: Record<string, any>) => void) => void} tSendMessageFN
 * @typedef {(info: tMessage, s: Record<string, any>, res?: (arg: any) => void) => void} tMessageListenerFN
 *
 * @type {{
 *      tabs: {
 *          onUpdated: { addListener: (fn: tConnectListenerFN) => void },
 *          sendMessage: tSendMessageFN
 *      },
 *      runtime: { onMessage: { addListener: (fn: tMessageListenerFN) => void } }
 * }}
 */
var chrome = chrome;

chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => {
        if (changeInfo?.status == "complete") {
            /** @type {tMessage} */
            const message = {
                tab,
            };
            chrome.tabs.sendMessage(tabId, message);
        }
    }
);
