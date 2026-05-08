// In-memory Document implementation
// This is used when MongoDB is not available

const inMemoryDocuments = [];
let nextId = 1;

class InMemoryQuery {
  constructor(documents) {
    this.documents = documents.slice();
  }

  sort(sortObj) {
    if (sortObj) {
      if (sortObj.createdAt === -1) {
        this.documents.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sortObj.createdAt === 1) {
        this.documents.sort((a, b) => a.createdAt - b.createdAt);
      }
    }
    return this;
  }

  lean() {
    return Promise.resolve(this.documents);
  }
}

export class InMemoryDocumentModel {
  constructor(data) {
    this._id = nextId++;
    this.name = data.name;
    this.filename = data.filename;
    this.storagePath = data.storagePath;
    this.text = data.text;
    this.chunks = data.chunks || [];
    this.notes = data.notes || '';
    this.createdAt = new Date();
  }

  static create(data) {
    const doc = new InMemoryDocumentModel(data);
    inMemoryDocuments.push(doc);
    return Promise.resolve(doc);
  }

  static find() {
    return new InMemoryQuery(inMemoryDocuments);
  }

  static findById(id) {
    const doc = inMemoryDocuments.find(d => d._id == id);
    return Promise.resolve(doc || null);
  }

  static deleteOne(query) {
    const index = inMemoryDocuments.findIndex(doc => doc._id == query._id);
    if (index > -1) {
      inMemoryDocuments.splice(index, 1);
      return Promise.resolve({ deletedCount: 1 });
    }
    return Promise.resolve({ deletedCount: 0 });
  }
}

export default InMemoryDocumentModel;
