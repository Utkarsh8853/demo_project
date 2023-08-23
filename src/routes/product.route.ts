import express from "express";
import { productController } from "../controllers/product.controller";
import { addProductValidator, updateProductValidator } from "../middleware/joiValidate.middleware";
import { auth, buyerAccess, sellerAccess } from "../middleware/auth.middleware";

export const productRouter = express.Router();

productRouter.post('/product', addProductValidator, sellerAccess, productController.addProduct);
productRouter.get('/product', auth, productController.viewProduct);
productRouter.put('/product', updateProductValidator, sellerAccess, productController.updateProduct);
productRouter.delete('/product', sellerAccess, productController.removeProduct);

productRouter.post('/cart', buyerAccess, productController.addToCart);
productRouter.delete('/cart', buyerAccess, productController.removeFromCart);
productRouter.get('/cart', buyerAccess, productController.viewMyCart);
productRouter.put('/cart', buyerAccess, productController.updateQuantity);

productRouter.post('/order', buyerAccess, productController.buy);
productRouter.delete('/order', buyerAccess, productController.cancelOrder);
productRouter.get('/order', buyerAccess, productController.viewMyOrder);

productRouter.post('/search', buyerAccess, productController.filter);

productRouter.post('/review', buyerAccess, productController.review);