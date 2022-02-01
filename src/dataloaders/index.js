
const DataLoader = require('dataloader');
const queries = require('../services');

function dbDataLoader(obj, searchKey) {
  async function batchFunc(ids) {
    const data = await queries.getMany(obj, searchKey, ids);
    return Promise.all([...ids.map(id => data.filter(res => res[searchKey] === id)[0])]);
  }

  return batchFunc;
}

const dataLoader = async (obj, searchKey, searchValue) => {
  const Loader = new DataLoader(dbDataLoader(obj, searchKey));
  return Loader.load(searchValue);
}


module.exports = { dataLoader }
