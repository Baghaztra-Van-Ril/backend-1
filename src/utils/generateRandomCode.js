import crypto from "crypto";

export async function generateRandomCode() {
    const timestamp = Date.now(); // Waktu saat ini (ms)
    const randomPart = crypto.randomBytes(4).toString("hex"); // 8 karakter hex
    return `ORDER-${timestamp}-${randomPart}`;
}