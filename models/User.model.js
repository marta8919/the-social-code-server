const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required : true
  },
  email : {
    type: String,
    unique: true,
    required : true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: false
  },
  country : {
    type: String,
    required : false    
  },
  hobbies : String,
  picture: {
    type: String,
    default: "https://res.cloudinary.com/martacloud/image/upload/v1614876843/Humaaans_-_2_Characters_xscl0v.png"
  },
  intro : String,
  followers: Number,
  dateRegistered : {
    type: Date,
    default: Date.now,
    required: true
  },
  dateString: String,
});

const User = model("User", userSchema);

module.exports = User;
