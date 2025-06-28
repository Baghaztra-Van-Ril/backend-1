import { generatePaymentDataAndCreateSnap } from "../services/payment/payment.service.js";
import { handleNotification } from "../services/payment/notificationHandler.service.js";


export async function createPaymentController(req, res, next) {
    try {
        const user = req.user;
        const result = await generatePaymentDataAndCreateSnap(req.body, user);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

export async function midtransWebhookController(req, res, next) {
    try {
        await handleNotification(req.body);
        res.status(200).json({ success: true, message: "Notification received" });
    } catch (err) {
        next(err);
    }
}
