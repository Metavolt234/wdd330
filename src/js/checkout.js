const form = document.getElementById('checkout-form');
const message = document.getElementById('checkout-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.textContent = 'Thank you! Your order has been received.';
  form.reset();
  localStorage.removeItem('so-cart');
});
