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
                    const menuOpenSettingsFN = () => {
                        jippy.say(`
                            <h2 class="jippy-settings">SETTINGS</h2>

                            <p>Changes to those settings may require page refresh.</p>

                            <ul class="jippy-menu checkboxes">
                                <li>
                                    <label>
                                        <input type="checkbox" id="welcome-msg" />
                                        <span>Show welcome message</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input type="checkbox" id="animate" />
                                        <span>Animate Jippy</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input type="checkbox" id="non-persistent-notifs" />
                                        <span>Make Jira Notifications non-persistent</span>
                                    </label>
                                </li>
                            </ul>
                        `.trim());

                        jippy.setUpBubbleCheckbox(
                            '#welcome-msg', showWelcomeMessage, 'showWelcomeMessage',
                        );
                        jippy.setUpBubbleCheckbox(
                            '#animate', animateJippy, 'animateJippy',
                        );
                        jippy.setUpBubbleCheckbox(
                            '#non-persistent-notifs', makeNotifsNotPersistent, 'makeNotifsNotPersistent',
                        );
                    }

                    const openMenuFN = () => {
                        jippy.say(`
                            <h1>MENU</h1>

                            <ul class="jippy-menu">
                                <li class="jippy-settings">Settings</li>
                            </ul>
                        `.trim());

                        jippy.clippyBubble
                            .querySelector('.jippy-settings')
                            .addEventListener('click', menuOpenSettingsFN);
                    }

                    jippy.clippyIMG.addEventListener('click', openMenuFN);
                    window.document.addEventListener('click', () => {
                        const elem = document.activeElement;
                        const bubble = jippy.clippyBubble;

                        if (
                            !elem.contains(bubble)
                            && !bubble.contains(elem)
                        ) jippy.hideBubble();
                    });
                }
            )
        })()
    }
);
