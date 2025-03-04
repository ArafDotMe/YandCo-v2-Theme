(() => {
  if (customElements.get('size-guide')) {
    return;
  }

  class SizeGuide extends HTMLElement {
    constructor() {
      super();
      this.data = JSON.parse(
        this.querySelector(
          '[type="application/json"][data-size-guide]'
        ).textContent
      );
      this.toggles = this.querySelectorAll('[data-toggle]');
      this.sizes = this.querySelectorAll('[data-size]');
    }

    connectedCallback() {
      this.toggles.forEach(e => {
        e.addEventListener('click', this.toggleUnit.bind(this));
      });

      this.querySelector('[data-button-calc]').addEventListener(
        'click',
        this.findSize.bind(this)
      );
    }

    findSize(e) {
      e.preventDefault();

      const resultWrapper = this.querySelector(
        '[data-size-result-wrapper]'
      );
      const noResultWrapper = this.querySelector('[data-no-result]');
      const chestTrigger = this.querySelector(
        'input[id="chest"]'
      ).value;
      const waistTrigger = this.querySelector(
        'input[id="waist"]'
      ).value;

      this.querySelector('[data-size][active]')?.removeAttribute(
        'active'
      );

      const currentSize = Array.from(this.sizes).find(
        size =>
          Number(size.dataset.chest) >= chestTrigger &&
          Number(size.dataset.waist) >= waistTrigger
      );

      if (currentSize) {
        noResultWrapper.setAttribute('hidden', '');
        currentSize.setAttribute('active', '');
        resultWrapper.removeAttribute('hidden');
        resultWrapper.querySelector(
          '[data-size-result]'
        ).textContent = currentSize.dataset.size;
      } else {
        resultWrapper.setAttribute('hidden', '');
        noResultWrapper.removeAttribute('hidden');
      }
    }

    toggleUnit(e) {
      const button = e.currentTarget;
      if (button.hasAttribute('active')) {
        return;
      }

      this.toggles.forEach(button =>
        button.toggleAttribute('active')
      );

      const unit = this.querySelector(
        '[data-toggle][active]'
      ).textContent.toLowerCase();

      this.querySelectorAll('[data-field-unit]').forEach(
        field => (field.textContent = unit)
      );

      this.data.forEach(obj => {
        const size = this.querySelector(`[data-size="${obj.name}"]`);
        size.dataset.chest = obj[unit].chest;
        size.dataset.waist = obj[unit].waist;

        size.querySelector('[data-chest-holder]').textContent =
          obj[unit].chest;

        size.querySelector('[data-waist-holder]').textContent =
          obj[unit].waist;
      });

      this.reset();
    }

    reset() {
      this.querySelectorAll('[data-field]').forEach(
        field => (field.value = 0)
      );
      this.querySelector('[data-size-result-wrapper]').setAttribute(
        'hidden',
        ''
      );
      this.querySelector('[data-size][active]')?.removeAttribute(
        'active'
      );
      this.querySelector('[data-no-result]').setAttribute(
        'hidden',
        ''
      );
    }
  }

  customElements.define('size-guide', SizeGuide);
})();
