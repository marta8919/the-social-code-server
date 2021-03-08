const router = require("express").Router();
const PostModel = require("../models/Post.model.js");

const EventsModel = require("../models/Events.model");

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

//Get Event Details
router.get('/event/:eventId', (req, res) => {
  EventsModel.findById(req.params.eventId)
   .then((response) => {
        res.status(200).json(response)
   })
   .catch((err) => {
        res.status(500).json({
             error: 'Something went wrong',
             message: err
        })
   }) 
})

//Edit Events
router.patch("/event/edit/:id", (req, res) => {
  let id = req.params.id;
  const { title, description, link, tags  } = req.body;

  if (!title || !description) {
    res.status(500).json({
      errorMessage: "Hey there coder! Looks like you forgot to fill in all required fields!",
    });
    return;
  }

  EventsModel.findByIdAndUpdate(id, {
    title,
    description,
    tags,
    link
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
        errorMessage: "Something went wrong",
        message: err,
      });
    });
});

router.post("/event/publish", (req, res) => {

  const { title, description, link, tags, dateOriginal, dateString, hours, minutes  } = req.body;

  if (!title || !description || !dateOriginal | !hours || !minutes) {
    res.status(500).json({
      errorMessage: "Hey there coder! Looks like you forgot to fill in all required fields!",
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

router.get("/getevent", (req, res, next) => {
  let user = req.session.loggedInUser;

  EventsModel.find({ userId: user._id })
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
