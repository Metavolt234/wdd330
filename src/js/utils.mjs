export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

/**
 * Display a non-blocking alert at the top of the main element.
 * @param {string} message message to display
 * @param {boolean} scroll whether to scroll the page to the alert
 */
export function alertMessage(message, scroll = true) {
  const main = document.querySelector('main');
  if (!main) return;

  const existingAlert = main.querySelector('.alert');
  if (existingAlert) existingAlert.remove();

  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.setAttribute('role', 'alert');
  alert.innerHTML = `
    <p>${message}</p>
    <button type="button" class="alert__close" aria-label="Close message">&times;</button>
  `;

  alert.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      alert.remove();
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
