import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  // ------------------- State Management -------------------
  const [query, setQuery] = useState(""); // User search input
  const [books, setBooks] = useState([]); // Fetched books list
  const [loading, setLoading] = useState(false); // Loading state during API call
  const [error, setError] = useState(""); // Error message handling
  const [selectedBook, setSelectedBook] = useState(null); // Book details for modal view

  // ------------------- API Fetch Function -------------------
  const fetchBooks = async () => {
    // Validate input
    if (!query.trim()) {
      setError("Please enter a book title to search.");
      setBooks([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch book data from Open Library API
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await response.json();

      // Check if valid results exist
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs.slice(0, 20)); // Display only top 20 results for clarity
      } else {
        setError("No books found. Try another title.");
        setBooks([]);
      }
    } catch (err) {
      // Handle network or API failure
      setError("Network error! Please try again later.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Load Last Search -------------------
  useEffect(() => {
    const lastQuery = localStorage.getItem("lastQuery");
    if (lastQuery) {
      setQuery(lastQuery);
      fetchBooks();
    }
  }, []);

  // ------------------- Handle Search -------------------
  const handleSearch = () => {
    localStorage.setItem("lastQuery", query);
    fetchBooks();
  };

  // ------------------- UI Rendering -------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col items-center">
      {/* Header Section */}
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6 text-center">
        📚 Book Finder
      </h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-10 text-blue-600 text-lg font-semibold animate-pulse">
          Loading books...
        </div>
      )}

      {/* ------------------- Books Display Grid ------------------- */}
      <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-6xl px-2">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedBook(book)} // Open modal on click
          >
            {/* Book Cover */}
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
              className="w-40 h-56 object-cover rounded mb-3"
            />

            {/* Book Title */}
            <h3 className="text-lg font-semibold text-blue-700 text-center">
              {book.title}
            </h3>

            {/* Author(s) */}
            <p className="text-sm text-gray-600 text-center mt-1">
              {book.author_name
                ? book.author_name.join(", ")
                : "Unknown Author"}
            </p>
          </div>
        ))}
      </div>

      {/* ------------------- Book Details Modal ------------------- */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
              >
                ✕
              </button>

              {/* Book Details Content */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Large Book Cover */}
                <img
                  src={
                    selectedBook.cover_i
                      ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
                      : "https://via.placeholder.com/150x200?text=No+Cover"
                  }
                  alt={selectedBook.title}
                  className="w-40 h-56 rounded object-cover flex-shrink-0"
                />

                {/* Metadata Section */}
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">
                    {selectedBook.title}
                  </h2>
                  <p className="text-gray-700 mt-1">
                    <strong>Author:</strong>{" "}
                    {selectedBook.author_name
                      ? selectedBook.author_name.join(", ")
                      : "Unknown"}
                  </p>
                  <p className="text-gray-700 mt-1">
                    <strong>Year:</strong>{" "}
                    {selectedBook.first_publish_year || "N/A"}
                  </p>
                  <p className="text-gray-700 mt-1">
                    <strong>Publisher:</strong>{" "}
                    {selectedBook.publisher
                      ? selectedBook.publisher.slice(0, 2).join(", ")
                      : "N/A"}
                  </p>
                  <p className="text-gray-700 mt-2 text-sm">
                    <strong>Subjects:</strong>{" "}
                    {selectedBook.subject
                      ? selectedBook.subject.slice(0, 5).join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
  
