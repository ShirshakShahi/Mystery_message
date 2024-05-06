import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/validators/signUpSchema";

const UsernaemQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validation with zod
    const result = UsernaemQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors.join(",")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      { success: true, message: "username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
