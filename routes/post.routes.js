const router = require("express").Router();
const PostModel = require("../models/Post.model.js");
const uploader = require("../utils/cloudinary.config");
const UserModel = require("../models/User.model");
const EventsModel = require("../models/Events.model");


router.get("/board", (req, res, next) => {
  PostModel.find()
    .populate("userId")
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

router.get("/post/:postId", (req, res) => {
  PostModel.findById(req.params.postId)
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

router.delete("/delete/:postId", (req, res) => {
  PostModel.findByIdAndDelete(req.params.postId)
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


router.patch("/event/edit/:id", (req, res) => {
  let id = req.params.id;
  const { title, description, tags, dateEvent, hours, minutes } = req.body;

  if (!description || !title || !dateEvent | !hours || !minutes) {
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
    dateEvent,
    hours,
    minutes,
  })
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

router.post("/publish", (req, res) => {
  
  const {description, tags, picture } = req.body;

  if (!description) {
    res.status(500).json({
      errorMessage: "Please write your post",
    });
    return;
  }

  PostModel.create({
    description,
    tags,
    picture,
    postStatus: "published",
    userId: req.session.loggedInUser._id,
  })
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

router.post("/event/publish", (req, res) => {

  const { title, description, code, tags, picture, postType } = req.body;

  if (!description || !title || !dateEvent | !hours || !minutes) {
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
    picture,
    postStatus: "published",
    dateEvent,
    hours,
    minutes,
    userId: req.session.loggedInUser._id,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({
      //   error: "Something went wrong",
      //   message: err,
      // });
    });
});

router.get("/getpost", (req, res, next) => {
  let user = req.session.loggedInUser;

  PostModel.find({ userId: user._id })
    .populate("userId")
    .then((response) => {
      console.log("hello");
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        message: err,
      });
    });
});

router.post("/profile/upload", uploader.single("imageUrl"), (req, res, next) => {

  let picturePath = "" ;
  req.file ? picturePath = req.file.path : picturePath = "https://res.cloudinary.com/martacloud/image/upload/v1614876843/Humaaans_-_2_Characters_xscl0v.png"

  let editedUser = {
    picture: picturePath
  };

  UserModel.findOneAndUpdate(
    { email: req.session.loggedInUser.email },
    editedUser,
    { new: true })

    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong editting profile",
        message: err,
      });
    });
  });


module.exports = router;
