window.onload = function() {
  // Create the button to Add a book
  const button = document.createElement('button');
  button.id = 'ajouterLivreBtn';
  button.textContent = 'Ajouter un livre';
  button.classList.add('button'); // Add button class

  // Get the div #myBooks
  const myBooksDiv = document.getElementById('myBooks');
  
  // Find the <hr> (the separator) and insert the button before it
  const separator = myBooksDiv.querySelector('hr');
  myBooksDiv.insertBefore(button, separator);
  
  // Add event listener to the button
  button.addEventListener('click', () => {
    // Check if the form already exists
    if (!document.getElementById('search-container')) {
      // Create the search container
      const searchContainer = document.createElement('div');
      searchContainer.id = 'search-container';
      
      // Create the form
      const form = document.createElement('form');
      form.id = 'search-form';

      // Create the title label
      const titleLabel = document.createElement('label');
      titleLabel.htmlFor = 'book-title';
      titleLabel.textContent = 'Titre du livre';
      titleLabel.classList.add('input-title')
      
      // Create the title input field
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.id = 'book-title';
      titleInput.placeholder = 'Titre du livre';
      titleInput.classList.add('input-box');
     

      // Create the author label
      const authorLabel = document.createElement('label');
      authorLabel.htmlFor = 'book-author';
      authorLabel.textContent = 'Auteur';
      authorLabel.classList.add('input-title')
      
      // Create the author input field
      const authorInput = document.createElement('input');
      authorInput.type = 'text';
      authorInput.id = 'book-author';
      authorInput.placeholder = 'Auteur';
      authorInput.classList.add('input-box');
      
      // Create the search button
      const searchButton = document.createElement('button');
      searchButton.type = 'submit';
      searchButton.id = 'search-button';
      searchButton.textContent = 'Rechercher';
      searchButton.classList.add('button'); 
      
      // Create the cancel button
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.id = 'cancel-button';
      cancelButton.textContent = 'Annuler';
      
      // Append inputs and buttons to the form
      form.appendChild(titleLabel);
      form.appendChild(titleInput);
      form.appendChild(authorLabel);
      form.appendChild(authorInput);
      form.appendChild(searchButton);
      form.appendChild(cancelButton);
      
      // Append form to the search container
      searchContainer.appendChild(form);
      
      // Find the title "Nouveau Livre"
      const titleElement = myBooksDiv.querySelector('.heading-h2');
      
      // Insert the search container after the title "Nouveau Livre"
      myBooksDiv.insertBefore(searchContainer, separator);
      
      // Add event listener to the form
      form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        const title = titleInput.value.trim(); // Get and trim the book title
        const author = authorInput.value.trim(); // Get and trim the author name
        if (title && author) {
          performSearch(title, author); // Call function to handle search
        } else {
          alert('Both fields are required.'); // Alert if any field is empty
        }
      });

      // Add event listener to the cancel button
      cancelButton.addEventListener('click', () => {
        searchContainer.remove(); // Remove the search container from the DOM
      });
    }
  });
};

// Function to handle search
function performSearch(title, author) {
  console.log(`Searching for book titled "${title}" by ${author}`);
}
