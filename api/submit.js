export default async function handler(req, res) {
  // CORS（コルス） & Preflight（プリフライト）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  // ★君が貼った「正しいn8n Production URL」
  const N8N_WEBHOOK_URL =
    "https://nextasia.app.n8n.cloud/webhook/cd2736d8-52a8-4e1e-b295-de902d2fc54c";

  try {
    // bodyが空の時の保険
    const payload = req.body ?? {};

    const r = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await r.text();

    res.status(200).json({
      ok: true,
      forwarded: true,
      n8n_status: r.status,
      n8n_body: text.slice(0, 2000),
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
