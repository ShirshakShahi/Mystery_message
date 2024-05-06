import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  console.log(" email inside resend", email);
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("data inside that resend", data);
    return { success: true, message: "verification email sent successfully" };
  } catch (error) {
    console.log("error sending verification email", error);
    return { success: false, message: "failed to send verification email " };
  }
}
