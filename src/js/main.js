"use strict";

chrome.runtime.onMessage.addListener(
    (info, _sender, respond) => {
        const jippy = new Clippy();

        (async () => {
            console.log(await getStorageData());
            const {
                showWelcomeMessage = true,
            } = await getStorageData();

            if (jippy.existedBefore) {
                jippy.animate();
                return;
            }

            if (showWelcomeMessage) {
                jippy.welcome();
                await setStorageData({ showWelcomeMessage: false });
            }

            jippy.conditionalDatasetAction(
                'notificationsObserverSet',
                () => {
                    const observerFN = () => {
                        /** @type {HTMLDivElement[]} */
                        const alerts = [...document.querySelectorAll('.atlaskit-portal-container [role=alert]')];

                        alerts.forEach((alert) => {
                            /** @type {HTMLButtonElement | undefined} */
                            const btn = [...alert.querySelectorAll('button:not(.loading-dismiss)')]
                                ?.filter((btn) => btn.textContent.trim() == "Dismiss")
                                ?.at(0);

                            if (btn) {
                                btn.classList.add('loading-dismiss');

                                setTimeout(() => { btn?.click(); }, 8_000);
                            }
                        });
                    }

                    const observer = new MutationObserver(observerFN);
                    observer.observe(document.body, { 'childList': true, 'subtree': true });
                },
            );
            jippy.animate();
        })()
    }
);
