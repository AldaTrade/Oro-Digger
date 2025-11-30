"use client";

import { useEffect, useState } from "react";

const API_KEY = "100366f9c3dd4a9cbea4dec9653c9824";

export default function GoldNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=gold OR XAUUSD OR metals&sortBy=publishedAt&language=en&pageSize=10&apiKey=${API_KEY}`
        );
        const data = await res.json();
        if (data.articles) setNews(data.articles);
      } catch (e) {
        console.error("Error obteniendo noticias", e);
      }
    }

    loadNews();
    const interval = setInterval(loadNews, 60000); // se actualizan cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        marginTop: 40,
        padding: "20px 24px",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        Noticias sobre el Oro (actualizado cada minuto)
      </div>

      {news.length === 0 ? (
        <div style={{ color: "#888" }}>Cargando noticias…</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {news.map((n, i) => (
            <li key={i} style={{ marginBottom: 14 }}>
              <a
                href={n.url}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "#007aff",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                • {n.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
