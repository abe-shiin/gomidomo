const USERNAME = "gmdm";
const PASSWORD = "4545072";

export default {
  async fetch(request, env) {
    const authHeader = request.headers.get("Authorization");

    if (authHeader) {
      const [scheme, encoded] = authHeader.split(" ");
      if (scheme === "Basic") {
        const decoded = atob(encoded);
        const [user, pass] = decoded.split(":");

        if (user === USERNAME && pass === PASSWORD) {
          return await env.ASSETS.fetch(request);
        }
      }
    }

    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Site"',
      },
    });
  },
};