import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      this.renderNotFound();
      return;
    }

    this.renderProductDetails();

    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    cart.push(this.product);
    setLocalStorage('so-cart', cart);
    alert(`${this.product.Name} was added to your cart.`);
  }

  renderProductDetails() {
    const parent = document.getElementById('product-detail');

    parent.innerHTML = `<article class="product-detail">
      <a class="back-link" href="/index.html">&larr; Back to Products</a>
      <img class="product-detail__image" src="${this.product.Images.PrimaryLarge}" alt="${this.product.Name}">
      <div class="product-detail__info">
        <p class="product-detail__brand">${this.product.Brand.Name}</p>
        <h2>${this.product.Name}</h2>
        <p class="product-detail__price">$${this.product.FinalPrice.toFixed(2)}</p>
        <p>${this.product.DescriptionHtmlSimple}</p>
        <button id="addToCart" type="button">Add to Cart</button>
      </div>
    </article>`;
  }

  renderNotFound() {
    document.getElementById('product-detail').innerHTML = `<section class="not-found">
      <h2>Product Not Found</h2>
      <p>We could not find the requested product.</p>
      <a href="/index.html">Return to Products</a>
    </section>`;
  }
}
