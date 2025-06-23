import { createConnection } from "./connection.js";

export async function publishToQueue(queue, data) {
    const { channel, connection } = await createConnection();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    setTimeout(() => connection.close(), 100);
}
