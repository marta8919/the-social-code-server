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
    type: String,
    default:""
  },
  link: {
    type: String,
    default: "",
  },
  dateOriginal : {
    type: Date,
  },
  dateString: String,
  hours: {
    type: String,
    required: true
  },
  minutes: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Event = model("Event", EventSchema);

module.exports = Event;