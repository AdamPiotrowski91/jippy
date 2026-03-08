"use strict";

chrome.runtime.onMessage.addListener(
    (info, _sender, respond) => {
        const jippy = new Clippy();

        if (jippy.existedBefore) jippy.animate();
        else jippy.welcome();
    }
);
