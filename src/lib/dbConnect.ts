import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("db already connected");
    return;
  }

  try {
    // console.log(process.env.MONGO_URI);
    const db = await mongoose.connect(
      "mongodb://localhost:27017/Mystery_Message"
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.log("db connection failed ", error);
    process.exit(1);
  }
}

export default dbConnect;
