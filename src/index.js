export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response("Static assets binding is not configured.", {
        status: 500,
      });
    }

    return await env.ASSETS.fetch(request);
  },
};