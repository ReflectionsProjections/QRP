async function encryptUser(event: Event) {
  event.preventDefault();

  const form = document.getElementById('encryptForm') as HTMLFormElement;


  const userId = (form.elements.namedItem("userId")! as HTMLInputElement).value;
  const date = (form.elements.namedItem("date")! as HTMLInputElement).value;
  const location = (form.elements.namedItem("location")! as HTMLInputElement).value;
  const exp = (form.elements.namedItem("exp")! as HTMLInputElement).value;
  
  // console.log(userId, date, location);
  const JSON_to_encrypt = { 
    "userId": userId,
    "dateTime": date,
    "location": location};
  // console.log(JSON_to_encrypt)
  const response = await fetch('http://localhost:3000/encrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"data": JSON_to_encrypt, "exp": exp}),
  });

  if (response.ok) {
    const { token } = await response.json();
    document.getElementById('encrypted_result')!.innerText = `Token: ${token}`;
  } else {
    document.getElementById('encrypted_result')!.innerText = 'Token: Error encrypting user ID.';
  }
}

async function decryptUser(event: Event) {
  event.preventDefault();
  const decryptJSON = (document.getElementById('encrypted_JSON') as HTMLInputElement).value;

  // console.log("Decrypt lmao");
  // console.log("stringified:" + JSON.stringify({ decryptJSON }),)
  // console.log(decryptJSON);
  const response = await fetch('http://localhost:3000/decrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({encrypted_token: `${decryptJSON}`}),
  });

  if (response.ok) {
    const { token } = await response.json();
    // console.log(JSON.stringify(token))
    document.getElementById('decrypted_result')!.innerText = `Payload: ${JSON.stringify(token.payload)}`;
    document.getElementById('decrypted_result_iat')!.innerText = `Iat Time: ${JSON.stringify((new Date(token.payload.iat * 1000)).toLocaleString('en-US'))}`;

    document.getElementById('decrypted_result_exp')!.innerText = `Exp Time: ${JSON.stringify((new Date(token.payload.exp * 1000)).toLocaleString('en-US',))}`;
    
    if (token.payload.exp < getCurrTime()) {
      document.getElementById('decrypted_result_validity')!.innerText = `Valid: False`;
    } else {
      document.getElementById('decrypted_result_validity')!.innerText = `Valid: True`;

    }
  } else {
    document.getElementById('decrypted_result')!.innerText = 'Error decrypting user ID.';
  }
}

function getCurrTime() {
  return Math.floor(Date.now() / 1000);
}

function dispCurrTime(event: Event) {
  event.preventDefault();
  document.getElementById('currentTimeResult')!.innerText = `Current epoch time (seconds): ${Math.floor(Date.now() / 1000)}`;
}

function convInputTime(event: Event) {
  event.preventDefault();
  const form = document.getElementById('stringToTimeForm') as HTMLFormElement;
  const inputTimeEle = form.elements.namedItem('inputStr') as HTMLInputElement;
  const inputTimeStr = inputTimeEle.value;
  const conved = new Date(inputTimeStr);
  console.log(conved);

  document.getElementById('inputTimeResult')!.innerText = `Converted to epoch time (seconds): ${conved.getTime()/ 1000}`;
}

document.getElementById('encryptForm')!.addEventListener('submit', encryptUser);
document.getElementById('decryptForm')!.addEventListener('submit', decryptUser);
document.getElementById('currentTimeForm')!.addEventListener('submit', dispCurrTime);
document.getElementById('stringToTimeForm')!.addEventListener('submit', convInputTime);

