// Configuração do leitor ZXing
const codeReader = new ZXing.BrowserBarcodeReader();

let activeStream = null;

// Função para iniciar o leitor de códigos de barras
function startScanner(idInputCodBarra) {
  codeReader.decodeFromVideoDevice(
    null,
    videoElement,
    (result, error, controls) => {
      if (result) {
        console.log("aaaaaaaa", result.text)
        document.getElementById(idInputCodBarra).value = result.text;
        stopScanner();
        //Mostra a notificacao se houver susseso ao ler o codigo de barra
        const toastLiveExample = document.getElementById("liveToast");
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
      }
      /* if (error) {
        console.error(error);
      } */
    }
  );
}

// encerra o leitor
function stopScanner() {
  if (activeStream) {
    // Para todos os dispositivos de vídeo conectados ao stream
    activeStream.getTracks().forEach((track) => track.stop());
    activeStream = null;
  }
  codeReader.reset(); // Reseta o leitor de códigos
  codeReader.stopContinuousDecode(); // Para a decodificação contínua
}
