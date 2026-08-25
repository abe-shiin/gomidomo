const USERNAME = "gmdm-2G";
const PASSWORD = "4545072";

function isAuthorized(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  try {
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(":");
    return user === USERNAME && pass === PASSWORD;
  } catch {
    return false;
  }
}

function withNoCache(response) {
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

export default {
  async fetch(request, env) {
    if (!isAuthorized(request)) {
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

    if (!env.ASSETS) {
      return new Response("Static assets binding is not configured.", {
        status: 500,
      });
    }

    const response = await env.ASSETS.fetch(request);
    return withNoCache(response);
  },
};