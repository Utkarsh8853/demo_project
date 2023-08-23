import { Request, Response } from "express";
import { deliveryService } from "../services/delivery.service";
import { status } from "../database/models/mongoDB/order_history.model";

class DeliveryController {
    async orderDelivery(req: Request, res: Response) {
        try {
            const { buyer_id, order_id } = req.body;
            const orderExist = await deliveryService.findOrderInfo(order_id, buyer_id)
            if (!orderExist) {
                return res.status(400).send("No order found")
            }
            const orderDetail = await deliveryService.findOrderById(buyer_id, order_id);
            if (orderDetail.delivery_status === status.delivered) {
                return res.status(400).send("Order already delivered")
            }
            await deliveryService.updateDeliveryStatus(buyer_id, order_id);
            return res.status(200).send(`Your order is delivered`);

        } catch (err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }
}

export const deliveryController = new DeliveryController();