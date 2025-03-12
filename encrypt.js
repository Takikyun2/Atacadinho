const crypto = require("crypto");
const fs = require("fs");

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync("3Ws47PikCIGx", "salt", 32); 
const iv = crypto.randomBytes(16); 

const encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex"); // Salvar IV junto com os dados
};

// Ler o JSON e criptografar
const jsonData = fs.readFileSync("config.json", "utf8");
const encryptedData = encrypt(jsonData);

// Salvar em `config.enc`
fs.writeFileSync("config.enc", encryptedData);

console.log("Arquivo encriptado salvo como config.enc");
