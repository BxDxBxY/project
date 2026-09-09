import { z } from "zod";

// Authentication schemas
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export const tokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const refreshTokenSchema = z.object({
  refresh: z.string().min(1, "Refresh token is required"),
});

// Contact form schema
export const contactSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  email_address: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  recaptchaToken: z.string().optional(),
});

// Category schemas
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters"),
});

export const categoryIdSchema = z.object({
  id: z.coerce.number().int().positive("Invalid category ID"),
});

// Term schemas
export const termSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  definition: z
    .string()
    .min(10, "Definition must be at least 10 characters")
    .max(5000, "Definition must be less than 5000 characters"),
  categories: z.array(z.number().int().positive()).optional(),
  related_terms: z.array(z.number().int().positive()).optional(),
});

export const termIdSchema = z.object({
  id: z.coerce.number().int().positive("Invalid term ID"),
});

// User schemas
export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .optional(),
  is_active: z.boolean().optional(),
  is_staff: z.boolean().optional(),
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive("Invalid user ID"),
});

// Helper function to validate and return errors
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  result.error.issues.forEach((err: any) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return { success: false, errors };
}
