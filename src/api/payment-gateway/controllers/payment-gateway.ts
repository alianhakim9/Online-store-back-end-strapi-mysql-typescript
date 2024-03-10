/**
 * A set of functions called "actions" for `payment-gateway`
 */

import { generateOrderId, generateSHA512Hash } from "../../../utils/helper";

const midtransClient = require("midtrans-client");
const crypto = require("crypto");

export default {
  generate: async (ctx, next) => {
    let id_order;
    const createOrder = async (value) => {
      try {
        await strapi.db.query("api::order.order").create(value);
      } catch (err) {
        console.error("Error creating order: ", err);
      }
    };
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        total_price,
        user,
        // order_detail: { user, order_detail_id, products, quantities },
      } = ctx.request.body;

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      const orderId = generateOrderId();

      let parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Number(total_price),
        },
        customer_details: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          phone: phone,
        },
      };

      let transactionToken = "";

      await snap.createTransaction(parameter).then((transaction) => {
        transactionToken = transaction.token;
        return transactionToken;
      });

      const order = {
        data: {
          order_id: orderId,
          user: user,
          total_price: total_price,
          status: "Pending",
          transaction_token: transactionToken,
          publishedAt: Date.now(),
        },
      };
      createOrder(order);
      return {
        transaction_token: transactionToken,
      };
    } catch (err) {
      ctx.body = err;
      console.log("error", err);
    }
    // const createOrderDetail = async (value) => {
    //   try {
    //     await strapi.db.query("api::order-detail.order-detail").create(value);
    //   } catch (err) {
    //     console.error("Error creating order detail:", err);
    //   }
    // };
    // const productsId = products as string[];
    // productsId.map((item, index) => {
    //   const orderDetail = {
    //     data: {
    //       user,
    //       order_detail_id: order_detail_id,
    //       products: item,
    //       quantity: quantities[index],
    //       publishedAt: Date.now(),
    //     },
    //   };
    //   createOrderDetail(orderDetail);
    // });
  },
  finish: async (ctx, next) => {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
    } = ctx.request.body;

    const hash = crypto.createHash("sha512");
    const data = hash.update(
      `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
      "utf-8"
    );
    const signatureKey = data.digest("hex");

    const updateOrderStatus = async (mStatus: "Expired" | "Completed") => {
      await strapi.db
        .query("api::order.order")
        .findOne({
          where: {
            order_id: order_id,
          },
        })
        .then(async (value) => {
          await strapi.entityService
            .update("api::order.order", value.id, {
              data: {
                status: mStatus === "Completed" ? "Completed" : "Pending",
                updatedAt: Date.now(),
              },
            })
            .then(() => console.log("data updated: Completed"));
        });
    };

    if (signatureKey !== signature_key) {
      return "Unauthorized signature key";
    } else {
      if (transaction_status === "settlement") {
        updateOrderStatus("Completed");
        return "settlement";
      } else if (transaction_status === "expire") {
        updateOrderStatus("Expired");
        return "expire";
      }
    }
    return "payment finished";
  },
};
