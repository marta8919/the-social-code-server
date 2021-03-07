const router = require("express").Router();
const bcrypt = require('bcryptjs')
const UserModel = require('../models/User.model.js')
const PostModel = require('../models/Post.model')

router.post('/signup', (req, res, next) => {
  const {username, email, password, password2, country, city, hobbies, intro} = req.body

  if (!username || !email || !password || !password2) {
    res.status(500)
      .json({
        errorMessage: 'Hey Coder! Please enter username, email and password'
      });
    return;  
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500).json({
        errorMessage: 'Oups! Our Regex said that your email format not correct'
      });
      return;  
  }
  const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
  if (!myPassRegex.test(password)) {
    res.status(500).json({
      errorMessage: 'Oups! Our Regex said that Password needs to have 8 characters, a number and an Uppercase alphabet'
    });
    return;  
  }

  if(password != password2) {
    res.status(500).json({
      errorMessage: 'Oups! Passwords do not match'
    });
    return;  
  }

  // creating a salt 
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  UserModel.create({username: username.toLowerCase(), email, password: hash, city, country, intro, hobbies})
    .then((user) => {
      // ensuring that we don't share the hash as well with the user
      user.password = "***";
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: 'username or email entered already exists!',
        });
      } 
      else {
        res.status(500).json({
          errorMessage: 'Something went wrong! Go to sleep!',
        });
      }
    })

})

router.post('/signin', (req, res) => {
  const {email, password} = req.body;

  // -----SERVER SIDE VALIDATION ----------
  
  if ( !email || !password) {
      res.status(500).json({
          errorMessage: 'Please enter Username. email and password',
     })
    return;  
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500).json({
          errorMessage: 'Email format not correct',
      })
      return;  
  }
  

  // Find if the user exists in the database 
  UserModel.findOne({email})
    .then((userData) => {
         //check if passwords match
        bcrypt.compare(password, userData.password)
          .then((doesItMatch) => {
              //if it matches
              if (doesItMatch) {
                // req.session is the special object that is available to you
                userData.password = "***";
                req.session.loggedInUser = userData;
                res.status(200).json(userData)
              }
              //if passwords do not match
              else {
                  res.status(500).json({
                      errorMessage: 'Passwords don\'t match',
                  })
                return; 
              }
          })
          .catch(() => {
              res.status(500).json({
                  errorMessage: 'Email format not correct',
              })
            return; 
          });
    })
    //throw an errorMessage if the user does not exists 
    .catch((err) => {
      res.status(500).json({
          errorMessage: 'Email does not exist',
      })
      return;  
    });

});

router.post('/logout', (req, res) => {
  req.session.destroy();
  // Nothing to send back to the user
  res.status(204).json({});
})


// middleware to check if user is loggedIn
const isLoggedIn = (req, res, next) => {  
  if (req.session.loggedInUser) {
      //calls whatever is to be executed after the isLoggedIn function is over
      next()
  }
  else {
      res.status(401).json({
          message: 'Unauthorized user',
          code: 401,
      })
  };
};

router.get("/profile", (req, res) => {
    res.status(200).json(req.session.loggedInUser);  
});


module.exports = router