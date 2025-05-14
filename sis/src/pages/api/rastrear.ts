import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { latitude, longitude } = req.body;
    console.log("📍 Localização recebida:", latitude, longitude);

    // Aqui você pode salvar no banco ou processar como quiser
    return res.status(200).json({ status: "ok" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
