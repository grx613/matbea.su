export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: "Нет номера телефона" });
    return;
  }

  try {
    // 1. Получаем токен
    const r1 = await fetch("https://online.sigmasms.ru/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.SIGMA_USER,
        password: process.env.SIGMA_PASS
      })
    });

    const loginResp = await r1.json();
    if (!loginResp.token) {
      throw new Error("Не удалось получить токен: " + JSON.stringify(loginResp));
    }

    // 2. Генерируем код
    const code = Math.floor(100000 + Math.random() * 900000);

    // 3. Текст SMS
    const smsText = `MATBEA. Внимание, никому не сообщайте код!\nКод подтверждения: ${code}`;

    // 4. Отправляем SMS
    const r2 = await fetch("https://online.sigmasms.ru/api/sendings", {
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

    const sendResp = await r2.json();

    // 5. Возвратим ещё и сам code (на беке сохрани, если нужно контролировать валидацию)
    res.status(200).json({ ok: true, code, sigma: sendResp });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
