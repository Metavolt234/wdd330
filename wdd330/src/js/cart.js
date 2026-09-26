import { setLocalStorage } from './utils.mjs';

const cartElement = document.getElementById('cart-content');
const cart = JSON.parse(localStorage.getItem('so-cart')) || [];

function renderCart() {
  if (!cart.length) {
    cartElement.innerHTML = `
      <section class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add a tent from the product list to see it here.</p>
        <a class="button" href="/index.html">Continue Shopping</a>
      </section>`;
    return;
  }

  const total = cart.reduce((sum, product) => sum + Number(product.FinalPrice || 0), 0);
  cartElement.innerHTML = `
    <div class="cart-items">
      ${cart.map((product, index) => `
        <article class="cart-item">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
          <div class="cart-item__info">
            <p class="eyebrow">${product.Brand.Name}</p>
            <h2>${product.Name}</h2>
            <p>${product.DescriptionHtmlSimple}</p>
            <button class="remove-button" type="button" data-index="${index}">Remove</button>
          </div>
          <strong>$${Number(product.FinalPrice).toFixed(2)}</strong>
        </article>`).join('')}
    </div>
    <aside class="cart-summary">
      <p>Total</p>
      <h2>$${total.toFixed(2)}</h2>
      <a class="button" href="/checkout/index.html">Proceed to Checkout</a>
    </aside>`;

  cartElement.querySelectorAll('.remove-button').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      setLocalStorage('so-cart', cart);
      renderCart();
    });
  });
}

renderCart();
