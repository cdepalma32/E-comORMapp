import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const [saveBook] = useMutation(SAVE_BOOK);
  const searchGoogleBooks = async (query) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Books API');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching Google Books API:', error);
      throw error;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) return;

    try {
      const response = await searchGoogleBooks(searchInput); // Use searchGoogleBooks function
      console.log('Response:', response);
      const { items } = response;
      setSearchedBooks(items || []);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.id === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;

    try {
      await saveBook({
        variables: { bookData: { ...bookToSave } },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book, index) => {
            return (
              <Col md="4" key={index}>
                <Card border="dark">
                  {book.volumeInfo.imageLinks.thumbnail ? (
                    <Card.Img src={book.volumeInfo.imageLinks.thumbnail} alt={`The cover for ${book.volumeInfo.title}`} variant="top" />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.volumeInfo.title}</Card.Title>
                    <p className="small">Authors: {book.volumeInfo.authors}</p>
                    <Card.Text>{book.searchInfo.textSnippet}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.id)}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.id)}
                      >
                        {savedBookIds?.some((savedBookId) => savedBookId === book.id)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
