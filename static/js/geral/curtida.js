// Adiciona evento para todos os botões de curtida
document.querySelectorAll("[id^='curtida']").forEach(function(btn) {
    btn.addEventListener("click", function() {
        // Extrai o id da publicação do id do botão
        const pubIdStr = this.id.replace("curtida", "").trim();
        const pubId = Number(pubIdStr);
        console.log("pubIdStr:", pubIdStr, "pubId:",pubId, typeof(pubId));
        if (!Number.isInteger(pubId) || pubId <= 0) {
            console.error("ID da publicação inválido:", pubIdStr);
            return;
        }
        fetch("/setCurtida", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pub_id: pubId })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta da API:", data);
            if (data.success) {
                // Adiciona a classe 'curtido' ao ícone do coração
                const heartIcon = this.querySelector(".bi-heart");
                if (heartIcon) {
                    heartIcon.classList.add("curtido", 'bi-heart-fill');
                    heartIcon.classList.remove("bi-heart");
                }
            }
            // Aqui você pode atualizar o ícone, contador, etc.
        });
    });
});