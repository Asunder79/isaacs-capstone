//Receives requests from the client, calls the appropriate model function, and sends the final JSON response back
//Handles API calls like /api/articles, /api/submit, /api/facts, etc.

const express=require('express');
const apiRoutes=express.Router();

const fs = require('fs');
const articlepath = 'server/articles.json'

const factpath = 'server/facts.json'




apiRoutes.use(express.json()); // Middleware to parse JSON bodies

apiRoutes.get('/facts', (req, res) => {
  fs.readFile(factpath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading facts file:', err);
    return;
  }
  try{const facts = JSON.parse(data);
    res.json(facts);
  } 
  catch (parseErr) {
    let errorMessage = 'Error parsing facts JSON: ' + parseErr;
    res.json({ error: errorMessage });
  }
});
});

apiRoutes.get('/articles', (req, res) => {
  fs.readFile(articlepath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading articles file:', err);
    return;
  }
  try{const articles = JSON.parse(data);
    res.json(articles);
  } 
  catch (parseErr) {
    let errorMessage = 'Error parsing articles JSON: ' + parseErr;
    res.json({ error: errorMessage });
  }
});
});


//the endpoint is /api/articles

// apiRoutes.post('')
//read articles from JSON
//respond with the contents of the JSON file
//endpoint is /api/articles

const articleController = require('../controllers/articleController'); 
// Maps the route to the specific logic function in the controller
apiRoutes.post('/submit', articleController.submitNewArticle);

module.exports=apiRoutes;