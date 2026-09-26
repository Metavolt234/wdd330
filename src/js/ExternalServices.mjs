/**
 * Convert a fetch Response to JSON and preserve the server's error details.
 * This mirrors the W04 requirement to parse the response body before checking
 * the response status.
 */
export async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  }

  throw { name: 'servicesError', message: jsonResponse };
}

/**
 * Submit an order to the checkout service.
 *
 * This project does not include a remote order API, so the service is kept
 * local while preserving the same response/error pattern used by the course.
 */
export async function checkout(order) {
  const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city'];
  const missingFields = requiredFields.filter((field) => !order[field]?.trim());

  const response = new Response(
    JSON.stringify(
      missingFields.length
        ? {
            message: 'Please complete all required checkout fields.',
            fields: missingFields,
          }
        : {
            message: 'Order accepted.',
            orderId: `SO-${Date.now()}`,
          }
    ),
    {
      status: missingFields.length ? 400 : 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return convertToJson(response);
}
