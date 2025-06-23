import { createConnection } from "./connection.js";

export async function consumeFromQueue(queue, callback) {
    const { channel } = await createConnection();
    await channel.assertQueue(queue, { durable: true });

    console.log(`📡 Waiting for messages in queue "${queue}"...`);

    channel.consume(queue, (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            console.log("📨 Message received from queue:", data);
            callback(data);
            channel.ack(msg);
        }
    });
}
