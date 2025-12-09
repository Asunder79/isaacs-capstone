// server/utils/jsonFileManager.js

const fs = require('fs/promises');
const path = require('path');

// The path goes up one level from 'utils' to 'server', then up again to the project root,
// and finally into the 'Data' folder to find 'articles.json'.
const DATA_FILE_PATH = path.join(__dirname, '..', 'articles.json');


 // reads and parses the JSON file containing all articles.
 // returns  promise that resolves with the array of article objects.

async function readArticles() {
    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist yet return an empty array to initialize the system.
        if (error.code === 'ENOENT') {
            console.warn(`Data file not found at ${DATA_FILE_PATH}. Initializing with an empty array.`);
            return [];
        }
        console.error('Error reading article data:', error);
        throw new Error('Failed to read data file.');
    }
}

  //writes the entire array of articles back to the JSON file.
async function writeArticles(articles) {
    try {
        // Convert the JavaScript array to a formatted JSON string
        const jsonString = JSON.stringify(articles, null, 2); 
        await fs.writeFile(DATA_FILE_PATH, jsonString, 'utf-8');
    } catch (error) {
        console.error('Error writing article data:', error);
        throw new Error('Failed to write data file.');
    }
}

module.exports = { readArticles, writeArticles };