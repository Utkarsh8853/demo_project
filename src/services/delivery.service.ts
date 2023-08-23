import { ObjectId } from "mongodb";
import order_historyModel, { status } from "../database/models/mongoDB/order_history.model";


class DeliveryService {

    async findOrderInfo (order_id: string,buyer_id: string) {
        const result = await order_historyModel.findOne({buyer_id:buyer_id,"history._id": order_id})
        return result;
    }

    async findOrderById (user_id: string, order_id: string) {
        const pipeline = [
            { $match: { buyer_id: new ObjectId(user_id) } },
            { $match: { "history._id": new ObjectId(order_id) } },
            { $unwind: "$history" },
            { $match: { "history._id": new ObjectId(order_id) } },
            { $project: {_id:0,"history.delivery_status":1}}
        ];
        const matchResult = await order_historyModel.aggregate(pipeline);
        return matchResult[0].history.delivery_status;
    }

    async updateDeliveryStatus (buyer_id: string, order_id: string) {
        await order_historyModel.updateOne({ buyer_id:buyer_id,"history._id": order_id}, { $set: { "history.$.delivery_status": status.delivered } });
      }
}
export const deliveryService = new DeliveryService()