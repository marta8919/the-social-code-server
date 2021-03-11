const router = require("express").Router();
const uploader = require("../utils/cloudinary.config");
const PostModel = require("../models/Post.model.js");
const UserModel = require("../models/User.model");
const EventsModel = require("../models/Events.model");
const { response } = require("express");


//Update Board
router.get("/board/posts", (req, res, next) => {
  PostModel.find()
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

//Get post details
router.get("/post/:postId", (req, res) => {
  PostModel.findById(req.params.postId)
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

router.post("/post/like/:postId", (req, res) => {
  let userId = req.session.loggedInUser._id;
  // console.log(userId)
  PostModel.findByIdAndUpdate(req.params.postId, {
    $push: { userLikes: userId },
  })
    .then((response) => {
      UserModel.findByIdAndUpdate(userId, {
        $push: { likedPosts: req.params.postId },
      })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          console.log("user not found");
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

router.post("/post/unlike/:postId", (req, res) => {
  let userId = req.session.loggedInUser._id;
  // console.log(userId)
  PostModel.findByIdAndUpdate(req.params.postId, {
    $pull: { userLikes: userId },
  })
    .then((response) => {
      UserModel.findByIdAndUpdate(userId, {
        $pull: { likedPosts: req.params.postId },
      })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          console.log("user not found");
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

router.delete("/delete/:postId", (req, res) => {
  PostModel.findByIdAndDelete(req.params.postId)
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
//this is a test to deploy
router.post("/publish", uploader.single("imageUrl"), (req, res) => {
  let picturePath = "";
  req.file ? (picturePath = req.file.path) : (picturePath = "");

  const { description, tags } = req.body;
  console.log(description);

  if (!description) {
    res.status(500).json({
      errorMessage: "Please write your post",
    });
    return;
  }

  let date = new Date();
  let currentDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  PostModel.create({
    description,
    tags,
    picture: picturePath,
    postStatus: "published",
    userId: req.session.loggedInUser._id,
    dateString: currentDate,
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

//Routes to get info for Profile page
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
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

module.exports = router;

