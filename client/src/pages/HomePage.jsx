import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import InfoBlock from "../components/InfoBlock";
import "./HomePage.scss";

const API_URL = "http://localhost:1337";

export default function HomePage() {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/home-page/populated`);
        const json = await res.json();
        setPageData(json.data);
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
      }
    };

    fetchHomeData();
  }, []);

  if (!pageData) return <p className="loading">Loading...</p>;

  return (
    <div className="home-page">
      {pageData.blocks.map((block) => {
        if (block.__component === "blocks.hero") {
          return (
            <Hero
              key={block.id}
              heading={block.heading}
              logo={block.logo}
              image={block.image}
              cta={block.cta}
              theme={block.theme}
              apiUrl={API_URL}
            />
          );
        }

        if (block.__component === "blocks.info-block") {
          return (
            <InfoBlock
              key={block.id}
              headline={block.headline}
              content={block.content}
              image={block.image}
              cta={block.cta}
              reversed={block.reversed}
              theme={block.theme}
              apiUrl={API_URL}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
