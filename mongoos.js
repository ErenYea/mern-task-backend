import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email:String,
  password:String,
  type:String
});

export default mongoose.model("users", UserSchema);