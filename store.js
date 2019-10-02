export default class Store {
  constructor() {
    this.adding = false;
    this.edit = false;
    this.error = null;
    this.filter = 1;
    this.bookmarks = [];
  }

  findById(id) {
    return this.bookmarks.find(bm => bm.apiData.id == id);
  }

  addBookmark(bm) {
    this.bookmarks.push({ apiData: bm, expanded: false });
  }

  findAndUpdate(id, updated) {
    //console.log('updating ', this.findById(id));
    //console.log('to ', updated);
    let toUpdate = this.findById(id).apiData;
    Object.assign(toUpdate, updated);
  }

  findAndDelete(id) {
    this.bookmarks = this.bookmarks.filter(bm => bm.apiData.id != id);
  }

  toggleAdding() {
    this.adding = !this.adding;
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  toggleExpanded(id) {
    let bm = this.findById(id);
    bm.expanded = !bm.expanded;
  }

  setFilter(val) {
    this.filter = val;
  }

  setError(err) {
    this.error = err;
  }
}
