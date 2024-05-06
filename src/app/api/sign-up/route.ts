import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();
    console.log(email, username, password);
    // Check if user exists by email
    let existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // User exists
      if (existingUser.isVerified) {
        // User is already verified
        return Response.json(
          { success: false, message: "Email is already taken" },
          { status: 400 }
        );
      } else {
        // User exists but not verified
        // Update user info and send verification email
        const verifyCode = Math.floor(1000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.username = username;
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUser.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );

        if (!emailResponse.success) {
          return Response.json(
            { success: false, message: emailResponse.message },
            { status: 500 }
          );
        }

        return Response.json(
          {
            success: true,
            message: "User updated successfully. Please verify user.",
          },
          { status: 200 }
        );
      }
    } else {
      // User does not exist, create a new user
      const verifyCode = Math.floor(1000 + Math.random() * 900000).toString();
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();

      // Send verification email for new user
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          { success: false, message: emailResponse.message },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "User registered successfully. Please verify user.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
