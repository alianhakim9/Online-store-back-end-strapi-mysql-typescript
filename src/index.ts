import { faker } from "@faker-js/faker";
import { Strapi } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    for (let i = 0; i < 100; i++) {
      const categoryResult = await strapi.entityService.create(
        "api::category.category",
        {
          data: {
            name: faker.commerce.department(),
            publishedAt: Date.now(),
          },
        }
      );
      await strapi.entityService.create("api::product.product", {
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          imgUrl: faker.image.url(),
          price: faker.commerce.price(),
          stock: faker.number.int({
            min: 0,
            max: 100,
          }),
          brand: faker.company.name(),
          category: categoryResult.id,
          isDiscount: i % 2 === 0 ? true : false,
          discount: i % 2 === 0 ? faker.number.int({ min: 10, max: 80 }) : 0,
          weight: faker.number.float(),
          publishedAt: Date.now(),
        },
      });
    }
  },
};
