const router = require("express").Router();
const uploader = require("../utils/cloudinary.config");
const UserModel = require("../models/User.model");

router.get("/user/:userId", (req, res) => {
  UserModel.findById(req.params.userId)
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

router.patch("/profile/edit", (req, res, next) => {
  let email = req.session.loggedInUser.email;

  const { country, city, hobbies, intro } = req.body;

  UserModel.findOneAndUpdate(
    { email: email },
    { country, city, hobbies, intro },
    { new: true }
  )
    .then((response) => {
      req.session.loggedInUser = response;
      res.status(200).json(response);

      console.log("edited successfully");
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong editing profile",
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
         req.session.loggedInUser = response
         res.status(200).json(response);
       })
       .catch((err) => {
         res.status(500).json({
           errorMessage: "Something went wrong editting profile",
           message: err,
         });
       });
     });

module.exports = router;
