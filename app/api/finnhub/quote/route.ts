import { NextResponse } from "next/server";

export async function GET() {
  // 👀 Para comprobar qué token está viendo el servidor
  const token = process.env.FINNHUB_TOKEN;
  console.log("TOKEN QUE VE EL SERVIDOR:", token);

  // Si no hay token, respondemos directo
  if (!token) {
    return NextResponse.json(
      { error: "FINNHUB_TOKEN no definido en .env.local" },
      { status: 500 }
    );
  }

  const symbol = "OANDA:XAU_USD";
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
    symbol
  )}&token=${token}`;

  try {
    const res = await fetch(url);

    // Leemos la respuesta como texto para poder ver qué devuelve Finnhub
    const text = await res.text();

    // Si Finnhub responde con error (401, 403, 429, etc.)
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Error al obtener la cotización del oro",
          status: res.status,
          raw: text, // lo que Finnhub ha devuelto exactamente
        },
        { status: res.status }
      );
    }

    // Intentamos parsear el JSON (precio actual, etc.)
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // Por si Finnhub devolviera algo raro que no sea JSON
      data = { raw: text };
    }

    // Devolvemos los datos al frontend
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    // Error de red, DNS, etc.
    return NextResponse.json(
      {
        error: "Error inesperado en /api/finnhub/quote",
        details: String(e),
      },
      { status: 500 }
    );
  }
}
