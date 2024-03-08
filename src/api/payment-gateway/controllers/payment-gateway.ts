/**
 * A set of functions called "actions" for `payment-gateway`
 */

import { generateOrderId } from "../../../utils/helper";

const midtransClient = require("midtrans-client");

export default {
  generate: async (ctx, next) => {
    try {
      // ctx.body = "ok";
      // const body = JSON.parse(ctx.request.body);
      console.log(ctx.request.body);
      const { first_name, last_name, email, phone, total_price } =
        ctx.request.body;
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: generateOrderId(),
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
      return {
        transaction_token: transactionToken,
      };
    } catch (err) {
      ctx.body = err;
      console.log("error", err);
    }
  },
};
