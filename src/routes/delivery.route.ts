import express from "express";
import { delvieryAccess } from "../middleware/auth.middleware";
import { deliveryController } from "../controllers/delivery.controller";

export const categoryRouter = express.Router();

categoryRouter.put('/delivery', delvieryAccess, deliveryController.orderDelivery);