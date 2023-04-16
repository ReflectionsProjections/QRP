import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter'
// import { QRCode, ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from 'qrcode-generator-ts/js';
import { QRCode, ErrorCorrectLevel} from 'qrcode-generator-ts/js';

const qrform = document.getElementById("qrinfo") as HTMLFormElement;

var create_qrcode = function(text: string, typeNumber: number,
  errorCorrectionLevel: string) {
  
  var qr = new QRCode();
  qr.setTypeNumber(typeNumber);
  if (errorCorrectionLevel == 'L') {
    qr.setErrorCorrectLevel(ErrorCorrectLevel.L);
  } else if (errorCorrectionLevel == 'M') {
    qr.setErrorCorrectLevel(ErrorCorrectLevel.M);
  } else if (errorCorrectionLevel == 'Q') {
    qr.setErrorCorrectLevel(ErrorCorrectLevel.Q);
  } else {
    qr.setErrorCorrectLevel(ErrorCorrectLevel.H);
  }
  qr.addData(text)
  qr.make();
  var img = document.getElementById("qrcode")!;
  img.setAttribute('src', qr.toDataURL());
};


qrform!.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(qrform);
  // TODO: this code makes me sad, see if there is a more type safe way
  const userID: string = formData.get("userID") as string;
  const isStaff: boolean = Boolean(formData.get("isStaff") as string);
  const location: string = formData.get("location") as string;
  const errlvl = formData.get("errlvl") as string;
  const QRCodeData : {"userID" : string, "isStaff": boolean, "location": string}  = {
    "userID": userID,
    "isStaff": isStaff,
    "location": location
  }
  const QRCodeString = JSON.stringify(QRCodeData);
  let size: number = 1;
  while (true) {
    await new Promise(r => setTimeout(r, 100));
    try{
      create_qrcode(QRCodeString, size, errlvl);
      break;
    }
    catch (e) {
      console.log("QRCode too small, trying again with larger size")
      size += 1;
    }
  }
  
  

})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
