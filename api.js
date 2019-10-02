export default class API {
  constructor(url) {
    this.BASE_URL = url;
  }

  getBookmarks() {
    return this.apiFetch(`${this.BASE_URL}`);
  }

  createBookmark(jsonData) {
    return this.apiFetch(`${this.BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData
    });
  }

  deleteBookmark(id) {
    return this.apiFetch(`${this.BASE_URL}/${id}`, {
      method: 'DELETE'
    });
  }

  updateBookmark(id, jsonData) {
    return this.apiFetch(`${this.BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData
    });
  }

  apiFetch(...args) {
    let error;
    console.log(args[0]);
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          // Valid HTTP response but non-2xx status - let's create an error!
          error = { code: res.status };
        }

        // In either case, parse the JSON stream:
        return res.json();
      })

      .then(data => {
        // If error was flagged, reject the Promise with the error object
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }

        // Otherwise give back the data as resolved Promise
        //console.log(data);
        return data;
      });
  }
}
