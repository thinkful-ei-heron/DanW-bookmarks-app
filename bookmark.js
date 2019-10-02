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
    html += `
    <div class="banner">
      <h1>MyBookmarks</h1>
      <h2>Easily remember the sites you love</h2>
    </div>
    `;
    if (!this.store.adding && !this.store.edit) {
      console.log('filter level is ' + this.store.filter);
      html += `
        <div class="headerActions">
          <button class="newBookmark">New</button>
          <div>
          <label for="filter">min. rating</label>
            <select class="filter" id="filter">
              <option ${this.store.filter == 1 ? 'selected' : ''} value="1">${this.stars[1]}</option>
              <option ${this.store.filter == 2 ? 'selected' : ''} value="2">${this.stars[2]}</option>
              <option ${this.store.filter == 3 ? 'selected' : ''} value="3">${this.stars[3]}</option>
              <option ${this.store.filter == 4 ? 'selected' : ''} value="4">${this.stars[4]}</option>
              <option ${this.store.filter == 5 ? 'selected' : ''} value="5">${this.stars[5]}</option>
            </select>
          </div>
        </div>
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
    let plusMinus;
    this.store.bookmarks.forEach(bm => {
      if (bm.apiData.rating >= this.store.filter) {
        let expandHtml = '';
        if (bm.expanded) {
          plusMinus = 'fa fa-minus';
          expandHtml = `
            <a href="${bm.apiData.url}">Visit Site</a>
            <p>${bm.apiData.desc}</p>
          `;
        } else plusMinus = 'fa fa-plus';

        `<i class="fa fa-plus" tabindex="0" data-id="${bm.apiData.id}"></i>`;

        html += `
          <li class="site">
            <div class="bookmarkHeader" data-id="${bm.apiData.id}">
              <i class="${plusMinus}" tabindex="0" data-id="${bm.apiData.id}"></i>
              <div class="siteInfo">
                <h3 data-id="${bm.apiData.id}">${bm.apiData.title}</h3>
                <p data-id="${bm.apiData.id}" class="rating">${this.stars[bm.apiData.rating]}</p>
              </div>
              <div class="siteButtons">
                <button class="editBookmark" data-id="${bm.apiData.id}">
                  <i class="fa fa-edit" data-id="${bm.apiData.id}"></i>
                </button>
                <button class="deleteBookmark" data-id="${bm.apiData.id}">
                  <i class="fa fa-trash-alt" data-id="${bm.apiData.id}"></i>
                </button>
              </div>
            </div>
            <div class="siteExpansion">
              ${bm.expanded ? expandHtml : ''}
            </div>
          </li>  
          `;
      }
    });
    html += '</ul>';

    return html;
  }

  //generate new bookmark form
  _generateNewBookmarkHtml() {
    return `
      <form class="newBookmarkForm" id="newBookmarkForm">
        <legend>Add New Bookrmark:</legend>
        <label for="title">Name</label>
        <input type="text" name="title" id="title" placeholder="Name your bookmark" required>
        <label for="url">URL</label>
        <input type="url" name="url" id="url" placeholder="Enter URL here" pattern="^(http|https)://.*" required>
        <label for="desc">Description</label>
        <textarea name="desc" id="desc" form="newBookmarkForm" placeholder="Enter description of the site (optional)"></textarea>
        <label for="rating">Rating</label>
        <select name="rating" id="rating" form="newBookmarkForm">
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
      <form class="editBookmarkForm" id="editBookmarkForm" data-id="${bookmarkObj.apiData.id}">
        <legend>Edit Bookrmark:</legend>
        <label for="title">Name</label>
        <input type="text" name="title" id="title" value="${bookmarkObj.apiData.title}" required />
        <label for="url">URL</label>
        <input type="url" name="url" id="url" value="${
          bookmarkObj.apiData.url
        }" pattern="^(http|https)://.*" required />
        <label for="desc">Description</label>
        <textarea name="desc" id="desc" form="editBookmarkForm">${bookmarkObj.apiData.desc}</textarea>
        <label for="rating">Rating</label>
        <select name="rating" id="rating" form="editBookmarkForm">
          <option ${bookmarkObj.apiData.rating === 1 ? 'selected' : ''} value="1">${this.stars[1]}</option>
          <option ${bookmarkObj.apiData.rating === 2 ? 'selected' : ''} value="2">${this.stars[2]}</option>
          <option ${bookmarkObj.apiData.rating === 3 ? 'selected' : ''} value="3">${this.stars[3]}</option>
          <option ${bookmarkObj.apiData.rating === 4 ? 'selected' : ''} value="4">${this.stars[4]}</option>
          <option ${bookmarkObj.apiData.rating === 5 ? 'selected' : ''} value="5">${this.stars[5]}</option>
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
          this.store.addBookmark(newBookmark);
          this.store.toggleAdding();
          this.render();
        })
        .catch(err => {
          console.log(err);
          this.store.setError(err.message);
          this.render();
        });
    });
  }

  //handle landing page events

  _handleNewBookmarkEvent() {
    //console.log('adding event listener for newBookmark button');
    $('header').on('click', '.newBookmark', event => {
      //console.log('the NEW button was pressed');
      this.store.toggleAdding();
      this.render();
    });
  }

  _handleFilterChangeEvent() {
    $('header').on('change', '.filter', event => {
      let val = $(event.target).val();
      this.store.setFilter(val);
      this.render();
    });
  }

  _handleEditBookmarkEvent() {
    $('main').on('click', '.editBookmark', event => {
      event.stopPropagation();
      let id = $(event.target).data('id');
      this.store.toggleEdit();
      this.render(id);
    });
  }

  _handleDeleteBookmarkEvent() {
    $('main').on('click', '.deleteBookmark', event => {
      //console.log('the Cancel button was pressed');
      event.stopPropagation();
      let id = $(event.target).data('id');
      this.api
        .deleteBookmark(id)
        .then(() => {
          this.store.findAndDelete(id);
          this.render();
        })
        .catch(err => {
          console.log(err.message);
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
          console.log('error in submit edit');
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

  _handleExpandBookmarkClick() {
    $('main').on('click', '.bookmarkHeader', event => {
      let id = $(event.target).data('id');
      this.store.toggleExpanded(id);
      this.render();
    });
  }

  _handleExpandBookmarkKeyup() {
    $('main').on('keyup', '.bookmarkHeader', event => {
      if (event.keyCode === 13) {
        let id = $(event.target).data('id');
        this.store.toggleExpanded(id);
        this.render();
      }
    });
  }
  //handle errors

  //Render page
  render(id) {
    this._renderHeader();
    this._renderMain(id);
  }

  _renderHeader() {
    $('header').html(this._generateHeaderHtml());
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
    this._handleExpandBookmarkClick();
    this._handleExpandBookmarkKeyup();
    this._handleFilterChangeEvent();
  }

  _serializeJson(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => (o[name] = val));
    return JSON.stringify(o);
  }

  setError(msg) {}
}
