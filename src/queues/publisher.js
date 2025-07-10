import { createConnection } from "./connection.js";

export async function publishToQueue(queue, data) {
    const retryExchange = `${queue}_retry_exchange`;

    const { channel, connection } = await createConnection();

    await channel.assertQueue(queue, {
        durable: true,
        arguments: {
            'x-dead-letter-exchange': retryExchange,
        },
    });

    await channel.assertExchange(retryExchange, 'direct', { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
        persistent: true,
    });

}
