// app/api/eth-price/route.ts

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 30 } } // cache for 30 seconds
    );

    const data = await res.json();
    const price = data.ethereum.usd;

    return Response.json({ price });
  } catch (err) {
    return Response.json({ error: "Failed to fetch price" }, { status: 500 });
  }
}
