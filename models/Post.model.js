const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String
  },
  hobbies : String,
  picture: {
    type: String,
    default: '../public/images/defaul.png'
  },
  intro : String,
  followers: Number,
  datePublished : {
    type: Date,
    default: Date.now,
    required: true
  },
  dateString: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes : Number,
  postStatus: {
    type: String,
    default: 'draft',
    required: true
  },
  postType: {
    type: String,
    default: 'post',
    required: true
  },
  comments: String
});

const Post = model("Post", postSchema);

module.exports = Post;