import React from "react";
import "./styles/InfoBlock.scss";
import { marked } from "marked";
export default function InfoBlock({
  headline,
  content,
  image,
  cta,
  reversed,
  theme,
  apiUrl,
}) {
      const renderedContent = marked.parse(content || "");
  return (
    <section className={`info-block ${reversed ? "reversed" : ""} theme-${theme.toLowerCase()}`}>
      <div className="info-image">
        <img src={`${apiUrl}${image.url}`} alt={headline} />
      </div>

      <div className="info-content">
        <h2 className="info-headline">{headline}</h2>
        <div
          className="info-text"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
        {cta?.length > 0 && (
          <a href={cta[0].href} className="info-cta">
            {cta[0].text}
          </a>
        )}
      </div>
    </section>
  );
}
