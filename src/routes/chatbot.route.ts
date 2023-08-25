import express from "express";
import {buyerAccess} from "../middleware/auth.middleware";
import { chatbotController } from "../controllers/chatbot.controller";

export const chatbotRouter = express.Router();

// chatbotRouter.get('/start', buyerAccess, chatbotController.start);
chatbotRouter.post('/order', buyerAccess, chatbotController.Order);
chatbotRouter.post('/orderById', buyerAccess, chatbotController.OrderById);