export default class Store {
  constructor() {
    this.adding = false;
    this.edit = false;
    this.error = null;
    this.filter = 1;
    //An object array
    //key: apiData val: a javascript object which mirrors api json data
    //key expanded: val: boolean flag to determine if description should be displayed
    this.bookmarks = [];
  }

  findById(id) {
    return this.bookmarks.find(bm => bm.apiData.id == id);
  }

  addBookmark(bm) {
    if (!bm.desc) bm.desc = '';
    this.bookmarks.push({ apiData: bm, expanded: false });
  }

  findAndUpdate(id, updated) {
    if (!updated.desc) updated.desc = '';
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

  verify(bm) {
    if (typeof bm === 'object') console.log('value passed is an object');
    if (!bm.desc) bm.desc = ' ';
  }
}
