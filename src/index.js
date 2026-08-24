const USERNAME = "gmdm";
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

export default {
  async fetch(request, env) {
    if (!isAuthorized(request)) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Protected Site"',
        },
      });
    }

    if (!env.ASSETS) {
      return new Response("Static assets binding is not configured.", {
        status: 500,
      });
    }

    return await env.ASSETS.fetch(request);
  },
};