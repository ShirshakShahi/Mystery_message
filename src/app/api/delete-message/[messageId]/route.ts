import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;

  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  try {
    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message Not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error Deleting Message",
      },
      { status: 500 }
    );
  }
}
