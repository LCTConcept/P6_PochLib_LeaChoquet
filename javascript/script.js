window.onload = function() {
  const button = document.createElement('button');
  button.id = 'ajouterLivreBtn';
  button.textContent = 'Ajouter un livre';
  button.classList.add('btn-add-book');

  const myBooksDiv = document.getElementById('myBooks');
  const separator = myBooksDiv.querySelector('hr');
  myBooksDiv.insertBefore(button, separator);

  button.addEventListener('click', () => {
    if (!document.getElementById('search-container')) {
      const searchContainer = document.createElement('div');
      searchContainer.id = 'search-container';
      searchContainer.classList.add('search-container');
      
      const form = document.createElement('form');
      form.id = 'search-form';
      form.classList.add('form-search');

      const titleLabel = document.createElement('label');
      titleLabel.htmlFor = 'book-title';
      titleLabel.textContent = 'Titre du livre';
      titleLabel.classList.add('label-title');

      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.id = 'book-title';
      titleInput.placeholder = 'Titre du livre';
      titleInput.classList.add('input-title');

      const authorLabel = document.createElement('label');
      authorLabel.htmlFor = 'book-author';
      authorLabel.textContent = 'Auteur';
      authorLabel.classList.add('label-author');

      const authorInput = document.createElement('input');
      authorInput.type = 'text';
      authorInput.id = 'book-author';
      authorInput.placeholder = 'Auteur';
      authorInput.classList.add('input-author');

      const searchButton = document.createElement('button');
      searchButton.type = 'submit';
      searchButton.id = 'search-button';
      searchButton.textContent = 'Rechercher';
      searchButton.classList.add('btn-search');

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.id = 'cancel-button';
      cancelButton.textContent = 'Annuler';
      cancelButton.classList.add('btn-cancel');

      form.appendChild(titleLabel);
      form.appendChild(titleInput);
      form.appendChild(authorLabel);
      form.appendChild(authorInput);
      form.appendChild(searchButton);
      form.appendChild(cancelButton);

      searchContainer.appendChild(form);
      myBooksDiv.insertBefore(searchContainer, separator);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        if (title && author) {
          performSearch(title, author);
        } else {
          alert('Both fields are required.');
        }
      });

      cancelButton.addEventListener('click', () => {
        searchContainer.remove();
      });
    }
  });
};

function performSearch(title, author) {
  const searchContainer = document.getElementById('search-container');

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`)
    .then(response => response.json())
    .then(data => {
      const resultsDiv = document.createElement('div');
      resultsDiv.id = 'search-results';
      resultsDiv.classList.add('search-results');

      if (data.totalItems === 0) {
        resultsDiv.textContent = "Aucun livre n'a été trouvé.";
      } else {
        data.items.forEach(item => {
          const book = item.volumeInfo;
          const bookDiv = document.createElement('div');
          bookDiv.classList.add('book-item');

          const title = document.createElement('h3');
          title.textContent = book.title;
          bookDiv.appendChild(title);

          const author = document.createElement('p');
          author.textContent = book.authors ? book.authors[0] : 'Auteur inconnu';
          bookDiv.appendChild(author);

          const description = document.createElement('p');
          description.textContent = book.description ? book.description.substring(0, 200) + '...' : 'Information manquante';
          bookDiv.appendChild(description);

          const img = document.createElement('img');
          img.src = book.imageLinks ? book.imageLinks.thumbnail : 'img/unavailable.png';
          img.alt = 'Image du livre';
          bookDiv.appendChild(img);

          // Create bookmark icon
          const bookmarkIcon = document.createElement('i');
          bookmarkIcon.classList.add('fa-regular', 'fa-bookmark');
          bookmarkIcon.style.color = '#74C0FC';
          bookmarkIcon.addEventListener('click', () => {
            addToPochListe(book);
          });
          bookDiv.appendChild(bookmarkIcon);

          resultsDiv.appendChild(bookDiv);
        });
      }

      searchContainer.appendChild(resultsDiv);
    });
}

// Add the book to the "poch'liste"
function addToPochListe(book) {
  const pochListeDiv = document.getElementById('poch-liste');
  if (!pochListeDiv) {
    const pochListe = document.createElement('div');
    pochListe.id = 'poch-liste';
    pochListe.classList.add('poch-liste');
    document.body.appendChild(pochListe);
  }

  const bookItem = document.createElement('div');
  bookItem.id = book.id;
  bookItem.classList.add('poch-book-item');

  const title = document.createElement('h3');
  title.textContent = book.title;
  bookItem.appendChild(title);

  const author = document.createElement('p');
  author.textContent = book.authors ? book.authors[0] : 'Auteur inconnu';
  bookItem.appendChild(author);

  const description = document.createElement('p');
  description.textContent = book.description ? book.description.substring(0, 200) + '...' : 'Information manquante';
  bookItem.appendChild(description);

  const img = document.createElement('img');
  img.src = book.imageLinks ? book.imageLinks.thumbnail : 'path/to/unavailable.png';
  img.alt = 'Image du livre';
  bookItem.appendChild(img);

  // Create trash icon
  const trashIcon = document.createElement('i');
  trashIcon.classList.add('fa-solid', 'fa-trash');
  trashIcon.style.color = '#FF6B6B';
  trashIcon.addEventListener('click', () => {
    bookItem.remove();
  });
  bookItem.appendChild(trashIcon);

  const pochListe = document.getElementById('poch-liste');
  pochListe.appendChild(bookItem);
}
