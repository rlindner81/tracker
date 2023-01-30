const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

class Batch {
  constructor(db) {
    this.__db = db;
    this.__batches = [this.__db.batch()];
    this.__counts = [0];
    this.__index = 0;
  }
  get batch() {
    if (this.__counts[this.__index] >= MAX_WRITES_PER_BATCH) {
      this.__batches.push(this.__db.batch());
      this.__counts.push(0);
      this.__index++;
    }
    this.__counts[this.__index] += 1;
    return this.__batches[this.__index];
  }
  create(...args) {
    return this.batch.create(...args);
  }
  delete(...args) {
    return this.batch.delete(...args);
  }
  async commit() {
    return await Promise.all(this.__batches.map((batch) => batch.commit()));
  }
}

export default Batch;
