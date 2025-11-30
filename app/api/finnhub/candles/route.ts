import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = process.env.FINNHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "FINNHUB_TOKEN no definido en .env.local" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);

    const symbol = "OANDA:XAU_USD";
    const resolution = searchParams.get("resolution") ?? "1";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: "Faltan parámetros 'from' o 'to'" },
        { status: 400 }
      );
    }

    const url = `https://finnhub.io/api/v1/forex/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${token}`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Error inesperado en /api/finnhub/candles" },
      { status: 500 }
    );
  }
}
