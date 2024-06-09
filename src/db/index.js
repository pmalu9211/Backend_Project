//extablishes the connection between the database and the node

import { mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectInstacne = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log("MongoDb connected Host:", connectInstacne.connection.host);
    // app.on("error", (error) => {
    //   console.log(error);
    //   //   throw error;
    // });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
