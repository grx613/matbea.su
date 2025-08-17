import { codesStore } from "./send-sms";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: "Нет данных" });

  const expected = codesStore[phone];
  if (!expected) {
    return res.status(400).json({ error: "Код не запрашивался" });
  }

  if (parseInt(code) === expected) {
    delete codesStore[phone];
    return res.status(200).json({ ok: true });
  } else {
    return res.status(400).json({ ok: false, error: "Неверный код" });
  }
}
