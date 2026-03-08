"use strict";


class Clippy {
    /** @type {HTMLDivElement} */
    clippy;
    /** @type {boolean} */
    #existedBefore = false;

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
            <div class="jippy-img static"></div>
            `;
            this.document.body.appendChild(this.clippy);
        }
    }

    /** @type {HTMLDivElement} */
    get clippyIMG() {
        return this.clippy.children[0];
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
     * Start random set of animations to appear occasionally.
     */
    animate = () => {
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

    /**
     * Play "welcome" animation, then enable animation.
     */
    welcome = () => {
        if (this.#animationID) return;

        this.changeImage('action');
        setTimeout(() => {
            this.changeImage('static');
            this.changeMove('dance');

            setTimeout(() => {
                this.changeImage('small');
                this.changeMove('none');

                this.animate();
            }, 3000);
        }, 2000);
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
}
