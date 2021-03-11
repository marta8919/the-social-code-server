const router = require("express").Router();
const uploader = require("../utils/cloudinary.config");
const PostModel = require("../models/Post.model.js");
const UserModel = require("../models/User.model");
const EventsModel = require("../models/Events.model");
const { response } = require("express");
const emailController = require("../email/email.controller");

//Update Board
router.get("/board/events", (req, res, next) => {
  EventsModel.find()
    .populate("userId")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

//Get Event Details
router.get("/event/:eventId", (req, res) => {
  EventsModel.findById(req.params.eventId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.post("/event/register/:eventId", (req, res) => {
  let user = req.session.loggedInUser;
  EventsModel.findByIdAndUpdate(req.params.eventId, {
    $push: { registeredUsers: user },
  })
    .then((response) => {
      UserModel.findByIdAndUpdate(user._id, {
        $push: { registeredEvents: response },
      })
        .then(() => {
          UserModel.findById(user._id).then((response) => {
            console.log("see here", response);
            req.session.loggedInUser = response;
            res.status(200).json(response);
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            errorMessage: "Something went wrong",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Something went wrong",
      });
    });
});

router.post("/event/unsubscribe/:eventId", (req, res) => {
  let user = req.session.loggedInUser;
  EventsModel.findByIdAndUpdate(req.params.eventId, {
    $pull: { registeredUsers: { _id: user._id } },
  })
    .then(() => {
      EventsModel.findById(req.params.eventId)
      .then((response) => {
        console.log(response._id);
        UserModel.findByIdAndUpdate(user._id, {
          $pull: { registeredEvents: { _id: response._id } },
        })
          .then(() => {
            UserModel.findById(user._id).then((response) => {
              req.session.loggedInUser = response;
              res.status(200).json(response);
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              errorMessage: "Something went wrong",
            });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Something went wrong",
      });
    });
});

//Edit Events
router.patch("/event/edit/:id", (req, res) => {
  let id = req.params.id;
  const { title, description, link, tags } = req.body;

  if (!title || !description) {
    res.status(500).json({
      errorMessage:
        "Hey there coder! Looks like you forgot to fill in all required fields!",
    });
    return;
  }

  EventsModel.findByIdAndUpdate(id, {
    title,
    description,
    tags,
    link,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

router.delete("/event/delete/:eventId", (req, res) => {
  EventsModel.findByIdAndDelete(req.params.eventId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

//Publish routes
router.post("/event/publish", (req, res) => {
  const {
    title,
    description,
    link,
    tags,
    dateOriginal,
    dateString,
    hours,
    minutes,
  } = req.body;

  if (!title || !description || !dateOriginal | !hours || !minutes) {
    res.status(500).json({
      errorMessage:
        "Hey there coder! Looks like you forgot to fill in all required fields!",
    });
    return;
  }

  EventsModel.create({
    title,
    description,
    tags,
    link,
    dateOriginal,
    dateString,
    hours,
    minutes,
    userId: req.session.loggedInUser._id,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong",
      });
    });
});

//Routes to get info for Profile page
router.get("/getevent", (req, res, next) => {
  let user = req.session.loggedInUser;

  EventsModel.find({ userId: user._id })
    .populate("userId")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

router.get("/getupcomingevent", (req, res, next) => {
  let user = req.session.loggedInUser;

  EventsModel.find({ userId: user._id })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;
