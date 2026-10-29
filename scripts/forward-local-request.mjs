/** Forward a production-origin request to the local build during browser QA. */
function navigationEnded(error) {
  return /Target (?:page, context or browser|page|context|browser) has been closed|Request context disposed|(?:Request|Fetch response) has been disposed/i.test(error.message);
}

export async function forwardLocalRequest(route, local, origin) {
  let response;
  try {
    response = await route.fetch({
      url: local + route.request().url().slice(origin.length),
      maxRedirects: 0,
    });
  } catch (error) {
    if (navigationEnded(error)) return;
    await route.abort();
    return;
  }

  // Fulfillment marks the route handled before it can reject during navigation.
  // Never abort that same route as a fallback for a fulfillment error.
  try {
    await route.fulfill({ response });
  } catch (error) {
    if (!navigationEnded(error)) throw error;
  }
}
