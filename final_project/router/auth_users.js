const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  
  if (validusers.length > 0) {
      return true;
  } 
  else {
      return false;
  }

}

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } 
  else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:title", (req, res) => {
  //Write your code here
    const review = req.body.review;
    const username = req.session.authorization['username'];
    const title = req.params.title;
    let required = Object.values(books[0]).find(book => book.title === title); 

    required.reviews[username] = review;
    return res.status(300).json(required.reviews[username]);
    
});

regd_users.delete("/auth/review/:title", (req, res) => {
    //Write your code here
    //   const review = req.body.review;
      const username = req.session.authorization['username'];
      const title = req.params.title;
      let required = Object.values(books[0]).find(book => book.title === title); 
  
    //   required.reviews[username] = "";
      return res.status(204).json(delete required.reviews[username]);
      
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
