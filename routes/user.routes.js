const router = require("express").Router();
const UserModel = require('../models/User.model.js')

router.get('/user/:userId', (req, res) => {
  UserModel.findById(req.params.userId)
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

router.patch('/profile/edit', (req,res,next)=>{

     let email = req.session.loggedInUser.email

     const {country, city, hobbies, intro} = req.body

     UserModel.findOneAndUpdate({email: email}, {country, city, hobbies, intro}, {new: true})
      .then((response)=>{
           res.status(200).json(response)
           console.log("editted successfully")
      })
      .catch((err)=>{
           res.status(500).json({
                error: 'Something went wrong editting profile',
                message: err
           })
      })
})

module.exports = router;