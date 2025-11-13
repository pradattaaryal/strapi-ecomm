import React, { useState, useEffect } from "react";
import "./Cart.scss";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, resetCart } from "../../redux/cartReducer";
import { makeRequest } from "../../makeRequest";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe(
    "pk_test_51PBbwFFhrbYI1auhDSTfqxWg5BXCwkadhGzozOn0O3KMpeCLSjXxEW7Wz3p8UcyjqSlF4t2z1YRsCc8ZFv2uYDLU00uXCF1PZI"
  );

  const totalPrice = () => {
    return products
      .reduce((total, item) => total + item.quantity * item.price, 0)
      .toFixed(2);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      const res = await makeRequest.post("/orders", { products });

      await stripe.redirectToCheckout({
        sessionId: res.data.stripeSession.id,
      });
    } catch (err) {
      console.error("Stripe checkout failed:", err);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success") === "true") {
      dispatch(resetCart()); // clear cart on success
    }
  }, [dispatch]);

  return (
    <div className="cart">
      <h1>Products in your cart</h1>

      {products?.map((item) => (
        <div className="item" key={item.id}>
          <img src={` http://localhost:1337${item.img}`} alt={item.title} />
          <div className="details">
            <h1>{item.title}</h1>
            <p>{item.desc?.substring(0, 100)}</p>
            <div className="price">
              {item.quantity} × ${item.price}
            </div>
          </div>
          <DeleteOutlinedIcon
            className="delete"
            onClick={() => dispatch(removeItem(item.id))}
          />
        </div>
      ))}

      <div className="total">
        <span>SUBTOTAL</span>
        <span>${totalPrice()}</span>
      </div>

      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "PROCEED TO CHECKOUT"}
      </button>

      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;
