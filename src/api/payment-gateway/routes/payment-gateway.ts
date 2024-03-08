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
  ],
};
