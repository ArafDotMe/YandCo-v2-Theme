(() => {
  if (customElements.get('product-selector')) {
    return;
  }

  class ProductSelector extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
      if (this.form === null) return;

      this.form.addEventListener(
        'submit',
        this.onSubmitHandler.bind(this)
      );
      this.submitButton = this.form.querySelector('[name="add"]');
      this.cartDrawer = document.querySelector('cart-drawer');
      this.variants = JSON.parse(
        this.querySelector('[type="application/json"]').textContent
      );
      this.addEventListener('change', this.onVariantChange);

      this.updateOptions();
      this.updateVariant();

      if (!this.currentVariant) {
        return;
      }

      this.toggleDisableSize();
      this.updateMedia();
    }

    onSubmitHandler(event) {
      event.preventDefault();

      this.submitButton.classList.add('disabled');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      const formData = new FormData(this.form);
      if (this.cartDrawer) {
        formData.append(
          'sections',
          this.cartDrawer
            .getSectionsToRender()
            .map(section => section.section)
        );
      }
      formData.append('sections_url', window.location.pathname);
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then(response => response.json())
        .then(response => {
          if (response.status) {
            this.handleErrorMessage(response.description);
            return;
          }

          this.cartDrawer?.renderContents(response);
          if (
            this.dataset.cartType == 'page' ||
            Shopify.template == 'cart'
          ) {
            window.location.reload();
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.submitButton.classList.remove('disabled');
        });
    }

    handleErrorMessage(errorMessage = false) {
      const errorWrapper = this.querySelector('[data-error-wrapper]');
      if (!errorWrapper) return;
      errorWrapper.classList.toggle('hidden', !errorMessage);
      errorWrapper.textContent = errorMessage || '';
    }

    onVariantChange(event) {
      if (
        event.target.type === 'number' ||
        event.target.name.includes('selling_plan')
      )
        return;
      this.updateOptions();
      this.updateVariant();
      this.toggleAddButton(false, '');
      this.handleErrorMessage();

      if (!this.currentVariant) {
        this.toggleAddButton(true, '');
        this.setUnavailable();
        return;
      }

      if (!this.currentVariant.available) {
        ``;
        this.toggleAddButton(true, window.variantStrings.soldOut);
      }

      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.toggleDisableSize();
    }

    updateOptions() {
      this.options = Array.from(
        this.querySelectorAll('input[type="radio"]:checked, select'),
        el => el.value
      );
    }

    updateVariant() {
      this.currentVariant = this.variants.find(variant => {
        return !variant.options
          .map((option, index) => this.options[index] === option)
          .includes(false);
      });
    }

    updateMedia() {
      if (!this.currentVariant || !this.currentVariant.featured_media)
        return;

      const productMedia =
        this.closest('[data-product]').querySelector('product-media');
      productMedia.setActiveMedia(
        this.currentVariant.featured_media.id
      );
    }

    updateURL() {
      if (!this.currentVariant || Shopify.template != 'product')
        return;
      const params = new URLSearchParams(window.location.search);
      params[params.has('variant') ? 'set' : 'append'](
        'variant',
        this.currentVariant.id
      );
      window.history.replaceState(
        {},
        '',
        `${this.dataset.url}?${params.toString()}`
      );
    }

    updateVariantInput() {
      const input = this.querySelector('[name="id"]');
      input.value = this.currentVariant.id;
    }

    setUnavailable() {
      const submitButton = this.querySelector('[name="add"]');
      const price = this.querySelector(
        `#price-${this.dataset.sectionId} .price`
      );

      if (!submitButton) return;
      submitButton.textContent = window.variantStrings.unavailable;
      if (price) price.classList.add('visibility-hidden');

      Array.from(this.querySelectorAll('[data-size]')).map(x =>
        x.removeAttribute('disable')
      );
      this.querySelector('[data-size]:checked').setAttribute(
        'disable',
        ''
      );
    }

    toggleAddButton(disable, text) {
      const submitButton = this.querySelector('[name="add"]');

      if (!submitButton) {
        return;
      }

      if (disable) {
        submitButton.setAttribute('disabled', 'disabled');
        if (text) submitButton.textContent = text;
      } else {
        submitButton.removeAttribute('disabled');
        submitButton.textContent = window.variantStrings.addToCart;
      }
    }

    toggleDisableSize() {
      if (!this.querySelector('[data-size]:checked')) return;

      Array.from(this.querySelectorAll('[data-size]')).map(x =>
        x.removeAttribute('disable')
      );
      if (this.currentVariant.available === false) {
        this.querySelector('[data-size]:checked').setAttribute(
          'disable',
          ''
        );
      }
    }

    renderProductInfo() {
      const params = new URLSearchParams(window.location.search);
      params[params.has('variant') ? 'set' : 'append'](
        'variant',
        this.currentVariant.id
      );
      params.append('section_id', this.dataset.sectionId);

      fetch(`${this.dataset.url}?${params.toString()}`)
        .then(response => response.text())
        .then(responseText => {
          const html = new DOMParser().parseFromString(
            responseText,
            'text/html'
          );

          if (html.querySelector('purchase-options')) {
            this.querySelector('purchase-options').innerHTML =
              html.querySelector('purchase-options').innerHTML;
          }

          if (
            html.querySelector('[data-purchase-options-notification]')
          ) {
            this.querySelector(
              '[data-purchase-options-notification]'
            ).innerHTML = html.querySelector(
              '[data-purchase-options-notification]'
            ).innerHTML;
          }

          if (html.querySelector('[data-option-selected-value]')) {
            this.querySelector(
              '[data-option-selected-value]'
            ).innerHTML = html.querySelector(
              '[data-option-selected-value]'
            ).innerHTML;
          }

          if (html.querySelector('[data-quantity-input]')) {
            this.querySelector('[data-quantity-input]').innerHTML =
              html.querySelector('[data-quantity-input]').innerHTML;
          }

          if (html.querySelector('[data-pickup-availability]')) {
            this.querySelector(
              '[data-pickup-availability]'
            ).innerHTML = html.querySelector(
              '[data-pickup-availability]'
            ).innerHTML;

            document.querySelector(
              '#Pickup-Availability-Modal [role="dialog"]'
            ).innerHTML = html.querySelector(
              '[data-pickup-availability] [role="dialog"]'
            )?.innerHTML;
          }

          const destinationPrice = document.querySelector(
            `#price-${this.dataset.sectionId}`
          );
          const sourcePrice = html.querySelector(
            `#price-${this.dataset.sectionId}`
          );

          if (destinationPrice && sourcePrice) {
            destinationPrice.classList.remove('visibility-hidden');
            destinationPrice.innerHTML = sourcePrice.innerHTML;
          }
        });
    }
  }

  customElements.define('product-selector', ProductSelector);
})();
