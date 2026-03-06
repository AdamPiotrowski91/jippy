"use strict";

chrome.runtime.onMessage.addListener(
    (info, _sender, respond) => {
        const jippy = new Clippy();

        setTimeout(() => {
            jippy.changeImage('action');
        }, 2000);
    }
);
