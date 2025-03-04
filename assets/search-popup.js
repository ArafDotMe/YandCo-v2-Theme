(() => {
  if (customElements.get('search-popup')) {
    return;
  }

  class SearchPopup extends HTMLElement {
    constructor() {
      super();
      this.buttonOpen = this.querySelector('.js-open');
      this.buttonClose = this.querySelector('[data-button-close]');
      this.searchPopup = this.querySelector(
        '[data-predictive-search]'
      );
      this.input = this.querySelector('input[type="search"]');
      this.header = document.querySelector('header[data-header]');
      this.body = document.querySelector('body');
    }

    connectedCallback() {
      this.buttonOpen?.addEventListener(
        'click',
        this.toggle.bind(this)
      );
      this.buttonClose.addEventListener(
        'click',
        this.close.bind(this)
      );
    }

    toggle(e) {
      if (this.searchPopup.classList.contains('is-visible')) {
        this.close(e);
      } else {
        this.open(e);
      }
    }

    open(e) {
      e.preventDefault();
      this.searchPopup.classList.add('is-visible');
      this.input.focus();
      this.header.setAttribute('is-open', '');

      if (this.header.hasAttribute('transparent')) {
        this.header.classList.remove('header--transparent');
      }

      if (this.searchPopup.querySelector('[data-card-product]')) {
        this.body.classList.add('no-scroll');
      }
    }

    close(e) {
      e.preventDefault();
      this.searchPopup.classList.remove('is-visible');
      this.header.removeAttribute('is-open');
      this.body.classList.remove('no-scroll');

      if (this.header.hasAttribute('transparent')) {
        this.header.classList.add('header--transparent');
      }
    }
  }

  customElements.define('search-popup', SearchPopup);
})();
