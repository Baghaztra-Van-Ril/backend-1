import { createConnection } from "./queues/connection.js";

(async () => {
    try {
        const { connection } = await createConnection();
        console.log("✅ RabbitMQ connected successfully");
        connection.close();
    } catch (err) {
        console.error("❌ Failed to connect to RabbitMQ", err);
    }
})();