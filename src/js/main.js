"use strict";

chrome.runtime.onMessage.addListener(
    (info, _sender, respond) => {
        const jippy = new Clippy();

        if (jippy.existedBefore) jippy.animate();
        else jippy.welcome();

        // setInterval(() => {
        //     const alerts = [...document.querySelectorAll('.atlaskit-portal-container [role=alert]')];

        //     alerts.forEach((alert) => {
        //         [...alert.querySelectorAll('button:not(.loading-dismiss)')]
        //             ?.filter((btn) => btn.textContent.trim() == "Dismiss")
        //             ?.at(0)
        //             ?.classList.add('loading-dismiss');
        //     });
        // }, 2000);
    }
);
