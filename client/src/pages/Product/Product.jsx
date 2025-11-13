 
import React, { useState } from "react";
import "./Product.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";

const Product = () => {
  const { documentId } = useParams();
  const [selectedImg, setSelectedImg] = useState("img");
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  // 👇 Adjusted endpoint for Strapi v5 (flat response)
  const { data, loading, error } = useFetch(`/products/${documentId}`);

  console.log("Product data:", data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong.</div>;
   return (
    <div className="product">
      <div className="left">
        <div className="images">
          <img
            src={'http://localhost:1337/uploads/dining_8bb4cc38b5.png'}
            alt=""
            onClick={() => setSelectedImg("img")}
          />
          <img
            src={`http://localhost:1337${data?.img2.url}`}
            alt=""
            onClick={() => setSelectedImg("img2")}
          />
        </div>

        <div className="mainImg">
          <img
            src={
             ` http://localhost:1337` +
              data?.[selectedImg]?.url
            }
            alt=""
          />
        </div>
      </div>

      <div className="right">
        <h1>{data?.title}</h1>
        <span className="price">${data?.price}</span>
        <p>{data?.desc}</p>

        <div className="quantity">
          <button onClick={() => setQuantity((prev) => (prev === 1 ? 1 : prev - 1))}>-</button>
          {quantity}
          <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
        </div>

        <button
          className="add"
          onClick={() =>
            dispatch(
              addToCart({
                id: data.id,
                title: data.title,
                desc: data.desc,
                price: data.price,
                img: data.img.url,
                quantity,
              })
            )
          }
        >
          <AddShoppingCartIcon /> ADD TO CART
        </button>

        <div className="links">
          <div className="item">
            <FavoriteBorderIcon /> ADD TO WISH LIST
          </div>
          <div className="item">
            <BalanceIcon /> ADD TO COMPARE
          </div>
        </div>

        <div className="info">
          <span>Vendor: Polo</span>
          <span>Product Type: T-Shirt</span>
          <span>Tag: T-Shirt, Women, Top</span>
        </div>

        <hr />

        <div className="info">
          <span>DESCRIPTION</span>
          <hr />
          <span>ADDITIONAL INFORMATION</span>
          <hr />
          <span>FAQ</span>
        </div>
      </div>
    </div>
  );
};

export default Product;


 