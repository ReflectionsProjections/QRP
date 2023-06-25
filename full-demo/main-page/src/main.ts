import './style.css'
import { QRCode, ErrorCorrectLevel } from 'qrcode-generator-ts/js';
import QrScanner from 'qr-scanner'

function hello(e: Event) {
    e.preventDefault();
    console.log("hello world!");
}

async function validiateJWT(e: Event) {
    e.preventDefault()
    
}


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

async function generateMinSizeQRCode(text: string) {
    let size: number = 1;
    while (true) {
        await new Promise(r => setTimeout(r, 100));
        try{
            create_qrcode(text, size, 'M');
            break;
        }
        catch (e) {
            console.log(e)
            console.log("QRCode too small, trying again with larger size")
            size += 1;
        }
    }
    document.getElementById("qrcodeSubText")!.innerText = ""

}

async function testForCookieOnClick(e: Event) {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/check-for-cookies', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        const response_json = await response.json();
        
    }
}

async function testForCookie() {
    const response = await fetch('http://localhost:3000/check-for-cookies', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
        const response_json = await response.json();
        
        
        if (response_json.validity == true) {
            // const qrcode_data = await fetch('http://localhost:3000/decrypt', {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ "encrypted_token": response_json.cookie})
            // });
            // const qrcode_data_json = await qrcode_data.json();
            // console.log(qrcode_data_json.token.payload.userId)
            generateMinSizeQRCode(response_json.cookie);
        } else {
            document.getElementById("qrcodeSubText")!.innerText = "Please login to get your QR|P Code"
        }
    }
}


async function login(e: Event) {
    e.preventDefault();
    const userId = (document.getElementById("email")! as HTMLInputElement).value;
    console.log(userId);
    const data = {
        "userId": userId
    }
    const response = await fetch('http://localhost:3000/encrypt-and-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({"data": data, "exp": "10d"})
    })
    const response_json = await response.json();
    console.log(response_json.status);
    testForCookie();
    
}

async function signOut(e: Event) {
    const response = await fetch('http://localhost:3000/deleteCookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
    })
    const response_json = await response.json();
    console.log(response_json.status);
    window.location.reload()
}
window.onload = function () {
    testForCookie()
    document.getElementById('formSubmit')!.addEventListener('click', login);
    // document.getElementById('cookieTest')!.addEventListener('click', testForCookieOnClick);
    document.getElementById('signOut')!.addEventListener('click', signOut);

};



