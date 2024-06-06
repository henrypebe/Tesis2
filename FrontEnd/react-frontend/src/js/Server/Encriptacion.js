import CryptoJS from 'crypto-js';
import { BASE_URL } from "../../config";

export const getSecretKey = async () => {
    const response = await fetch(`${BASE_URL}/KeyEncript`);
    if (response.ok) {
        return response.text();
    } else {
      throw new Error('Error al obtener la clave secreta');
    }
};

// Función para encriptar un valor
export const encryptValue = (value, secretKey) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
}

// Función para desencriptar un valor
export const decryptValue = (encryptedValue, secretKey) => {
  const bytes  = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}