"use strict";

chrome.runtime.onMessage.addListener(
    (info, _sender, _respond) => {
        const jippy = new Clippy();

        (async () => {
            const {
                showWelcomeMessage = true,
                animateJippy = true,
                makeNotifsNotPersistent = true,
            } = await getStorageData();

            // if everything has been already set, exit early
            if (jippy.existedBefore) return;

            if (showWelcomeMessage) {
                jippy.welcome();
                await setStorageData({ showWelcomeMessage: false });
            }

            if (animateJippy) jippy.animate();

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
                makeNotifsNotPersistent,
            );

            jippy.conditionalDatasetAction(
                'appliedClickEvent',
                () => {
                    /**
                     * @param {PointerEvent} _event
                     */
                    const clickFN = (_event) => {
                        jippy.say(`
                            <h1>MENU</h1>

                            <ul class="jippy-menu">
                                <li class="jippy-settings">Settings</li>
                            </ul>
                        `.trim());
                    }

                    jippy.clippy.addEventListener('click', clickFN);
                }
            )
        })()
    }
);
