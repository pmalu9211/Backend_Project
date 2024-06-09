import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //Who is subscribing to the user (channel)
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //to which user user is subscribed
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
