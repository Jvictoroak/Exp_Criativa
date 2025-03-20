document.addEventListener("DOMContentLoaded", function () {
    // Pega o conteúdo do header.html
    fetch("../../theme/component/navbar/component.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
        })
        .catch(error => console.error("Erro ao carregar o navbar:", error));

});
