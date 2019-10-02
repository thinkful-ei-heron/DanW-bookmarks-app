export default class Store {
  constructor() {
    this.adding = false;
    this.edit = false;
    this.error = null;
    this.filter = 0;
    this.bookmarks = [];
  }

  findById(id) {
    return this.bookmarks.find(bm => bm.id == id);
    //return bookmark object
  }

  addBookmark(bm) {
    if (!bm.rating) bm.rating = 0;
    this.bookmarks.push(bm);
  }

  findAndUpdate(id, updated) {
    console.log('updating ', this.findById(id));
    console.log('to ', updated);
    let toUpdate = this.findById(id);
    Object.assign(toUpdate, updated);
  }

  findAndDelete(id) {
    this.bookmarks = this.bookmarks.filter(bm => bm.id != id);
  }

  toggleAdding() {
    this.adding = !this.adding;
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  setFilter(val) {}

  setError(err) {}
}
