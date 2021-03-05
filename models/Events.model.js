const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const EventSchema = new Schema({
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
  picture: {
    type: String,
    default: '../public/images/example.png'
  },
  datePublished : {
    type: Date,
    default: Date.now,
  },
  dateString: String,
  dateEvent: {
    type: String,
    required: true
  },
  hours: {
    type: String,
    required: true
  },
  minutes: {
    type: String,
    required: true
  },
  postStatus: {
    type: String,
    default: 'draft'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Event = model("Event", EventSchema);

module.exports = Event;