import type { NextApiRequest, NextApiResponse } from "next";

type Body = { address?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const body: Body = req.body;
  const address = (body?.address || "").toLowerCase();

  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    // TODO: replace with actual DB upsert
    // Example: await prisma.user.upsert({ where:{ address }, create:{ address }, update:{} })
    console.log("Save address to DB:", address);

    // return a simplified user object
    return res.status(200).json({ success: true, address });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "DB save failed" });
  }
}
