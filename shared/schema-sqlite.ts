import { sql } from 'drizzle-orm';
import {
  index,
  sqliteTable,
  text,
  real,
  integer,
} from "drizzle-orm/sqlite-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Session storage table for SQLite
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(), // JSON as text in SQLite
    expire: integer("expire", { mode: 'timestamp' }).notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  }),
);

// User storage table for SQLite
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Products table for SQLite
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  sku: text("sku").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  features: text("features"), // JSON string in SQLite
  category: text("category").notNull(),
  inStock: integer("in_stock", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Orders table for SQLite
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default('pending'),
  subtotal: real("subtotal").notNull(),
  tax: real("tax").notNull(),
  shipping: real("shipping").notNull(),
  total: real("total").notNull(),
  paymentMethod: text("payment_method"),
  shippingAddress: text("shipping_address"), // JSON string in SQLite
  billingAddress: text("billing_address"), // JSON string in SQLite
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Order items table for SQLite
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").references(() => orders.id),
  productId: text("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Relations (same as PostgreSQL version)
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

// Schema types (same as PostgreSQL version)
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = typeof orderItems.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;

// Zod schemas
export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);

// Payment types (same as PostgreSQL version)
export type PaymentRequest = {
  orderId: string;
  amount: string;
  encryptedCardData: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
};

export type PaymentResponse = {
  success: boolean;
  transactionId?: string;
  error?: string;
};