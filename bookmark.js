export default class Bookmark {
  constructor(store, api) {
    this.store = store;
    this.api = api;
    this.stars = [
      '&#9734;&#9734;&#9734;&#9734;&#9734;',
      '&#9733;&#9734;&#9734;&#9734;&#9734;',
      '&#9733;&#9733;&#9734;&#9734;&#9734;',
      '&#9733;&#9733;&#9733;&#9734;&#9734;',
      '&#9733;&#9733;&#9733;&#9733;&#9734;',
      '&#9733;&#9733;&#9733;&#9733;&#9733;'
    ];
  }

  //generate header
  _generateHeaderHtml() {
    let html = '';
    html += '<h1>MyBookmarks</h1>';
    if (!this.store.adding) {
      html += `
          <button class="newBookmark">New</button>
          <button class="Filter">Filter</button>
        `;
    }

    return html;
  }

  //Generate HTML for current state
  _generateStateHtml(id) {
    //console.dir(this.store);
    if (this.store.adding) return this._generateNewBookmarkHtml();
    if (this.store.edit) return this._generateEditBookmarkHtml(id);
    return this._generateHomeHtml();
  }

  //generate landing/home page html
  _generateHomeHtml() {
    let html = '<ul class="bookmarks">';
    this.store.bookmarks.forEach(bm => {
      html += `
        <li class="site">
          <div class="bookmarkHeader">
            <h3><a href="${bm.url}">${bm.title}</a></h3>
            <button class="deleteBookmark" data-id="${bm.id}">Delete</button>
            <button class="editBookmark" data-id="${bm.id}">Edit</button>
          </div>
          <p>${this.stars[bm.rating]}</p>
          <p>${bm.desc}</p>
        </li>  
        `;
    });
    html += '</ul>';

    return html;
  }

  //handle landing page events

  _handleNewBookmarkEvent() {
    //console.log('adding event listener for newBookmark button');
    $('.header').on('click', '.newBookmark', event => {
      //console.log('the NEW button was pressed');
      this.store.toggleAdding();
      this.render();
    });
  }

  _handleEditBookmarkEvent() {
    $('main').on('click', '.editBookmark', event => {
      console.log('the EDIT button was pressed');
      let id = $(event.target).data('id');
      this.store.toggleEdit();
      this.render(id);
    });
  }

  _handleDeleteBookmarkEvent() {
    $('main').on('click', '.deleteBookmark', event => {
      //console.log('the Cancel button was pressed');
      let id = $(event.target).data('id');
      this.api
        .deleteBookmark(id)
        .then(() => {
          this.store.findAndDelete(id);
          this.render();
        })
        .catch(err => {
          this.store.setError(err.message);
          this.render();
        });
    });
  }

  //generate new bookmark form
  _generateNewBookmarkHtml() {
    return `
      <form class="newBookmarkForm" id="newBookmarkForm">
        <legend>Add New Bookrmark:</legend>
        <input type="text" name="title" placeholder="Name your bookmark" required>
        <input type="url" name="url" placeholder="Enter URL here" pattern="^(http|https)://.*" required>
        <textarea name="desc" form="newBookmarkForm" placeholder="Enter description of the site (optional)"></textarea>
        <select name="rating" form="newBookmarkForm">
          <option  value="1">${this.stars[1]}</option>
          <option value="2">${this.stars[2]}</option>
          <option selected value="3">${this.stars[3]}</option>
          <option value="4">${this.stars[4]}</option>
          <option value="5">${this.stars[5]}</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <button class="cancel">Cancel</button>
      `;
  }

  _generateEditBookmarkHtml(id) {
    let bookmarkObj = this.store.findById(id);
    return `
      <form class="editBookmarkForm" id="editBookmarkForm" data-id="${bookmarkObj.id}">
        <legend>Edit Bookrmark:</legend>
        <input type="text" name="title" value="${bookmarkObj.title}" required />
        <input type="url" name="url" value="${bookmarkObj.url}" pattern="^(http|https)://.*" required />
        <textarea name="desc" form="editBookmarkForm">${bookmarkObj.desc}</textarea>
        <select name="rating" form="editBookmarkForm">
          <option ${bookmarkObj.rating === 1 ? 'selected' : ''} value="1">${this.stars[1]}</option>
          <option ${bookmarkObj.rating === 2 ? 'selected' : ''} value="2">${this.stars[2]}</option>
          <option ${bookmarkObj.rating === 3 ? 'selected' : ''} value="3">${this.stars[3]}</option>
          <option ${bookmarkObj.rating === 4 ? 'selected' : ''} value="4">${this.stars[4]}</option>
          <option ${bookmarkObj.rating === 5 ? 'selected' : ''} value="5">${this.stars[5]}</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <button class="cancelEdit">Cancel</button>
    `;
  }

  //handle new bookmark form events
  _handleNewBookmarkFormSubmit() {
    $('main').on('submit', '.newBookmarkForm', event => {
      event.preventDefault();
      let formElement = $('#newBookmarkForm')[0];
      let jsonBookmark = this._serializeJson(formElement);
      this.api
        .createBookmark(jsonBookmark)
        .then(newBookmark => {
          this.store.addBookmark(JSON.parse(jsonBookmark));
          this.store.toggleAdding();
          this.render();
        })
        .catch(err => {
          console.log(err);
          console.log(jsonBookmark);
          this.store.setError(err.message);
          this.render();
        });
    });
  }

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
          this.render();
        })
        .catch(err => {
          this.store.setError(err.message);
          this.render();
        });
    });
  }

  _handleCancelEvent() {
    //console.log('adding cancel event listener');
    $('main').on('click', '.cancel', event => {
      //console.log('the Cancel button was pressed');
      this.store.toggleAdding();
      this.render();
    });
  }

  _handleCancelEditEvent() {
    //console.log('adding cancel event listener');
    $('main').on('click', '.cancelEdit', event => {
      //console.log('the Cancel button was pressed');
      this.store.toggleEdit();
      this.render();
    });
  }
  //handle errors

  //Render page
  render(id) {
    console.log('rendering -- store.adding is ' + this.store.adding);
    this._renderHeader();
    this._renderMain(id);
  }

  _renderHeader() {
    $('.header').html(this._generateHeaderHtml());
  }

  _renderMain(id) {
    $('main').html(this._generateStateHtml(id));
  }

  bindEventListeners() {
    this._handleNewBookmarkEvent();
    this._handleCancelEvent();
    this._handleNewBookmarkFormSubmit();
    this._handleDeleteBookmarkEvent();
    this._handleEditBookmarkEvent();
    this._handleCancelEditEvent();
    this._handleEditBookmarkSubmit();
  }

  _serializeJson(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => (o[name] = val));
    return JSON.stringify(o);
  }

  setError(msg) {}
}
