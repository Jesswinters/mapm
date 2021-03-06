"use strict";


module.exports = function makeDataHelpers(knex) {
  return {
    //Example
    getUserId: function(username, callback) {
      knex('users')
      .select('id')
      .where('username', username)
      .then((results) => {
        callback(results);
      })
      .catch((error) => {
        console.error(error);
      });
    },

    getUsers: function (callback) {
      knex
      .select("*")
      .from("users")
      .then((results) => {
        callback(results);
      })
      .catch((error) => {
        console.log(error);
      });
    },

    getUserById: function(userId, callback) {
      knex.select('id', 'name', 'username')
      .from('users')
      .where('id', userId)
      .then((results) => {
        callback(results);
      })
      .catch((error) => {
        console.log(error);
      });
    },

    //TODO: Add validation to force unique usernames.
    // Add user.
    addUser: function(userData, callback) {
      knex('users')
      .insert(userData)
      .then((results) => {
        callback(results);
      })
      .catch((err) => {
        console.error(err);
      });
    },

    // Delete users.
    deleteUser: function(userId, callback) {
      knex('users')
        .where('id', userId)
        .del()
        .then((results) => {
          callback(results);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // Get all categories
    getCategories: function(callback) {
      knex
        .select("*")
        .from("categories")
        .then((results) => {
          callback(results);
        });
    },

    // Gets all points from a given category.
    // TODO: Figure out if this needs to return object or ID
    getPoints: function(categoryId, callback) {
      knex('points')
        .where('categories_id', categoryId)
        .then((results) => {
          callback(results);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // Adds a point to a category.
    addPoint: function(pointData, categoryId, callback) {
      knex('points')
        .insert({...pointData, categories_id: categoryId})
      .then((results) => {
        callback(results);
      })
      .catch((err) => {
        console.error(err);
      });
    },

    // Deletes a point from a category.
    deletePoint: function(pointId, callback) {
      knex('points').where('id', pointId).del()
      .then((results) => {
        callback(results);
      })
      .catch((err) => {
        console.error(err);
      });
    },

    // Either adds or deletes a like from the likes table based on whether
    // the user had previously liked it.
    toggleLike: function(userId, categoryId, callback) {
      // Query database to find out if user/category exists in the table
      knex('likes')
        .whereRaw('(users_id, categories_id) = ((?, ?))'
          , [userId, categoryId])
        .then((results) => {
          if(Object.keys(results).length === 1) {
            // Delete row from table when the entry already exists.
            knex('likes')
              .whereRaw('(users_id, categories_id) = ((?, ?))'
                , [userId, categoryId])
              .del()
              .then((delete_results) => {
                callback(delete_results);
              })
              .catch((err) => {
                console.error(err);
              });
          } else {

            // Insert row into table when the entry does not exist.
            knex('likes')
              .insert({users_id: userId, categories_id: categoryId})
              .then((insert_results) => {
                callback(insert_results);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.error(err);
        })
    },

    // Returns list of categories_ids based off of users_id likes.
    getLikes: function(userId, callback) {
      knex('likes')
      .select('*')
      .innerJoin('categories', 'likes.categories_id', 'categories.id')
      .where('users_id', userId)
      .then((results) => {
        callback(results);
      })
      .catch((err) => {
        console.error(err);
      });
    },

    // Adds a user to the contributes table.
    addContributes: function(userId, categoryId, callback) {
      knex('contributes')
        .insert({users_id: userId, categories_id: categoryId})
        .then((insert_results) => {
          callback(insert_results);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // Returns an array of categories_ids based off of user_id contributes.
    getContributes: function(userId, callback) {
      knex('contributes')
      .select('*')
      .innerJoin('categories', 'contributes.categories_id', 'categories.id')
      .where('users_id', userId)
      .then((results) => {
        callback(results);
      })
      .catch((err) => {
        console.error(err);
      });
    },

    // Get a category by ID.
    getCategoryByID: function(categoryID, callback) {
        knex
        .select("*")
        .from("categories")
        .where('id', categoryID)
        .then((results) => {
            callback(results);
        })
        .catch((err) => {
          console.error(err);
        })
    },

    // Create new category.
    addCategory: function(category, callback) {
        knex('categories')
        .insert(category)
        .returning('id')
        .then((results) => {
            callback(results[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // Delete category by ID.
    deleteCategory: function (categoryID, callback){
        knex('categories')
        .where('id', categoryID)
        .del()
        .then((results) => {
            callback(results);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    updateCategory: function (categoryId, categoryData, callback){
      knex('categories')
        .where('id', categoryId)
        .update({
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image
        })
        .then((results) => {
          knex('points')
            .where('categories_id', categoryId)
            .del()
            .then((results) => {
              callback(results);
            })
            .catch((err) => {
              console.error(err);
            })
        })
        .catch((err) => {
          console.error(err);
        });
    },

  }
}
