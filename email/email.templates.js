
const CLIENT_ORIGIN = process.env.ORIGIN


// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: id => ({
    subject: 'React Confirm Email',
    html: `
      Hello! <br></br>

      please click <a href='${CLIENT_ORIGIN}/login'>here</a> to confirm your email address and get access to the full content of The Social Code 🥳 !

      TSC Team
    `,      
    text: `Copy and paste this link: ${CLIENT_ORIGIN}/login`
  })
  
}