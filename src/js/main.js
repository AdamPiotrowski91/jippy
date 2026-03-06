"use strict";

chrome.runtime.onMessage.addListener(
    (info, _sender, respond) => {
        console.log(info);
    }
);
