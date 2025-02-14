import { z } from "zod";

const requiredString = z.string().trim().min(1, "This field is required");

// Auth

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email"),
  name: requiredString.regex(
    /^[A-Za-z\s]+$/,
    "Name can only contain letters and spaces",
  ),
  password: requiredString.min(
    8,
    "Password must be at least 8 characters long",
  ),
});

export const signInSchema = z.object({
  email: requiredString.email("Invalid email"),
  password: requiredString,
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export type SignInValues = z.infer<typeof signInSchema>;

// Posts

export const createPostSchema = z.object({
  content: requiredString,
});
