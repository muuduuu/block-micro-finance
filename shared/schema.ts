import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  businessName: text("business_name"),
  businessType: text("business_type"),
  monthlyIncome: decimal("monthly_income", { precision: 10, scale: 2 }),
  yearsInBusiness: integer("years_in_business"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, active, completed
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).default("12.00"),
  termMonths: integer("term_months").default(24),
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }),
  remainingBalance: decimal("remaining_balance", { precision: 10, scale: 2 }),
  smartContractAddress: text("smart_contract_address"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  disbursedAt: timestamp("disbursed_at"),
});

export const repayments = pgTable("repayments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").notNull().references(() => loans.id),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  status: text("status").notNull().default("pending"), // pending, completed, overdue
  paymentMethod: text("payment_method"), // crypto, bank
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  disbursedAt: true,
  status: true,
  monthlyPayment: true,
  remainingBalance: true,
  smartContractAddress: true,
});

export const insertRepaymentSchema = createInsertSchema(repayments).omit({
  id: true,
  createdAt: true,
  paidDate: true,
  status: true,
  transactionHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;
export type InsertRepayment = z.infer<typeof insertRepaymentSchema>;
export type Repayment = typeof repayments.$inferSelect;
