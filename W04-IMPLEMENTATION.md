# W04 Individual Activity: Error Checking and Validation

## Completed requirements

This project implements the requirements from the W04 Individual Activity:

1. **Detailed service errors**
   - `src/js/ExternalServices.mjs` parses the response body as JSON before checking `res.ok`.
   - Failed responses throw `{ name: 'servicesError', message: jsonResponse }`.

2. **Error handling**
   - `src/js/checkout.js` uses `try/catch` around the checkout service call.
   - The user receives a non-blocking error message instead of an intrusive browser alert.

3. **Form validation**
   - Checkout inputs use `required`.
   - Name and address fields use `minlength`.
   - Email uses the HTML email type.
   - The submit handler calls `checkValidity()` and `reportValidity()` before checkout.

4. **Happy path**
   - A successful order redirects to `checkout/success.html`.
   - The cart is cleared from `localStorage` after successful checkout.

5. **Unhappy path / custom alert**
   - `alertMessage(message, scroll = true)` was added to `utils.mjs`.
   - The alert is inserted at the top of `<main>` and can be dismissed with an X button.
   - The page scrolls to the alert by default.

6. **Additional checkout protection**
   - Checkout is prevented when the cart is empty.

## Validation performed

- JavaScript syntax checks passed for the modified `.js` and `.mjs` files.
- The local checkout service was tested for both a successful order and a failed order.
- The successful response returned an order ID.
- The failed response returned `servicesError` and detailed missing-field information.

## Source and live-site evidence

Add the team's actual GitHub source URL and deployed live-site URL to the Canvas submission after pushing/deploying the branch. These URLs cannot be generated from the ZIP alone.
