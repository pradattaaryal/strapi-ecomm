import React from "react";
import Card from "../Card/Card";
import "./FeaturedProducts.scss";
import useFetch from "../../hooks/useFetch";

const FeaturedProducts = ({ type }) => {
  // Fetch all products (adjust your Strapi query as needed)
  const { data, loading, error } = useFetch(`products/filter?page=1&pageSize=4`);

  return (
    <div className="featuredProducts">
      <div className="top">
        <h1>{type} Products</h1>
        <p>
          Explore our curated collection of {type} products — blending style,
          functionality, and craftsmanship. Designed to complement your space
          and lifestyle.
        </p>
      </div>

      <div className="bottom">
        {error && "Something went wrong!"}
        {loading && "Loading..."}
        {!loading &&
          !error &&
          data?.map((item) => <Card item={item} key={item.documentId} />)}
      </div>
    </div>
  );
};

export default FeaturedProducts;
