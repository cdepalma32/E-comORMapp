export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  // if (!savedBookIds) {
  //   return false;
  // }

  // added error log statement for debugging
  if (savedBookIds.length === 0) {
    console.warn(`No book IDs found in local storage.`);
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
 
    // added error log statement for debugging
  if (updatedSavedBookIds.length === savedBookIds.length) {
    console.warn(`Book ID: ${bookId} not found in saved books.`);
    return false;
  }
  
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
