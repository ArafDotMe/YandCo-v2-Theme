if (!customElements.get('form-validation')) {
  class FormValidation extends HTMLElement {
    constructor() {
      super();
    }

    toggleErrorMessage(input) {
      const errorMessageSpan = this.querySelector('[data-error]');

      if (!errorMessageSpan) return;

      errorMessageSpan.classList.toggle(
        'hidden',
        input.validity.valid
      );
      errorMessageSpan.classList.toggle(
        'has-error',
        !input.validity.valid
      );
    }

    setFieldValidity(input) {
      input.setAttribute('aria-invalid', !input.validity.valid);
      input.classList.toggle('has-error', !input.validity.valid);
      this.toggleErrorMessage(input, input);
    }

    handleSubmit(event) {
      event.preventDefault();
      const isValid = this.form.reportValidity();
      if (isValid) this.form.submit();
    }

    setEventHandlers() {
      for (const input of this.form.elements) {
        if (input.hasAttribute('data-no-validate')) continue;

        input.addEventListener('invalid', event => {
          event.preventDefault();
          this.setFieldValidity(input);
        });

        ['input', 'blur', 'change'].forEach(eventName => {
          input.addEventListener(eventName, () => {
            this.setFieldValidity(input);
          });
        });
      }
    }

    connectedCallback() {
      this.form = this.querySelector('form');
      if (!this.form) return;

      this.form.addEventListener(
        'submit',
        this.handleSubmit.bind(this)
      );

      this.setEventHandlers();
    }
  }

  customElements.define('form-validation', FormValidation);
}
