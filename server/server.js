const express=require('express');
const app=express();
const port=3000;
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '..', 'public'))); // Serve static files from the public directory 
const apiRoutes=require('./routes/api.js');
app.use('/api', apiRoutes); // Use API routes for any /api/ endpoints

app.use(express.static(path.join(__dirname, '..', 'views', 'html')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});