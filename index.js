import Bookmark from './bookmark.js';
import Store from './store.js';
import API from './api.js';

const main = function() {
  console.log('Starting bookmarks app');
  let store = new Store();
  let api = new API('https://thinkful-list-api.herokuapp.com/DanW/bookmarks');
  let bookmark = new Bookmark(store, api);

  api
    .getBookmarks()
    .then(bookmarks => {
      bookmarks.forEach(bm => store.addBookmark(bm));
      bookmark.render();
    })
    .catch(err => {
      console.log(err);
      store.setError(err.message);
      bookmark.render();
    });

  bookmark.bindEventListeners();
};

$(main);
