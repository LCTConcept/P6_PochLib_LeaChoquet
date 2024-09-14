// Function executed when the window is fully loaded
window.onload = function() {
  initAddBookButton();
  loadBooksFromSession();
};

// Initialize the "Add a Book" button
function initAddBookButton() {
  const button = document.createElement('button');
  button.id = 'ajouterLivreBtn';
  button.textContent = 'Ajouter un livre';
  button.classList.add('btn-add-book');

  const myBooksDiv = document.getElementById('myBooks');
  const separator = myBooksDiv.querySelector('hr');
  myBooksDiv.insertBefore(button, separator);

  button.addEventListener('click', () => {
    if (!document.getElementById('search-container')) {
      createSearchForm(myBooksDiv, separator);
    }
  });
}

// Create and display the search form
function createSearchForm(container, separator) {
  const searchContainer = document.createElement('div');
  searchContainer.id = 'search-container';
  searchContainer.classList.add('search-container');
  
  const form = document.createElement('form');
  form.id = 'search-form';
  form.classList.add('form-search');

  form.innerHTML = `
    <label for="book-title" class="label-title">Titre du livre</label>
    <input type="text" id="book-title" placeholder="Titre du livre" class="input-title">
    <label for="book-author" class="label-author">Auteur</label>
    <input type="text" id="book-author" placeholder="Auteur" class="input-author">
    <button type="submit" id="search-button" class="btn-search">Rechercher</button>
    <button type="button" id="cancel-button" class="btn-cancel">Annuler</button>
  `;

  searchContainer.appendChild(form);
  container.insertBefore(searchContainer, separator);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = form.querySelector('#book-title').value.trim();
    const author = form.querySelector('#book-author').value.trim();
    if (title && author) {
      performSearch(title, author);
    } else {
      alert('Ces deux champs sont obligatoires.');
    }
  });

  document.getElementById('cancel-button').addEventListener('click', () => {
    searchContainer.remove();
  });
}

// Search for a book using the Google Books API
function performSearch(title, author) {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`)
    .then(response => response.json())
    .then(data => displaySearchResults(data))
    .catch(error => console.error('Error fetching search results:', error));
}

// Display search results
function displaySearchResults(data) {
  const searchContainer = document.getElementById('search-container');
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'search-results';
  resultsDiv.classList.add('search-results');

  if (data.totalItems === 0) {
    resultsDiv.textContent = "Aucun livre n'a été trouvé.";
  } else {
    data.items.forEach(item => createBookItem(item, resultsDiv));
  }

  searchContainer.appendChild(resultsDiv);
}

// Create a book item element and add it to the results
function createBookItem(item, container) {
  const book = item.volumeInfo;
  const bookId = item.id;

  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book-item');

  bookDiv.innerHTML = `
    <h3>Titre : ${book.title || 'Titre non disponible'}</h3>
    <p>ID: ${bookId}</p>
    <p>Auteur : ${book.authors ? book.authors[0] : 'Auteur inconnu'}</p>
    <p>Description : ${book.description ? book.description.substring(0, 200) + '...' : 'Information manquante'}</p>
    <img src="${book.imageLinks ? book.imageLinks.thumbnail : 'img/unavailable.png'}" alt="Image du livre">
    <i class="fa-regular fa-bookmark" style="color: #74C0FC"></i>
  `;

  bookDiv.querySelector('.fa-bookmark').addEventListener('click', () => {
    addToPochListe(book, bookId);
  });

  container.appendChild(bookDiv);
}

// Add a book to the Poch'List
function addToPochListe(book, bookId, checkDuplicate = true) {
  if (checkDuplicate && isBookInPochList(bookId)) {
    alert('Ce livre est déjà dans votre poch\'liste.');
    return;
  }

  const pochListeDiv = document.getElementById('poch-liste') || createPochListeDiv();
  const bookItem = createBookItemDiv(book, bookId);

  pochListeDiv.appendChild(bookItem);
  saveBookToSession(book, bookId);
}

// Check if a book is already in the Poch'List
function isBookInPochList(bookId) {
  const currentBooks = JSON.parse(sessionStorage.getItem('pochListe')) || [];
  return currentBooks.some(b => b.id === bookId);
}

// Create a book item element for the Poch'List
function createBookItemDiv(book, bookId) {
  const bookItem = document.createElement('div');
  bookItem.id = bookId;
  bookItem.classList.add('poch-book-item');

  bookItem.innerHTML = `
    <h3>Titre : ${book.title || 'Titre non disponible'}</h3>
    <p>ID: ${bookId}</p>
    <p>Auteur : ${book.authors ? book.authors[0] : 'Auteur inconnu'}</p>
    <p>Description : ${book.description ? book.description.substring(0, 200) + '...' : 'Information manquante'}</p>
    <img src="${book.imageLinks ? book.imageLinks.thumbnail : 'img/unavailable.png'}" alt="Image du livre">
    <i class="fa-solid fa-trash" style="color: #FF6B6B"></i>
  `;

  bookItem.querySelector('.fa-trash').addEventListener('click', () => {
    bookItem.remove();
    removeBookFromSession(bookId);
  });

  return bookItem;
}

// Create the Poch'List div if it doesn't exist yet
function createPochListeDiv() {
  const pochListe = document.createElement('div');
  pochListe.id = 'poch-liste';
  pochListe.classList.add('poch-liste');
  document.body.appendChild(pochListe);
  return pochListe;
}

// Save a book to sessionStorage
function saveBookToSession(book, bookId) {
  const currentBooks = JSON.parse(sessionStorage.getItem('pochListe')) || [];
  if (!isBookInPochList(bookId)) {
    const newBook = {
      id: bookId,
      title: book.title,
      author: book.authors ? book.authors[0] : 'Auteur inconnu',
      description: book.description || '',
      image: book.imageLinks ? book.imageLinks.thumbnail : 'img/unavailable.png'
    };
    currentBooks.push(newBook);
    sessionStorage.setItem('pochListe', JSON.stringify(currentBooks));
  }
}

// Load books saved in sessionStorage
function loadBooksFromSession() {
  const savedBooks = JSON.parse(sessionStorage.getItem('pochListe')) || [];
  const pochListeDiv = document.getElementById('poch-liste') || createPochListeDiv();

  savedBooks.forEach(book => {
    const bookData = {
      title: book.title,
      authors: [book.author],
      description: book.description,
      imageLinks: { thumbnail: book.image }
    };
    addToPochListe(bookData, book.id, false);
  });
}

// Remove a book from sessionStorage
function removeBookFromSession(bookId) {
  const currentBooks = JSON.parse(sessionStorage.getItem('pochListe')) || [];
  const updatedBooks = currentBooks.filter(book => book.id !== bookId);
  sessionStorage.setItem('pochListe', JSON.stringify(updatedBooks));
}
