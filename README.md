# WDD 330 W02 - Complete Starter

Includes the W02 Team Activity (Dynamic Product Detail Page) and W02 Individual Activity (Dynamic Product List) in a beginner-friendly project.

## Open in VS Code
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. In the terminal run `npm install`.
4. Run `npm run start`.
5. Open the local URL shown by Vite.

## Important
- Develop in `src`, not `dist`.
- `src/public/json/tents.json` is the data source used by the app.
- `src/product_pages/index.html` is the single dynamic product page.
- Product links use URL parameters such as `?product=880RR`.
- `ProductList.mjs` handles the dynamic product list.
- `ProductDetails.mjs` handles the dynamic product detail page.

## W04 Individual Activity: Error Checking and Validation

The checkout implementation now includes the W04 requirements:

- Parses checkout service responses as JSON before checking the response status.
- Preserves detailed service errors with a `servicesError` object.
- Uses `try/catch` in the checkout process to handle service errors.
- Uses HTML `required`, `minlength`, and `type="email"` validation.
- Uses `checkValidity()` and `reportValidity()` before submitting checkout data.
- Displays non-blocking custom error alerts using `alertMessage(message, scroll = true)`.
- Provides a dedicated checkout success page.
- Clears `so-cart` from localStorage after a successful checkout.
- Prevents checkout when the cart is empty.
