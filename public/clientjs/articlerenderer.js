//Makes an API call and receives the list of articles, and procedurally generates the article cards 
// (author, titles, summaries) for each item, appending them to the `#articles-list-grid` 

// fetch('/api/articles', {
//         method: 'GET', // or 'POST', 'PUT', etc.
//         headers: {
//             // 'Content-Type': 'application/json',
//             // 'Authorization': 'Bearer your_token_here' // If authentication is required
//         },
//         // body: JSON.stringify({ key: 'value' }) // For POST/PUT requests
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json(); // Or response.text() for plain text
//     })
//     .then(data => {
//         console.log('API response:', data);
//         // Process the received data
//     })
//     .catch(error => {
//         console.error('Error calling API:', error);
//     });
    let allarticles=[]
    const sortSelect = document.getElementById('sort-select');
    searchinput = document.getElementById('search-input');


function createArticleCardHTML(article) {

    // I construct the HTML using template literals 
    return `
        <a href="${article.URL}" target="_blank" class="article-card">
            <h3 class="article-title">${article.title}</h3>
            <p class="article-meta">
                Author: ${article.author} | Published: ${article.date}
            </p>
            <p class="article-summary">${article.summary}</p>
            <span class="read-more">Read Full Paper &rarr;</span>
        </a>
    `;
}

function renderArticles(articlesToRender) {
    const articlesgrid = document.getElementById('articles-list-grid');

    // clear previous content 
    articlesgrid.innerHTML = '';
    
    if (!articlesToRender || articlesToRender.length === 0) {
        articlesgrid.innerHTML = '<p class="fact-text" style="grid-column: 1 / -1;">No articles found matching your criteria.</p>';
        return;
    }

    // append each article card to the grid
    articlesToRender.forEach(article => {
        const cardHTML = createArticleCardHTML(article);
        articlesgrid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function sortArticles(articles,sortType){
    let sortedArticles = [...articles]; // Create a copy to avoid mutating the original array
    sortedArticles.sort((a, b) => {
        if (sortType === 'date-desc') {
            return new Date(b.date) - new Date(a.date); // Newest to oldest
        } else if (sortType === 'date-asc') {
            return new Date(a.date) - new Date(b.date); // Oldest to newest
        } else if (sortType === 'author-asc') {
            return a.author.localeCompare(b.author); // A-Z
        } else if (sortType === 'author-desc') {
            return b.author.localeCompare(a.author); // Z-A
        }
    });
    return sortedArticles;
}

function searchArticles(articles, searchTerm) {
    if (!searchTerm) {
        return articles; // If search term is empty, return all articles
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    return articles.filter(article => 
        article.title.toLowerCase().includes(lowerCaseTerm) ||
        article.author.toLowerCase().includes(lowerCaseTerm) ||
        article.summary.toLowerCase().includes(lowerCaseTerm)
    );
}

function handleSortChange() {
    const selectedValue = sortSelect.value;
    
    // 1.change the filtered/sorted list
    const sortedList = sortArticles(allarticles, selectedValue);
    
    // 2.render again
    renderArticles(sortedList);
}

    async function loadArticles() {
        const articlesgrid = document.getElementById('articles-list-grid');
        try {
            const response = await fetch('/api/articles');
            if (!response.ok) {
                articlesgrid.innerHTML = '<p class="feedback-area error" style="grid-column: 1 / -1;">Error loading articles. Please try again later.</p>';
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articles = await response.json();

            allarticles = articles;
            handleSortChange();
            // console.log(articles)
            ;} 
            catch (error) {
            console.error('Error fetching articles:', error);
            if (articlesgrid.innerHTML.includes('Loading')) {
             articlesgrid.innerHTML = '<p class="feedback-area error" style="grid-column: 1 / -1;">Error loading articles. Please check the console for details.</p>';
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // event listener for sort select dropdown
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    } else {
        console.error("Sort select element (#sort-select) not found.");
    }
    
    // Initial load of articles
    loadArticles();
});

    searchinput.addEventListener('input', () => {
        const searchTerm = searchinput.value.trim()
        const filteredArticles = searchArticles(allarticles, searchTerm);
        renderArticles(filteredArticles);
    },);