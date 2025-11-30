"use client";

import React from "react";

type NewsItem = {
  url: string;
  title: string;
  source?: string;
  date?: string;
};

const mockNews: NewsItem[] = [
  {
    url: "https://www.example.com/gold-1",
    title: "Gold edges higher as traders watch Fed outlook",
    source: "Example News",
    date: "2024-01-15",
  },
  {
    url: "https://www.example.com/gold-2",
    title: "Mining stocks rally on stronger gold prices",
    source: "Markets Daily",
    date: "2024-01-14",
  },
  {
    url: "https://www.example.com/gold-3",
    title: "Analysts see support zone forming in gold futures",
    source: "Commodity Journal",
    date: "2024-01-13",
  },
];

const GoldNews: React.FC = () => {
  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Gold news</h1>
      <p style={{ marginBottom: "16px", color: "#666" }}>
        Static placeholder news while we finish the live Finnhub integration.
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {mockNews.map((n, i) => (
          <li
            key={i}
            style={{
              marginBottom: 14,
              paddingBottom: 12,
              borderBottom: "1px solid #e2e2e2",
            }}
          >
            <a
              href={n.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                textDecoration: "none",
                color: "#0055cc",
              }}
            >
              {n.title}
            </a>
            <div style={{ fontSize: "13px", color: "#777", marginTop: 4 }}>
              {n.source && <span>{n.source}</span>}
              {n.date && (
                <span style={{ marginLeft: 8, opacity: 0.8 }}>{n.date}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoldNews;
