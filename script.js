document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("phoneForm");
  if(form){
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const phone = document.getElementById("phone").value;
      try {
        let resp = await fetch("/api/send-sms", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ phone })
        });
        let data = await resp.json();
        if(data.ok){
          document.getElementById("success").style.display = "block";
          form.reset();
        } else {
          alert("Ошибка: " + (data.error || "Не удалось отправить SMS"));
        }
      } catch(err){
        alert("Ошибка соединения: " + err.message);
      }
    });
  }
});
