//ao clicar no F2 redireciona o usuario a tela de produtos
window.addEventListener("keydown", function (event) {
  if (event.key === "F2" || event.key === "AudioVolumeDown") {
    //AudioVolumeDown seria a tecla F2 no teclado de nootbook
    location.replace("tabela_de_produtos.html");
  }
});
//ao clicar no F3 redireciona o usuario ao caixa
window.addEventListener("keydown", function (event) {
  if (event.key === "F3" || event.key === "AudioVolumeUp") {
    //AudioVolumeUp seria a tecla F3 no teclado de nootbook
    location.replace("tela_caixa.html");
  }
});
