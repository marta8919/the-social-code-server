const router = require("express").Router();
const PostModel = require('../models/Post.model.js')

router.get('/board', (req, res, next) => {
  PostModel.find()
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

router.get('/:postId', (req, res) => {
  PostModel.findById(req.params.postId)
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

router.delete('/:postId', (req, res) => {
  TodoModel.findByIdAndDelete(req.params.postId)
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

router.post('/new-draft', (req, res) => {  
  const {title, description, tags, picture} = req.body;
  
  if(!title || !description) {
    res.status(500).json({
        error: 'Please enter title and description',
   })
  return;  
  }

  PostModel.create({title, description, tags, picture, postType: 'article'})
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

router.patch('/:id/edit-article', (req, res) => {  
  let id = req.params.id
  const {title, description, tags, picture} = req.body;
  
  if(!title || !description) {
    res.status(500).json({
        error: 'Please enter title and description',
   })
  return;  
  }

  PostModel.findByIdAndUpdate(id, {title, description, tags, picture})
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

router.post('/publish', (req, res) => {  
  const {title, description, tags, picture, postType} = req.body;
  
  if(!title || !description) {
    res.status(500).json({
        error: 'Please enter Username. email and password',
   })
  return;  
  }

  PostModel.create({title, description, tags, picture, postStatus: 'published', postType})
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