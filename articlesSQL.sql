-- SQLite
CREATE TABLE articles (
    article_id INTEGER PRIMARY KEY,
    article_title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    publication_date DATE,
    text_summary TEXT,
    article_url TEXT
);

