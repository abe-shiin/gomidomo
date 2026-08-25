export async function onRequest(context) {
  const USERNAME = "gmdm-2G";
  const PASSWORD = "4545072";
  const authHeader = context.request.headers.get("Authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic") {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");

      if (user === USERNAME && pass === PASSWORD) {
        const response = await context.next();
        const headers = new Headers(response.headers);
        headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
        headers.set("Pragma", "no-cache");
        headers.set("Expires", "0");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }
    }
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected Site"',
      "Cache-Control": "private, no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}