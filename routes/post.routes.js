const router = require("express").Router();
const PostModel = require("../models/Post.model.js");

router.get("/board", (req, res, next) => {
  PostModel.find()
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
  TodoModel.findByIdAndDelete(req.params.postId)
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

router.post("/new-draft", (req, res) => {
  const { title, description, tags, picture } = req.body;

  if (!title || !description) {
    res.status(500).json({
      error: "Please enter title and description",
    });
    return;
  }

  PostModel.create({
    title,
    description,
    tags,
    picture,
    postType: "article",
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

router.patch("/edit-article/:id", (req, res) => {
  let id = req.params.id;
  const { title, description, tags, picture } = req.body;

  if (!title || !description) {
    res.status(500).json({
      error: "Please enter title and description",
    });
    return;
  }

  PostModel.findByIdAndUpdate(id, { title, description, tags, picture })
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
  const { title, description, tags, picture, postType } = req.body;

  if (!description) {
    res.status(500).json({
      errorMessage: "Please write your post",
    });
    return;
  }

  PostModel.create({
    title,
    description,
    tags,
    picture,
    postStatus: "published",
    postType,
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

router.get('/getpost', (req, res, next)=>{

     console.log(req.session.loggedInUser)

     PostModel.find({userId: req.session.loggedInUser._id})
      .populate('userId')
      .then((response)=>{
            res.status(200).json(response)
       })
       .catch((err)=> {
            res.status(500).json({
                 error: 'Something went wrong',
                 message: err,
                 loggedInUser: req.session.loggedInUser
            })
   })
})

module.exports = router;
