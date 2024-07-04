const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;
  
  const doesExist = (username) => {
    
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
  }
  
  if (username && password) {
  
    if (!doesExist(username)) {
  
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } 
    else {
      return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  
  try {
    const filteredBooks = await Promise.resolve(books[0]);
    return res.send((filteredBooks)); 
  } 
  
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  
  try {
    const isbnQuery = req.params.isbn;
    if (isbnQuery) return res.json (books[0][isbnQuery]);
    return res.json(books);
  }

  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {  
  try{
    const authorQuery = req.params.author;
    let filteredBooks = Object.values(books[0]).filter(book => book.author === authorQuery);
    return res.json (filteredBooks);
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res)  => {
  
  try {
    const titleQuery = req.params.title;
    let filteredBooks = Object.values(books[0]).filter(book => book.title === titleQuery);
    return res.json (filteredBooks);
  }

  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
  
});

//  Get book review
public_users.get('/review/:title',function (req, res) {
  
  const isbnQuery = req.params.title;
  let filteredBooks = Object.values(books[0]).filter(book => book.title === isbnQuery);
  
  return res.send(filteredBooks[0].reviews);
});

module.exports.general = public_users;
