"use strict";


class Clippy {
    constructor() {
        this.document = window.document;

        const jippy = this.document.body.querySelector("#jippy");

        if (jippy) {
            this.clippy = jippy;
        } else {
            this.clippy = this.document.createElement('div');
            this.clippy.setAttribute('id', 'jippy');
            this.clippy.innerHTML = `
                <div class="jippy-img static"></div>
            `;
            this.document.body.appendChild(this.clippy);
        }
    }

    get clippyIMG() {
        return this.clippy.children[0];
    }

    /**
     * Change currently shown image of Clippy.
     * @param {'static' | 'small' | 'action'} type css type to apply
     */
    changeImage = (type) => {
        this.clippyIMG.classList.remove('static', 'small', 'action');
        this.clippyIMG.classList.add(type);
    }
}
