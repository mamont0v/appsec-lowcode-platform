"server-only";
import crypto from "crypto";

const ALGO = "aes-256-gcm"; // вместо CBC
const IV_SIZE = 12;  // GCM рекомендует 12 байт IV
const KEY = process.env.ENCRYPTION_KEY; // 256 бит = 32 байта
if (!KEY) throw new Error("Encryption key not found!");

// Функция шифрования (ключ НЕ сохраняется в БД)
export const symmetricEncryptData = (data: string): string => {
    const iv = crypto.randomBytes(IV_SIZE);
    const key = Buffer.from(KEY, "hex");

    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Сохраняем только IV, зашифрованные данные и authTag
    return `${iv.toString("hex")}:${encrypted.toString("hex")}:${authTag.toString("hex")}`;
};

// Функция дешифрования
export const symmetricDecryptData = (encryptedString: string): string => {
    const [ivHex, encryptedDataHex, authTagHex] = encryptedString.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const encryptedData = Buffer.from(encryptedDataHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = Buffer.from(KEY, "hex");

    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted.toString("utf8");
};

// Пример использования
// const encrypted = encryptData("Hello, World!");
// console.log("🔒 Зашифрованные данные:", encrypted);

// const decrypted = decryptData(encrypted);
// console.log("🔓 Расшифрованные данные:", decrypted);
