// In-memory ChatMessage implementation

const inMemoryMessages = [];
let nextId = 1000;

class InMemoryQuery {
  constructor(messages) {
    this.messages = messages.slice();
  }

  sort(sortObj) {
    if (sortObj) {
      if (sortObj.createdAt === -1) {
        this.messages.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sortObj.createdAt === 1) {
        this.messages.sort((a, b) => a.createdAt - b.createdAt);
      }
    }
    return this;
  }

  lean() {
    return Promise.resolve(this.messages);
  }
}

export class InMemoryChatMessageModel {
  constructor(data) {
    this._id = nextId++;
    this.documentId = data.documentId;
    this.role = data.role;
    this.content = data.content;
    this.createdAt = new Date();
  }

  static create(data) {
    const msg = new InMemoryChatMessageModel(data);
    inMemoryMessages.push(msg);
    return Promise.resolve(msg);
  }

  static find(query) {
    let messages = inMemoryMessages.slice();
    if (query && query.documentId) {
      messages = messages.filter(msg => msg.documentId == query.documentId);
    }
    return new InMemoryQuery(messages);
  }
}

export default InMemoryChatMessageModel;
