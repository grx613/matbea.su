document.addEventListener("DOMContentLoaded", () => {
  const phoneForm = document.getElementById("phoneForm");
  const codeForm = document.getElementById("codeForm");
  const msg = document.getElementById("msg");
  let currentPhone = null;

  if(phoneForm){
    phoneForm.addEventListener("submit", async e => {
      e.preventDefault();
      currentPhone = document.getElementById("phone").value;
      try {
        let resp = await fetch("/api/send-sms", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ phone: currentPhone })
        });
        let data = await resp.json();
        if(data.ok){
          msg.style.color = "green";
          msg.textContent = "✅ Код отправлен. Введите его ниже.";
          phoneForm.style.display = "none";
          codeForm.style.display = "block";
        } else {
          msg.style.color = "red";
          msg.textContent = "Ошибка отправки";
        }
      } catch(err){
        msg.style.color = "red";
        msg.textContent = "Ошибка сети: " + err.message;
      }
    });
  }

  if(codeForm){
    codeForm.addEventListener("submit", async e => {
      e.preventDefault();
      const code = document.getElementById("code").value.trim();
      try {
        let resp = await fetch("/api/verify-code", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ phone: currentPhone, code })
        });
        let data = await resp.json();
        if(data.ok){
          msg.style.color = "green";
          msg.textContent = "🎉 Вы успешно подписались!";
          codeForm.style.display = "none";
        } else {
          msg.style.color = "red";
          msg.textContent = "❌ " + (data.error || "Неверный код");
        }
      } catch(err){
        msg.style.color = "red";
        msg.textContent = "Ошибка сети: " + err.message;
      }
    });
  }
});
