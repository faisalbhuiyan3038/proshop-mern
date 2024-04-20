import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "./../components/Message";
import Loader from "./../components/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { ORDERS_URL } from "../constants";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useMakePaymentMutation,
} from "../slices/ordersApiSlice";

// const [payOrder, {isLoading: loadinPay}] = usePayOrderMutation();

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [makePayment, { isLoadingPay, payerror }] = useMakePaymentMutation();

  const handlePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51Ovjk205VooYGXFiUaM8YZon0wOMNbFstGmrE11RLCvW841p1kHba6sBazvi9iNDOIybnGSax1f6wP7SKsJ5WIaD00ITcxnnzi"
    );

    try {
      const products = order.orderItems;
      const response = await makePayment({ orderItems: products });
      const session = response.data;

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };
  // const handlePayment = async () => {
  //   const stripe = await loadStripe(
  //     "pk_test_51Ovjk205VooYGXFiUaM8YZon0wOMNbFstGmrE11RLCvW841p1kHba6sBazvi9iNDOIybnGSax1f6wP7SKsJ5WIaD00ITcxnnzi"
  //   );

  //   console.log(order.orderItems);

  //   // const body = {
  //   //   products: order.orderItems,
  //   // };

  //   // const headers = {
  //   //   "Content-Type": "application/json",
  //   // };

  //   try {
  //     const products = order.orderItems;
  //     const response = await makePayment({ orderId, products });
  //     const session = await response.json();

  //     const result = stripe.redirectToCheckout({ sessionId: session.id });

  //     if (result.error) {
  //       console.log(result.error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // const response = await fetch(
  //   //   `http://localhost:5000/api/orders/create-checkout-session`,
  //   //   {
  //   //     method: "POST",
  //   //     headers: headers,
  //   //     body: JSON.stringify(body),
  //   //   }
  //   // );
  // };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {
                    <div>
                      <Button
                        onClick={handlePayment}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button>
                    </div>
                  }
                </ListGroup.Item>
              )}

              {/* MARK AS DELIVERED PLACEHOLDER */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
