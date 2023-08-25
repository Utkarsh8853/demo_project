import { ObjectId } from "mongodb";
import cartModel from "../database/models/mongoDB/cart.model";
import productModel from "../database/models/mongoDB/product.model";
import sellersModel from "../database/models/mongoDB/sellers.model";
import categoryModel from "../database/models/mongoDB/category.model";
import buyersModel from "../database/models/mongoDB/buyers.model";
import order_historyModel from "../database/models/mongoDB/order_history.model";

class ChatbotService {

    async viewName (_id:string) {
        const result:any = await buyersModel.findOne({_id: _id})
        return result.name;
    }

    async myOrder (id:string) {
        const result :  any = await order_historyModel.findOne({buyer_id:id})
        return result.history;
    }

    async generatePayload(history: any[]) {
        const payload = [];
        for (const entry of history) {
            const payloadEntry = {
                title: `Order ID: ${entry._id}`,
                message: `${entry._id}`,
            };
            payload.push(payloadEntry);
        }
        return payload;
    }

    async viewOrder (user_id: string, order_id: string) {
        const result:any = await order_historyModel.findOne({buyer_id: user_id,'history._id':order_id})
        return result;
    }

    async findOrderById (user_id: string, order_id: string) {
        const pipeline = [
            { $match: { buyer_id: new ObjectId(user_id) } },
            { $match: { "history._id": new ObjectId(order_id) } },
            { $unwind: "$history" },
            { $match: { "history._id": new ObjectId(order_id) } },
            { $project: {_id:0,"history.product_id":1, "history.delivery_status":1, "history.quantity":1, "history.unit_price":1, "history.address_id":1}}
        ];
        const matchResult = await order_historyModel.aggregate(pipeline);
        return matchResult[0].history;
    }
    
    async productName (id:string) {
        const result :  any = await productModel.findOne({_id:id})
        return result.name;
    }

    async address (user_id: string, address_id: string) {
        const pipeline = [
            { $match: { _id: new ObjectId(user_id) } },
            { $match: { "address._id": new ObjectId(address_id) } },
            { $unwind: "$address" },
            { $match: { "address._id": new ObjectId(address_id) } },
            { $project: {_id:0, "address.house_no":1, "address.street_no":1, "address.area":1, "address.city":1, "address.state":1, "address.zip_code":1}}
        ];
        const matchResult = await buyersModel.aggregate(pipeline);
        return matchResult[0].address;
    }

//     async isVerifiedUser (_id: string) {
//         const userVerify: any = await sellersModel.findOne({_id: _id});
//         const isApproved = userVerify.admin_approval;
//         return isApproved;
//     }

//     async productExist (_id: string, name: string) {
//         const product: any = await productModel.findOne({seller_id: _id});
//         if(name === product.name ){
//             return true
//         } else {
//             return false;
//         }
//     }

//     async categoryExist (_id: string) {
//         const category: any = await categoryModel.findOne({_id: _id});
//         if(category){
//             return true
//         } else {
//             return false;
//         }
//     }

//     async productEntry (name: string, description:string, price: number, quantity: number,category_id: string, seller_id:string, avg_rating: string) {
//         const createProduct = await productModel.create({name: name, description:description, price: price, quantity: quantity,category_id: category_id, seller_id:seller_id, avg_rating: avg_rating});
//         return createProduct;
//     }

//     async getProduct (product_id: string) {
//         const product: any = await productModel.findOne({_id: product_id});
//         return product;
//     }

//     async productOwner (product_id: string,seller_id: string) {
//         const product: any = await productModel.findOne({_id: product_id});
//         if(seller_id === product.seller_id ){
//             return true
//         } else {
//             return false;
//         }
//     }

//     async productRemove (product_id: string) {
//         await productModel.deleteOne({_id:product_id})
//     }

//     async updateProductInfo (name: string, description:string, price: number, quantity: number,category_id: string,product_id:string) {
//         await productModel.updateOne({_id:product_id},{$set: {name: name,description:description, price: price, quantity: quantity,category_id: category_id}});
//     }

//     async checkProductQuantity (quantity: number) {
//         if(quantity>=1){
//             return true;
//         }
//         return false;
//     }

//     async updateProductQuantity (product_id:string,quantity:number) {
//             const filter1 = { _id:product_id};
//             const update1 = { $inc: { quantity: -quantity }};
//             await productModel.updateOne(filter1, update1);
//     }

//     async addProductToCart (buyer_id: string,product_id: string,unit_price: number) {
//         const userCart:any = await cartModel.findOne({buyer_id: buyer_id});
//         if (userCart) {               
//             const productExist:any = await cartModel.findOne({buyer_id:buyer_id,'cart.product_id':product_id});
//             console.log(productExist)
//             if(productExist){
//                 const filter = { buyer_id:buyer_id,'cart.product_id':product_id };
//                 const update1 = { $inc: { "cart.$.quantity": 1,"cart.$.total_cost": unit_price },$set:{total_amount: productExist.total_amount + unit_price}};
//                 const result = await cartModel.updateOne(filter, update1);
//                 await productService.updateProductQuantity(product_id,1);
//                 return result;
//             }
//             const result = await cartModel.updateOne({buyer_id:buyer_id},{$push: {cart: {product_id: product_id,unit_price:unit_price, total_cost:unit_price}},total_amount: userCart.total_amount + unit_price});
//             await productService.updateProductQuantity(product_id,1);
//             return result;
//         }
//         const newCart = await cartModel.create({buyer_id :buyer_id,total_amount:unit_price,cart: [{product_id:product_id,unit_price: unit_price,total_cost: unit_price}]});
//         await productService.updateProductQuantity(product_id,1);
//         return newCart
//     }

//     async cartProduct (buyer_id: string,product_id: string) {
//         const productExist = await cartModel.findOne({buyer_id:buyer_id,'cart.product_id':product_id});
//         return productExist;
//     }

//     async removeProductFromCart (buyer_id: string,product_id: string,) {
//         const result:any = await productService.findCartProductInfo(product_id,buyer_id)
//         const quantity = result.length > 0 ? result[0].quantity : 0;
//         const total_cost = result.length > 0 ? result[0].total_cost : 0;
//         await cartModel.updateOne({buyer_id:buyer_id},{$pull: { cart: { product_id: product_id } },$inc:{total_amount: -total_cost} })
//         const filter1 = { _id:product_id};
//         const update1 = { $inc: { quantity: quantity }};
//         await productModel.updateOne(filter1, update1);
//     }

//     async myCart (id:string) {
//         const result = await cartModel.findOne({buyer_id:id})
//         return result;
//     }

//     async checkProductAvailablity (productQuantity:number,requiredQuantity: number) {
//         console.log("/////////////",requiredQuantity);
        
//         if(productQuantity>=requiredQuantity){
//             return true;
//         }
//         return false;
//     }

//     async findCartProductInfo (product_id: string,buyer_id: string) {
//         const pipeline = [
//             { $match: { buyer_id: new ObjectId(buyer_id) } },
//             { $match: { "cart.product_id": new ObjectId(product_id) } },
//             { $unwind: "$cart" },
//             { $match: { "cart.product_id": new ObjectId(product_id) } },
//             { $group: { _id: "$cart.product_id", quantity: { $sum: "$cart.quantity" },total_cost: { $sum: "$cart.total_cost" } } }];
//         const matchResult:any = await cartModel.aggregate(pipeline);
//         return matchResult;
//     }

//     async updateProductCartQuantity (buyer_id: string,product_id: string,quantity: number,unit_price:number,current_quantity:number, current_cost: number) {
//         const filter = { buyer_id:buyer_id,'cart.product_id':product_id };
//         const newCost = unit_price*quantity -current_cost
//         const update = { $set: { "cart.$.quantity": quantity,"cart.$.total_cost": unit_price*quantity},$inc:{total_amount: newCost}};
//         const result = await cartModel.updateOne(filter, update);
//         await productService.updateProductQuantity(product_id,quantity-current_quantity);
//         return result;
//     }

//     async findUserCart (user_id: string) {
//         const pipeline = [
//             { $match: { buyer_id: new ObjectId(user_id) } },
//             { $project: { _id: 0, buyer_id:1, "cart.product_id":1, "cart.unit_price":1, "cart.quantity":1}}];
//         const matchResult = await cartModel.aggregate(pipeline);
//         return matchResult[0];
//     }

//     async findAddress (user_id: string, address_id: string) {
//         const address = await buyersModel.findOne({_id:user_id,'address._id':address_id})
//         return address;
//     }

//     async userHistory (buyer_id: string,address_id: string,field:any) {
//         const userCart:any = await order_historyModel.findOne({buyer_id: buyer_id});
//         if (userCart) {               
//             await order_historyModel.findOneAndUpdate(
//                 { buyer_id: buyer_id },
//                 { $push: { history: { $each: field.cart,}}},
//                 { new: true }
//             )
//             await order_historyModel.updateMany(
//                 { buyer_id: buyer_id },
//                 { $set: { "history.$[].address_id": address_id } }
//             );
//             await productService.removeCart(buyer_id);
//         }
//         await order_historyModel.create({buyer_id :buyer_id});
//         await order_historyModel.findOneAndUpdate(
//             { buyer_id: buyer_id },
//             { $push: { history: { $each: field.cart, } } },
//             { new: true }
//         );
//         await order_historyModel.updateMany(
//             { buyer_id: buyer_id },
//             { $set: { "history.$[].address_id": address_id } }
//         );
//         await productService.removeCart(buyer_id);
//     }

//     async removeCart (user_id: string) {
//         await cartModel.deleteOne({buyer_id:user_id})
//     }

//     async findOrderById (user_id: string, order_id: string) {
//         const pipeline = [
//             { $match: { buyer_id: new ObjectId(user_id) } },
//             { $match: { "history._id": new ObjectId(order_id) } },
//             { $unwind: "$history" },
//             { $match: { "history._id": new ObjectId(order_id) } },
//             { $project: {_id:0,"history.product_id":1, "history.delivery_status":1, "history.quantity":1}}
//         ];
//         const matchResult = await order_historyModel.aggregate(pipeline);
//         return matchResult[0].history;
//     }

//     async findOrderInfo (order_id: string,buyer_id: string) {
//         const result = await order_historyModel.findOne({buyer_id:buyer_id,"history._id": order_id})
//         return result;
//     }

//     async cancelOrderProduct (buyer_id: string,order_id: string,field:any) {
//         await order_historyModel.updateOne({buyer_id:buyer_id},{$pull: { history: { _id: order_id } }})
//         await productService.updateProductQuantity(field.product_id,-field.quantity);
        
//     }

//     async myOrder (id:string) {
//         const result = await order_historyModel.findOne({buyer_id:id})
//         return result;
//     }

//     async findProduct (name: string) {
//         const pipeline = [
//             {
//                 $search: {
//                 index: "product_index",
//                 text: { query: name, path: "name"}
//                 }
//             },
//         ];
//         const matchResult = await productModel.aggregate(pipeline);
//         return matchResult;
//     }

//     async updateAvgReview (product_id:string) {
//         const result = await productModel.aggregate([
//             { $match: { _id: new ObjectId(product_id) } },
//             { $unwind: "$review"},
//             { $group: { _id: null, totalRating: { $sum: "$review.rating" }, count: { $sum: 1 }}},
//             { $project: { _id: 0, avgRating: { $divide: ["$totalRating", "$count"] }}}
//         ])
//         await productModel.updateOne({_id:product_id},{$set: {avg_rating: result[0].avgRating.toString()}});
//     }

//     async addReview (product_id:string,rating:string,comment:string,buyer_id:string) {
//         await productModel.updateOne({_id:product_id},{$push: {review: {rating: rating,comment:comment,buyer_id:buyer_id}}});
//         await productService.updateAvgReview(product_id);
//     }

}
export const chatbotService = new ChatbotService()
