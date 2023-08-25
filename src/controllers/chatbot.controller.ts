import { Request,Response } from "express";
import { status } from "../database/models/mongoDB/order_history.model";
import { chatbotService } from "../services/chatbot.service";


class ChatbotController {

    async start (req:Request, res:Response) {
        try {
            const user_id = req.body.id;
            const name = await chatbotService.viewName (user_id);
            const orderLink = "/chatbot/order";
            const contactLink = "/chatbot/contact";
            return res.json({messge:`Hello, ${name}. I am currently working with only order-related query.`,url: {order_history:orderLink,Contact_us:contactLink}});
        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async Order (req:Request, res:Response) {
        try {
            const user_id = req.body.id;
            const result = await chatbotService.myOrder(user_id);
            console.log("///////",result);
            
            const payload = await chatbotService.generatePayload(result);
            console.log(payload);
            
            res.send([{
                "message": "Your order history"
            }, {
                "message": "For more order info choose product",
                "metadata": {
                "contentType": "300",
                    "templateId": "6",
                    "payload": payload
                }
            }])

        } catch(err) {
            console.error(err);
            return res.status(400).send(`Server problem`);
        }
    }

    async OrderById (req:Request, res:Response) {
        try {
            const user_id = req.body.id;
            const order_id = req.body.message
            let result
            try {
                result = await chatbotService.findOrderById(user_id,order_id);
            } catch (error) {
                return res.send([{"message": "I don't understand what you say"}]);
            }
            const product_name = await chatbotService.productName(result.product_id);
            const address_detail = await chatbotService.address(user_id,result.address_id);
            console.log(result);
            console.log("///",product_name);
            console.log("=====",address_detail);
            return res.send([
                {"message": "Your order details"},
                {"message": `Product name: ${product_name}`}, 
                {"message": `Product cost: ${result.unit_price}`},
                {"message": `delivery_status: ${result.delivery_status}`},
                {"message": `Order Quantity: ${result.quantity}`},
                {"message": `Delivery address: house_no: ${address_detail.house_no}\nstreet_no: ${address_detail.street_no}\narea: ${address_detail.area}\ncity: ${address_detail.city}\nstate: ${address_detail.state}\nzip_code: ${address_detail.zip_code}`},
            ])

        } catch(err) {
            console.error(err);
            return res.status(400).send(`I don't understand what you say`);
        }
    }

    // async addProduct(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {name, description, price, quantity, category_id, avg_rating} = req.body;
    //         const isVerify = await productService.isVerifiedUser(user_id);
    //         if (isVerify) {
    //             const isProductExist = await productService.productExist(user_id, name)
    //             if (isProductExist) {
    //                 return res.status(400).send("Product already exist. Update its quantity")
    //             }
    //             const verifyCategory = await productService.categoryExist(category_id);
    //             if (verifyCategory) {
    //                 const newProduct = await productService.productEntry(name, description, price, quantity, category_id, user_id, avg_rating)
    //                 console.log('Product added: ',newProduct);
    //                 return res.status(200).json({result: "product added"});
    //             } 
    //             return res.status(400).json("Category not found");
    //         }
    //         return res.status(400).json("As a seller your kyc is not completed");
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(200).json({result: "Please send proper detail"});
    //     }
    // }

    // async viewProduct(req:Request, res:Response) {
    //     try {
    //         const {product_id} = req.body;
    //         const productDetail = await productService.getProduct(product_id)
    //         console.log('Product detail',productDetail);
    //         return res.status(200).json({productDetail});
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(200).json({result: "wrong product id"});
    //     }
    // }

    // async removeProduct(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {product_id} = req.body;
    //         const productOwnership = await productService.productOwner(product_id, user_id);
    //         if(productOwnership){
    //             await productService.productRemove(product_id);
    //             return res.status(200).send('Product removed');
    //         }
    //         return res.status(400).send(`You don't have ownership of this product to delete`);
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send('provide proper information');
    //     }
    // }

    // async updateProduct(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {product_id, name, description, price, quantity, category_id} = req.body;
    //         const productDetail = await productService.getProduct(product_id)
    //         if( productDetail){
    //             const productOwnership: any = await productService.productOwner(product_id, user_id);
    //             if(productOwnership){
    //                 await productService.updateProductInfo(name, description, price, quantity, category_id,product_id)
    //                 return res.status(200).send('Product info updated');
    //             }
    //             return res.status(400).send(`You don't have ownership of this product to update`);
    //         }
    //         return res.status(200).json({result: "wrong product id"});
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send('provide proper information');
    //     }
    // }

    // async addToCart(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {product_id} = req.body;
    //         const productDetail = await productService.getProduct(product_id)
    //         if (!productDetail) {
    //             return res.status(400).send("No product found")
    //         }
    //         const checkQuantity = await productService.checkProductQuantity(productDetail.quantity)
    //         if(checkQuantity){
    //             const cart = await productService.addProductToCart(user_id,product_id,productDetail.price)
    //             console.log("Product is added to cart ",cart);
    //             return res.status(200).json({cart});
    //         }
    //         return res.status(400).json("Product is out of stock");
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).json({result: "Please send proper detail"});
    //     }
    // }

    // async removeFromCart(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {product_id} = req.body;
    //         const productDetail:any = await productService.cartProduct(user_id,product_id);
    //         if (!productDetail) {
    //             return res.status(400).send("No product found")
    //         }
    //         await productService.removeProductFromCart(user_id,product_id)
    //         console.log("Product is removed from cart");
    //         return res.status(200).send("Product is removed from cart");
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).json({result: "Please send proper detail"});
    //     }
    // }

    // async viewMyCart (req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const result = await productService.myCart(user_id);
    //         return res.status(200).send(result);

    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send(`Server problem`);
    //     }
    // }

    // async updateQuantity(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {product_id, quantity} = req.body;
    //         const productDetail:any = await productService.cartProduct(user_id,product_id);
    //         if (!productDetail) {
    //             return res.status(400).send("No product found")
    //         }
    //         const result: any = await productService.findCartProductInfo(product_id,user_id);
    //         const checkQuantity = await productService.checkProductAvailablity(productDetail.quantity,quantity-result[0].quantity)
    //         if(checkQuantity){
    //             const cart = await productService.updateProductCartQuantity(user_id,product_id,quantity,productDetail.price,result[0].quantity,result[0].total_cost)
    //             console.log("Product is added to cart ",cart);
    //             return res.status(200).json({cart});
    //         }
    //         return res.status(400).json(`You can buy only ${productDetail.quantity} quantity of product `);
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).json({result: "Please send proper detail"});
    //     }
    // }

    // async buy(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {address_id} = req.body;
    //         const findCart = await productService.findUserCart(user_id);
    //         if (!findCart) {
    //             return res.status(400).send("No product found")
    //         }
    //         const addressDetail = await productService.findAddress(user_id,address_id);
    //         if (!addressDetail) {
    //             return res.status(400).send("No address found")
    //         }
    //         await productService.userHistory(user_id,address_id,findCart)
    //         return res.status(400).send("Your order is placed")
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).json({result: "Please send proper detail"});
    //     }
    // }

    // async cancelOrder(req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const {order_id} = req.body;
    //         const orderExist = await productService.findOrderInfo(order_id,user_id)
    //         if(!orderExist){
    //             return res.status(400).send("No order found")
    //         }
    //         const orderDetail = await productService.findOrderById(user_id,order_id);
    //         if (orderDetail.delivery_status === status.delivered) {
    //             return res.status(400).send("Order already delivered you can't cancel it")
    //         }
    //         await productService.cancelOrderProduct(user_id,order_id,orderDetail)
    //         return res.status(400).send("Your order is cancel")
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).json({result: "Please send proper detail"});
    //     }
    // }

    // async viewMyOrder (req:Request, res:Response) {
    //     try {
    //         const user_id = req.body.id;
    //         const result = await productService.myOrder(user_id);
    //         return res.status(200).send(result);

    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send(`Server problem`);
    //     }
    // }

    // async filter(req:Request, res:Response) {
    //     try {
    //         const {name} = req.body;
    //         const products = await productService.findProduct(name);
    //         console.log(products);
    //         return res.status(200).json(products);

    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send("No product found");
    //     }
    // }

    // async review(req:any, res:any) {
    //     try {
    //         const user_id= req.body.id;
    //         const {order_id, rating, comment } = req.body;
    //         const orderExist = await productService.findOrderInfo(order_id,user_id)
    //         if(!orderExist){
    //             return res.status(400).send("No order found")
    //         }
    //         const orderDetail = await productService.findOrderById(user_id,order_id);
    //         if (orderDetail.delivery_status === status.delivered) {
    //             return res.status(400).send("You cannot review as product is not delivered yet")
    //         }
            
    //         await productService.addReview(orderDetail.product_id,rating,comment,user_id)
    //         return res.status(400).send("review is added")
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send("Server problem")
    //     }
    // }

    // async deleteReview(req:any, res:any) {
    //     try {
    //         const user_id= req.body.id;
    //         const {order_id, rating, comment } = req.body;
    //         const orderExist = await productService.findOrderInfo(order_id,user_id)
    //         if(!orderExist){
    //             return res.status(400).send("No order found")
    //         }
    //         const orderDetail = await productService.findOrderById(user_id,order_id);
    //         if (orderDetail.delivery_status === status.delivered) {
    //             return res.status(400).send("You cannot review as product is not delivered yet")
    //         }
    //         await productService.addReview(orderDetail.product_id,rating,comment,user_id)
    //         return res.status(400).send("review is added")
    //     } catch(err) {
    //         console.error(err);
    //         return res.status(400).send("Server problem")
    //     }
    // }
 
}
export const chatbotController = new ChatbotController();
