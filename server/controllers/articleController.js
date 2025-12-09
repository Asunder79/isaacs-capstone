//Handles CRUD for both Articles AND Facts


// importing for file management and AI service
const { readArticles, writeArticles } = require('../utils/jsonFileManager'); 
const { generateSummary } = require('../utils/summarizationAPI');
// const { v4: uuidv4 } = require('uuid'); // Used to generate unique IDs, broken, will fix later

/**
 * Handles a new article submission, calls the external AI summary, 
 * and saves the new article object to the articles.json file.
 */
const submitNewArticle = async (req, res) => {
    // Destructure input fields sent from the client's submissionhandler.js
    const { title, author, pubDate, sourceUrl, notes } = req.body;

    // 1. Server-Side Validation
    if (!title || !author || !pubDate || !sourceUrl) {
        return res.status(400).json({ message: 'Missing required article details (Title, Author, Date, or URL).' });
    }

    try {
        //  generate the Summary using the external AI service

        const summary = "Placeholder TEXT,MANUAL INSERTION ACTIVATED!!"//await generateSummary(sourceUrl, notes); 

        //commented  out, API not built yet, will test fire it after its written
        const allArticles = await readArticles();
        // create the JSON construct for the new article
        const newId = allArticles.length + 1;
        const newArticle = {
            id: newId, // Assign a unique identifier
            title, 
            author, 
            // use 'date' for the client's sorting logic, and 'URL' for the client's click logic
            date: pubDate,
            summary,         
            URL: sourceUrl, 
            // notes: notes || '',
            // isPublished: false, // Default to false, may comment out until manual review process is built
            // createdAt: new Date().toISOString()

            //commented out the past two lines for the time being, until manual review process is built
        };

        // 4. Append the new article object to the array
        allArticles.push(newArticle);

        // 6. Write the updated array back to the JSON file
        await writeArticles(allArticles);

        // 7. Send successful response back to the client
        res.status(201).json({ 
            status: 'success',
            message: 'Article submitted successfully and summary generated. Awaiting review.',
            articleId: newArticle.id
        });

    } catch (error) {
        console.error('Error processing submission:', error.message);
        
        const errorMessage = error.message.includes('summarization API') 
            ? 'Failed to generate summary from the external AI service.' 
            : 'Submission failed due to a server error while saving data.';
            
        res.status(500).json({ status: 'error', message: errorMessage });
    }
};

module.exports = {
    // ... other controller functions, in the event they are added later
    submitNewArticle
};