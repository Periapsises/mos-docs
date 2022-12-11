class Accordion {
    /**
     * @param {HTMLDetailsElement} element
     */
    constructor(element) {
        /** @type {HTMLDetailsElement} */
        this.element = element;
        /** @type {HTMLElement} */
        this.summary = element.querySelector('summary');
        /** @type {HTMLElement} */
        this.content = element.querySelector('.content');

        /** @type {Animation} */
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;

        this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    /**
     * @param {KeyboardEvent} e
     */
    onClick(e) {
        e.preventDefault();
        this.element.style.overflowY = 'hidden';

        if (this.isClosing || !this.element.open) {
            this.open();
        } else if (this.isExpanding || this.element.open) {
            this.shrink();
        }
    }

    shrink() {
        this.isClosing = true;

        const startHeight = `${this.element.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.element.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinished(false);
        this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
        this.element.style.height = `${this.element.offsetHeight}px`;
        this.element.open = true;

        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        this.isExpanding = true;

        const startHeight = `${this.element.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.element.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        this.animation.onfinish = () => this.onAnimationFinished(true);
        this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinished(open) {
        this.element.open = open;
        this.animation = null;

        this.isClosing = false;
        this.isExpanding = false;

        this.element.style.overflowY = this.element.style.height = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('details').forEach((element) => {
        new Accordion(element);
    });
});