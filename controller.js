export default class Controller {
  constructor(store, api, bookmark) {
    this.store = store;
    this.api = api;
    this.bookmark = bookmark;
  }

  //
  //handle landing/home page events
  //
  _handleNewBookmarkEvent() {
    $('header').on('click', '.newBookmark', event => {
      this.store.toggleAdding();
      this.bookmark.render();
    });
  }

  _handleFilterChangeEvent() {
    $('header').on('change', '.filter', event => {
      let val = $(event.target).val();
      this.store.setFilter(val);
      this.bookmark.render();
    });
  }

  _handleEditBookmarkEvent() {
    $('main').on('click', '.editBookmark', event => {
      event.stopPropagation();
      let id = $(event.target).data('id');
      this.store.toggleEdit();
      this.bookmark.render(id);
    });
  }

  _handleDeleteBookmarkEvent() {
    $('main').on('click', '.deleteBookmark', event => {
      event.stopPropagation();
      let id = $(event.target).data('id');
      this.api
        .deleteBookmark(id)
        .then(() => {
          this.store.findAndDelete(id);
          this.bookmark.render();
        })
        .catch(err => {
          console.log(err.message);
          this.store.setError(err.message);
          this.bookmark.render();
        });
    });
  }

  _handleExpandBookmarkClick() {
    $('main').on('click', '.bookmarkHeader', event => {
      let id = $(event.target).data('id');
      this.store.toggleExpanded(id);
      this.bookmark.render();
    });
  }

  _handleExpandBookmarkKeyup() {
    $('main').on('keyup', '.bookmarkHeader', event => {
      if (event.keyCode === 13) {
        let id = $(event.target).data('id');
        this.store.toggleExpanded(id);
        this.bookmark.render();
      }
    });
  }

  //
  //handle new bookmark form events
  //
  _handleNewBookmarkFormSubmit() {
    $('main').on('submit', '.newBookmarkForm', event => {
      event.preventDefault();
      let formElement = $('#newBookmarkForm')[0];
      let jsonBookmark = this._serializeJson(formElement);
      this.api
        .createBookmark(jsonBookmark)
        .then(newBookmark => {
          this.store.addBookmark(newBookmark);
          this.store.toggleAdding();
          this.bookmark.render();
        })
        .catch(err => {
          console.log(err);
          this.store.setError(err.message);
          this.bookmark.render();
        });
    });
  }

  _handleCancelEvent() {
    $('main').on('click', '.cancel', event => {
      this.store.toggleAdding();
      this.bookmark.render();
    });
  }

  //
  //handle edit form events
  //
  _handleEditBookmarkSubmit() {
    $('main').on('submit', '.editBookmarkForm', event => {
      event.preventDefault();
      let formElement = $('#editBookmarkForm')[0];
      let jsonBookmark = this._serializeJson(formElement);
      let id = $(event.target).data('id');
      this.api
        .updateBookmark(id, jsonBookmark)
        .then(() => {
          this.store.findAndUpdate(id, JSON.parse(jsonBookmark));
          this.store.toggleEdit();
          this.bookmark.render();
        })
        .catch(err => {
          console.log('error in submit edit');
          this.store.setError(err.message);
          this.bookmark.render();
        });
    });
  }

  _handleCancelEditEvent() {
    $('main').on('click', '.cancelEdit', event => {
      this.store.toggleEdit();
      this.bookmark.render();
    });
  }

  bindEventListeners() {
    this._handleNewBookmarkEvent();
    this._handleCancelEvent();
    this._handleNewBookmarkFormSubmit();
    this._handleDeleteBookmarkEvent();
    this._handleEditBookmarkEvent();
    this._handleCancelEditEvent();
    this._handleEditBookmarkSubmit();
    this._handleExpandBookmarkClick();
    this._handleExpandBookmarkKeyup();
    this._handleFilterChangeEvent();
  }

  //Convert form data to json
  _serializeJson(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => {
      if (name === 'desc' && !val) val = ' ';
      o[name] = val;
    });
    return JSON.stringify(o);
  }
}
