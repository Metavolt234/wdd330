import { checkout } from './ExternalServices.mjs';
import { alertMessage, getLocalStorage } from './utils.mjs';

class CheckoutProcess {
  constructor(form) {
    this.form = form;
  }

  async checkout() {
    const order = Object.fromEntries(new FormData(this.form).entries());
    const cart = getLocalStorage('so-cart') || [];

    if (!cart.length) {
      alertMessage('Your cart is empty. Add a product before placing an order.');
      return;
    }

    try {
      const response = await checkout({ ...order, cart });
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
      return response;
    } catch (err) {
      const message = err?.message?.message || 'We could not complete your order. Please check your information and try again.';
      alertMessage(message);
      console.error('Checkout error:', err);
    }
  }
}

const form = document.getElementById('checkout-form');
const myCheckout = new CheckoutProcess(form);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formStatus = form.checkValidity();
  form.reportValidity();

  if (formStatus) {
    myCheckout.checkout();
  }
});
