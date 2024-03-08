export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      parsedMethod: ["GET", "POST", "PUT", "PATCH"],
    },
  },
  // 'strapi::body',
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
