import { apiSlice } from "./apiSlice";
import { ORDERS_URL, STRIPE_URL, STRIPE_KEY_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getStripePublishableKey: builder.query({
      query: () => ({
        url: `${STRIPE_KEY_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    makePayment: builder.mutation({
      query: ({ orderItems }) => ({
        url: `${STRIPE_URL}`,
        method: "POST",
        body: { products: orderItems },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetStripePublishableKeyQuery,
  useMakePaymentMutation,
} = ordersApiSlice;
