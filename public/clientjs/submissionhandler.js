//Captures the form submission event, validates the required fields , and sends the data to the server via an API call.
//Maybe have validation? IF time constraints allow it, otherwise just trust the user (BAD IDEA LONG TERM)
//Upon successful submission, it provides user feedback (e.g., a success message or redirection).
//Refer to my own project, the fetchAPI with cartoon characters, etc. for examples of fetch usage, and writing to JSON file.

const submissionForm = document.getElementById('article-submission-form');
const feedbackArea = document.getElementById('submission-feedback');
const submitButton = document.getElementById('submit-button');
const processingNote = document.querySelector('.processing-note'); // the <p> below the button

function displayFeedback(message, type) {
    feedbackArea.textContent = message;
    feedbackArea.className = `feedback-area ${type}`;
    feedbackArea.style.display = 'block';
    
    // Hide the processing note once a final status is received
    processingNote.style.display = 'none'; 
}

// check if form exists on the page and if valid
function validateForm(data) {
    if (!data.title.trim() || !data.sourceUrl.trim() || !data.author.trim() || !data.pubDate.trim()) {
        displayFeedback('Please fill out all required fields (Title, URL, Author, Date).', 'error');
        return false;
    }
    // simple URL format check (not exhaustive, but better than nothing)
    if (!data.sourceUrl.startsWith('http://') && !data.sourceUrl.startsWith('https://')) {
        displayFeedback('The Article URL must start with http:// or https://.', 'error');
        return false;
    }
    return true;
}
// helper function to just give feedback on button press, neat!
function toggleSubmitState(submitting) {
    submitButton.disabled = submitting;
    submitButton.textContent = submitting ? 'Processing Summary...' : 'Submit Article for Review & Summary';
    
    if (submitting) {
        // Show processing note right before the fetch starts
        processingNote.style.display = 'block'; 
    }
}

async function handleSubmission(event){
    event.preventDefault(); // prevent default form submission
    const formData=new FormData(submissionForm);
    const data=Object.fromEntries(formData.entries());

    // Validate form data
    if (!validateForm(data)) {
        return; // stop submission if validation fails
    }
    toggleSubmitState(true); // disable button and show processing state

    try {
const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                //  Map client field names to server-expected field names, like articles.json
                title: data['title'],
                author: data['author'],
                pubDate: data['pubDate'],
                sourceUrl: data['sourceUrl'], // Match server key
                notes: data['notes']
            }),
        });
        const result= await response.json();

        if (response.ok) {
            // success status-201
            displayFeedback(result.message || 'Submission successful! Awaiting review.', 'success');
            submissionForm.reset(); // clear the form on successful submission
        } else {
            // server returned an error status (4xx or 5xx)
            displayFeedback(result.message || 'Submission failed. Check your data.', 'error');
        }
        } catch (error) {
        console.error('Network or unexpected error during submission:', error);
        displayFeedback('An unexpected error occurred. Please check your network connection.', 'error');
    } finally {
        toggleSubmitState(false);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    if (submissionForm) {
        submissionForm.addEventListener('submit', handleSubmission);
    } else {
        console.error("Submission form element (#article-submission-form) not found.");
    }
});