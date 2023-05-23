async function encryptUser(event: Event) {
  event.preventDefault();

  console.log("Encrypt lmao");


  const encryptJSON = (document.getElementById('encryptJSON') as HTMLInputElement).value;
  console.log("encryptJSON:" + encryptJSON);
  console.log("stringified:" + JSON.stringify({ encryptJSON }),)
  const response = await fetch('http://localhost:3000/encrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encryptJSON }),
  });

  if (response.ok) {
    const { token } = await response.json();
    document.getElementById('encryptresult')!.innerText = `Encrypted Token: ${token}`;
  } else {
    document.getElementById('encryptresult')!.innerText = 'Error encrypting user ID.';
  }
}

async function decryptUser(event: Event) {
  event.preventDefault();
  const decryptJSON = (document.getElementById('decryptJSON') as HTMLInputElement).value;

  console.log("Decrypt lmao");
  console.log("stringified:" + JSON.stringify({ decryptJSON }),)
  console.log(decryptJSON);
  const response = await fetch('http://localhost:3000/decrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({encrypted_token: `${decryptJSON}`}),
  });

  if (response.ok) {
    const { token } = await response.json();
    console.log(JSON.stringify(token))
    document.getElementById('decryptresult')!.innerText = `Decrypted Token: ${token.payload.userId}`;
  } else {
    document.getElementById('decryptresult')!.innerText = 'Error decrypting user ID.';
  }
}

document.getElementById('encrypt')!.addEventListener('submit', encryptUser);
document.getElementById('decrypt')!.addEventListener('submit', decryptUser);
