"use strict";


class Clippy {
    /** @type {HTMLDivElement} */
    clippy;
    /** @type {boolean} */
    #existedBefore = false;
    /** @type {Promise<void>} */
    #promiseQueueHead = Promise.resolve();

    constructor() {
        this.document = window.document;

        /** @type {HTMLDivElement} */
        const jippy = this.document.body.querySelector("#jippy");

        if (jippy) {
            this.clippy = jippy;
            this.#existedBefore = true;
        } else {
            this.clippy = this.document.createElement('div');

            this.clippy.setAttribute('id', 'jippy');
            this.clippy.innerHTML = `
                <div class="jippy-bubble-container">
                    <div class="jippy-bubble hide-bubble"></div>
                </div>
                <div class="jippy-img static"></div>
            `;
            this.document.body.appendChild(this.clippy);
        }
    }

    get promise() {
        return this.#promiseQueueHead;
    }
    /** @type {HTMLDivElement} */
    get clippyIMG() {
        return this.clippy.querySelector('.jippy-img');
    }
    /** @type {HTMLDivElement} */
    get clippyBubble() {
        return this.clippy.querySelector('.jippy-bubble');
    }
    get existedBefore() {
        return this.#existedBefore;
    }
    get #animationID() {
        return parseInt(this.#getDataProperty('animationId') || 0, 10);
    }
    /** @param {number} value */
    set #animationID(value) {
        clearInterval(this.#animationID);
        this.#setDataProperty('animationId', value);
    }

    /**
     * Change currently shown image of Clippy.
     * @param {'static' | 'small' | 'action'} type css type to apply
     */
    changeImage = (type) => {
        this.clippyIMG.classList.remove('static', 'small', 'action');
        this.clippyIMG.classList.add(type);
    }

    /**
     * Change currently shown image of Clippy.
     * @param {'none' | 'dance'} type css type to apply
     */
    changeMove = (type) => {
        this.clippyIMG.classList.remove('none', 'dance');
        this.clippyIMG.classList.add(type);
    }

    /**
     * @async // aka sync with promises queue
     * Start random set of animations to appear occasionally.
     */
    animate = () => {
        const fn = () => {
            this.#animationID = setInterval(() => {
                const rand = Math.random();

                if (rand < 0.90) {
                    this.changeMove('none');
                    this.changeImage('small');
                } else {
                    this.changeImage('static');

                    const rand2 = Math.random();

                    if (rand2 < 0.15) {
                        this.changeMove('none');
                    } else {
                        this.changeMove('dance');
                    }
                }
            }, 3000);
        }

        this.#updatePromise(fn);
    }

    /**
     * @async
     */
    stopAnimation = () => {
        const fn = () => {
            this.#animationID = 0;
        }

        this.#updatePromise(fn);
    }

    /**
     * @async
     * Play "welcome" animation, then enable animation.
     */
    welcome = () => {
        const promise = new Promise((resolve) => {
            this.changeMove('none');
            this.changeImage('action');
            this.say(["Hi! I am Jippy.", "Clippy for Jira."], 2);

            setTimeout(() => {
                this.changeImage('static');
                this.changeMove('dance');
                this.say(["Click me to see what I can do!"], 3);

                setTimeout(() => {
                    this.changeImage('small');
                    this.changeMove('none');

                    resolve();
                }, 3000);
            }, 2000);
        });

        this.#updatePromise(promise);
    }

    showBubble = () => this.clippyBubble.classList.remove('hide-bubble');
    hideBubble = () => this.clippyBubble.classList.add('hide-bubble');

    /**
     * Display text as a speech bubble over Clippy.
     *
     * _Note: string will be treated literally,
     * but array of strings will be parsed as paragraphs._
     * @param {string | Array<string>} content
     * @param {number} hideAfterSec (optional)
     */
    say = (content, hideAfterSec = null) => {
        if (Array.isArray(content)) {
            content = content.map((c) => `<p>${c}</p>`).join("");
        }

        this.clippyBubble.innerHTML = content;
        this.showBubble();

        if (hideAfterSec) {
            setTimeout(() => { this.hideBubble(); }, hideAfterSec * 1000 - 1);
        }
    }

    /**
     * Apply `fn` if the dataset `propertyName` is not set and `condition` is met, if provided.
     * @param {string} propertyName
     * @param {() => void} fn
     * @param {boolean} condition
     */
    conditionalDatasetAction = (propertyName, fn, condition = true) => {
        if (
            !condition
            || (propertyName && this.#getDataProperty[propertyName])
        ) return;

        this.#setDataProperty[propertyName] = propertyName;
        fn();
    }


    /**
     * @param {string} property
     * @param {string | number} value
     */
    #setDataProperty = (property, value) => {
        this.clippy.dataset[property] = value;
    }

    /**
     * @param {string} property
     */
    #getDataProperty = (property) => {
        return this.clippy.dataset[property];
    }

    /**
     * @param {Promise<void> | () => void} promiseOrFN
     */
    #updatePromise = (promiseOrFN) => {
        this.#promiseQueueHead = this.#promiseQueueHead.then(
            promiseOrFN instanceof Promise ? () => promiseOrFN : Promise.resolve(promiseOrFN()),
        );
    }
}
