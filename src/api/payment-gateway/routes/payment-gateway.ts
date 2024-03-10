export default {
  routes: [
    {
      method: "POST",
      path: "/payment-gateway",
      handler: "payment-gateway.generate",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/payment-gateway/callback",
      handler: "payment-gateway.finish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/payment-gateway/callback",
      handler: "payment-gateway.finish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
