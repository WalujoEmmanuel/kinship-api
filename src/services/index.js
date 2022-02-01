const knex = require('./index'); 

module.exports = {
  getAll(obj, where = {}) {
    if (Object.keys(where).length !== 0) {
      return knex(obj).where(where);
    } else {
      return knex(obj);
    }
  },

  getOne(obj, obj_id, id) {
    return knex(obj).where(obj_id, id).first();
  },

  create(obj, data) {
    return knex(obj).insert(data, '*');;
  },

  update(obj, obj_id, id, data) {
    return knex(obj).where(obj_id, id).update(data, '*');
  },

  delete(obj, obj_id, id) {
    return knex(obj).where(obj_id, id).del();
  },


  // Multiple DMLs
  createMany(obj, data) {
    if (Array.isArray(data)) {
      return knex(obj).insert(data, '*');
    } else {
      return knex(obj).insert(data, '*');
    }
  },

  getMany(obj, obj_id = null, id = null) {
    if ((obj_id === null) || (id === null)) {
      return knex(obj);
    }
    else if ((obj_id !== null) && (Array.isArray(id))) {
      return knex(obj).whereIn(obj_id, id);
    } else {
      return knex(obj).where(obj_id, id);
    }
  },

  updateMany(obj, obj_id, data) {
    return knex.transaction((trx) => {
      const queries = data.map(async (tuple) => {
        const [tupleId] = await knex(obj)
          .where(`${obj_id}`, tuple[obj_id])
          .update(tuple)
          .transacting(trx)
          .returning('*');

        return tupleId;
      });
 
      return Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });
  },

  deleteMany(obj, obj_id, id) {
    if ((obj_id !== null) && (Array.isArray(id))) {
      return knex(obj).whereIn(obj_id, id).del();
    } else {
      return knex(obj).where(obj_id, id).del();
    }
  },

}