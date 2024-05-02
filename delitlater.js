// const dotenv = require("dotenv").config();
// const d=require("./config/cryptoconfig")

// const a={
//     usernames:"hulk",
//     password:"robin"
//   }


//   k=Object.values(a);


// const j=(Math.random()*100000000000).toFixed(0)
// console.log(j+`${k[0]}`)
// h=d(j+"superman")

// console.log(h);

// class jsonresponse{
//   constructor(sessiontoken=null,sessionIssued=null,sessionexpireIn=null){
//   this.rcode=null;
//   this.rmessage=null;
//   this.rtype=null;
//   this.result={
//       sessiontoken:sessiontoken,
//       sessionIssued:sessionIssued,
//       sessionexpireIn:sessionexpireIn,
//   };
//   }
// }

// const k= new jsonresponse();

// console.log(k)



// console.log(Math.floor(Math.random()*100))


const jose = require('node-jose');

async function example() {
    try {
        // Step 1: Generate RSA key pair
        const { publicKey, privateKey } = await jose.JWK.createKey('RSA', 2048, { alg: 'RSA-OAEP-256', use: 'enc' });

        // Step 2: Create a JWE Encrypter using the public key
        const recipient = await jose.JWK.asKey(publicKey, { alg: 'RSA-OAEP-256', use: 'enc' });
        const encrypter = jose.JWE.createEncrypt({ format: 'compact' }, recipient);

        // Step 3: Define the payload (data to be encrypted)
        const payload = {
            message: 'Hello, World!'
        };

        // Step 4: Encrypt the payload
        const encrypted = await encrypter.update(JSON.stringify(payload)).final();

        console.log('Encrypted:', encrypted);

        // Step 5: Create a JWE Decrypter using the private key
        const decrypter = jose.JWE.createDecrypt(privateKey);

        // Step 6: Decrypt the encrypted data
        const decrypted = await decrypter.decrypt(encrypted);

        console.log('Decrypted:', JSON.parse(decrypted.payload.toString()));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

example();


