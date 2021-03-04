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
    default: '../public/images/defaul.png'
  },
  intro : String,
  followers: Number,
  dateRegistered : {
    type: Date,
    default: Date.now,
    required: true
  },
  dateString: String,
  picture: {
    type: String,
    default: "/images/baseProfile.png"
  },
});

const User = model("User", userSchema);

module.exports = User;
