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

module.exports = router;