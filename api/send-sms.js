// простейшее хранилище памяти
let codesStore = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Нет номера тел." });

  try {
    // авторизация с Sigma
    const r1 = await fetch("https://online.sigmasms.ru/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.SIGMA_USER,
        password: process.env.SIGMA_PASS
      })
    });
    const loginResp = await r1.json();
    if (!loginResp.token) throw new Error("Не удалось получить токен");

    // генерируем код
    const code = Math.floor(100000 + Math.random() * 900000);
    // сохраняем в store
    codesStore[phone] = code;

    const smsText = `MATBEA. Внимание, никому не сообщайте код!
Код подтверждения: ${code}`;

    // отправка sms
    await fetch("https://online.sigmasms.ru/api/sendings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": loginResp.token
      },
      body: JSON.stringify({
        recipient: phone,
        type: "sms",
        payload: {
          sender: process.env.SIGMA_SENDER,
          text: smsText
        }
      })
    });

    res.status(200).json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// экспортируем store (чтобы другой endpoint мог видеть)
export { codesStore };
