import React from "react";
import "./styles/Hero.scss";

export default function Hero({ heading, logo, image, cta, theme, apiUrl }) {
  return (
    <section className={`hero-section theme-${theme.toLowerCase()}`}>
      <div className="hero-content">
        <div className="logo">
          <img
            src={`${apiUrl}${logo.logoimage.url}`}
            alt={logo.logotext}
            className="logo-image"
          />
          <h1 className="logo-text">{logo.logotext}</h1>
        </div>

        <h2 className="hero-heading">{heading}</h2>

        <a href={cta.href} className="hero-cta">
          {cta.text}
        </a>
      </div>

      <div className="hero-image">
        <img src={`${apiUrl}${image.url}`} alt={heading} />
      </div>
    </section>
  );
}
