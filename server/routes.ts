import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { processPayment, getPublicKey } from "./paymentService";
import { insertOrderSchema, insertOrderItemSchema, type PaymentRequest } from "@shared/schema";
import { z } from "zod";

const paymentRequestSchema = z.object({
  orderId: z.string(),
  amount: z.string(),
  encryptedCardData: z.string(),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Order routes (protected)
  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
        orderNumber: `SV-${Date.now()}`,
      });

      const order = await storage.createOrder(orderData);

      // Create order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            ...item,
            orderId: order.id,
          });
        }
      }

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const order = await storage.getOrder(req.params.id);
      
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Payment routes
  app.get('/api/payment/public-key', (req, res) => {
    try {
      const publicKey = getPublicKey();
      res.json({ publicKey });
    } catch (error) {
      console.error("Error getting public key:", error);
      res.status(500).json({ message: "Failed to get public key" });
    }
  });

  app.post('/api/process-payment', async (req, res) => {
    try {
      const paymentData = paymentRequestSchema.parse(req.body);
      const result = await processPayment(paymentData);
      
      if (result.success) {
        // Update order status
        await storage.updateOrderStatus(paymentData.orderId, 'completed');
      } else {
        await storage.updateOrderStatus(paymentData.orderId, 'failed');
      }

      res.json(result);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
