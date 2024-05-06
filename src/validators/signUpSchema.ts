import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, { message: "username must be less than of 2 characters" })
  .max(20, { message: "username must be more than of 20 characters" });

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 characters long" }),
});
