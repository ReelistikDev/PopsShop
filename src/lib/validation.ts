import { z } from "zod";

const trim = (v: unknown) =>
  typeof v === "string" ? v.trim() : v === null || v === undefined ? "" : v;

const optionalText = (max: number) =>
  z.preprocess(trim, z.string().max(max).optional().or(z.literal("")));

/**
 * Validates the custom-order form fields (everything except the uploaded photo,
 * which is handled separately as a File in the server action).
 */
export const orderSchema = z.object({
  customerName: z.preprocess(
    trim,
    z.string().min(2, "Please enter your name").max(120),
  ),
  phone: z.preprocess(
    trim,
    z.string().min(7, "Enter a phone number we can text you back at").max(30),
  ),
  email: z.preprocess(
    trim,
    z.union([z.string().email("Enter a valid email address"), z.literal("")]),
  ),
  category: optionalText(60),
  product: optionalText(160),
  dimensions: optionalText(300),
  woodType: optionalText(120),
  finish: optionalText(120),
  quantity: optionalText(40),
  budget: optionalText(80),
  deadline: optionalText(80),
  notes: optionalText(2000),
});

export type OrderInput = z.infer<typeof orderSchema>;
