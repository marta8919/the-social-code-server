const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const postSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
  },
  tags: {
    type: String,
    default:""
  },
  picture: {
    type: String,
    default: '../public/images/example.png'
  },
  datePublished : {
    type: Date,
    default: Date.now,
    //required: true
  },
  dateString: {
    type: String,
    default: ""
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    //required: true
  },
  // likes : Number,
  userLikes:{
    type: Array,
    default: [],
  },
  postStatus: {
    type: String,
    default: 'draft'
  },
  postType: {
    type: String,
    default: 'post'
  },
  comments: String
});

const Post = model("Post", postSchema);

module.exports = Post;