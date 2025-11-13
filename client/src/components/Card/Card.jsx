import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  const uploadBase = process.env.REACT_APP_UPLOAD_URL || " http://localhost:1337";

  return (
    // ✅ Use documentId instead of numeric ID
    <Link className="link" to={`/product/${item.documentId}`}>
      <div className="card">
        <div className="image">
          {/* Display "New Season" badge if applicable */}
          {item?.isNew && <span>New Season</span>}

          {/* Main product image */}
          <img
            src={`${uploadBase}${item?.img?.url}`}
            alt={item?.title}
            className="mainImg"
          />

          {/* Secondary image hover */}
          <img
            src={`${uploadBase}${item?.img2?.url}`}
            alt={item?.title}
            className="secondImg"
          />
        </div>

        {/* Product title */}
        <h2>{item?.title}</h2>

        {/* Product prices */}
        <div className="prices">
          <h3>${(item.price + 20).toFixed(2)}</h3>
          <h3>${item.price.toFixed(2)}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Card;
