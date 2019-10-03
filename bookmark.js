export default class Bookmark {
  constructor(store) {
    this.store = store;
    this.stars = [
      '&#9734;&#9734;&#9734;&#9734;&#9734;',
      '&#9733;&#9734;&#9734;&#9734;&#9734;',
      '&#9733;&#9733;&#9734;&#9734;&#9734;',
      '&#9733;&#9733;&#9733;&#9734;&#9734;',
      '&#9733;&#9733;&#9733;&#9733;&#9734;',
      '&#9733;&#9733;&#9733;&#9733;&#9733;'
    ];
  }

  //Render page
  render(id) {
    if (this.store.error) {
      alert(`Unabel to process last request: ${this.store.error}`);
      this.store.error = null;
    }
    this._renderHeader();
    this._renderMain(id);
  }

  _renderHeader() {
    $('header').html(this._generateHeaderHtml());
  }

  _renderMain(id) {
    $('main').html(this._generateStateHtml(id));
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
      html += `
        <div class="headerActions">
          <button class="newBookmark">New</button>
          <div>
          <label for="filter">Filter</label>
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

    if (this.store.bookmarks.length === 0) return this._generateTutorialMessageHtml();

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

  _generateTutorialMessageHtml() {
    return `
    <div class='getStarted'>
      <p>Welcome to the MyBookmarks App!</p>
      <p>Just click the 'New' button above to get started.</p>
    </div>
    `;
  }

  //generate new bookmark form
  _generateNewBookmarkHtml() {
    return `
      <form class="newBookmarkForm" id="newBookmarkForm">
        <fieldset name="site-info">
          <legend>Add New Bookrmark:</legend>
          <label for="title">Name</label>
          <input type="text" name="title" id="title" placeholder="Name your bookmark" required>
          <label for="url">URL</label>
          <input type="url" name="url" id="url" placeholder="Enter URL here" pattern="^(http|https)://.*" required>
          <label for="desc">Description</label>
          <textarea name="desc" id="desc" form="newBookmarkForm" defaultValue = " " placeholder="Enter description of the site (optional)"></textarea>
          <label for="rating">Rating</label>
          <select name="rating" id="rating" form="newBookmarkForm">
            <option  value="1">${this.stars[1]}</option>
            <option value="2">${this.stars[2]}</option>
            <option selected value="3">${this.stars[3]}</option>
            <option value="4">${this.stars[4]}</option>
            <option value="5">${this.stars[5]}</option>
          </select>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      <button class="cancel">Cancel</button>
      `;
  }

  _generateEditBookmarkHtml(id) {
    let bookmarkObj = this.store.findById(id);
    return `
      <form class="editBookmarkForm" id="editBookmarkForm" data-id="${bookmarkObj.apiData.id}">
        <fieldset name="site-info">
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
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      <button class="cancelEdit">Cancel</button>
    `;
  }

  _errorAlertMessage(msg) {}
}
