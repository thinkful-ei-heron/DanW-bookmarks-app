import Bookmark from './bookmark.js';
import Store from './store.js';
import API from './api.js';
import Controller from './controller.js';

const main = function() {
  let store = new Store();
  let api = new API('https://thinkful-list-api.herokuapp.com/DanW/bookmarks');
  let bookmark = new Bookmark(store);
  let controller = new Controller(store, api, bookmark);

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

  controller.bindEventListeners();
};

$(main);
