const mongoose = require("mongoose");

//create user schema
const UserSchema = mongoose.Schema(
    {
     username: {type: String , required: true },
     email: {type: String , required: true },
     password: {type: String , required: true },
   }
);

const UserModel = mongoose.model("users",UserSchema);

module.exports = UserModel;