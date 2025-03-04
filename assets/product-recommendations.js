(() => {
  if (customElements.get('products-recommendations')) {
    return;
  }

  class ProductRecommendations extends HTMLElement {
    constructor() {
      super();

      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        fetch(this.dataset.url)
          .then(response => response.text())
          .then(text => {
            const html = document.createElement('div');
            html.innerHTML = text;
            const recommendations = html.querySelector(
              'product-recommendations'
            );

            this.innerHTML = recommendations.innerHTML;
          });
      };

      new IntersectionObserver(handleIntersection.bind(this), {
        rootMargin: '0px 0px 200px 0px'
      }).observe(this);
    }
  }

  customElements.define(
    'product-recommendations',
    ProductRecommendations
  );
})();
