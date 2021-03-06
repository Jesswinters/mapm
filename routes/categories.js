"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function (DataHelpers) {

  // Delete points
  router.delete('/:categoryId/point/:id', (req, res) => {
    let categoryId = req.params.categoryId;
    let pointId = req.params.id;

    DataHelpers.deletePoint(pointId, (results) => {
      console.log(results);
    });

    res.redirect(`/api/categories/${categoryId}/edit`);
  });

  // TESTING delete points test
  router.post('/delete/test/:id', (req, res) => {
    let pointId = req.body.test;
    console.log(pointId);

    //DataHelpers.deletePoint(pointId, (results) => {
      //console.log(results);
    //})
  });

  // Get all categories
  router.get('/', (req, res) => {
    DataHelpers.getCategories((results) => {
      console.log(results);
      res.json(results);
    });
  });

  // New Category Page
  router.get('/new', (req, res) => {
    let templateVars = {
      username: req.session.user_name,
      user_id: req.session.user_id,
      userIsAuthenticated: req.userAuthenticated,
    }
    res.render('new', templateVars);
  });

  // Saving New Category
  router.post('/', (req, res) => {
    // I need to implement a function to save the image.
    //TODO: Reject submission if no points added.
    let category = {};
    req.body.category.map((field) => {
      category[field.name] = field.value;
    });

    let points = req.body.mapPoints;
    let pointsLeft = points.length;

    DataHelpers.addCategory(category, (categoryId) => {
      points.forEach((point) => {
        let newPoint = {
          lat: point.lat,
          long: point.lng,
          image: point.image,
          place_id: point.placeId,
          title: point.title,
        };

        DataHelpers.addPoint(newPoint, categoryId, (result) => {
          pointsLeft--;
          if (!pointsLeft) {
            res.json({url: `/api/categories/${categoryId.toString()}`});
          }
        });
      });
    });
  });

  // After select a Category show this page
  router.get('/:id', (req, res) => {
    let categoryId = req.params.id;
      DataHelpers.getCategoryByID(categoryId, (results) => {
        let categoryData = results;

        DataHelpers.getPoints(categoryId, (results) => {
          let pointData = results;

          let templateVars = {
            category_data: categoryData[0],
            point_data: pointData,
            username: req.session.user_name,
            user_id: req.session.user_id,
            userIsAuthenticated: req.userAuthenticated,
          };

          res.render('categories', templateVars);
        });
      });
  });

  router.get('/:id/points', (req, res) => {
    let categoryId = req.params.id;
    DataHelpers.getPoints(categoryId, (pointResults) => {
      let pointData = pointResults;
      res.json({pointData: pointData});
    });
  });

  // Like category
  router.put('/:id/like', (req, res) => {
    if (req.userAuthenticated) {
      let userId = req.session.user_id;
      let categoryId = req.params.id;

      DataHelpers.toggleLike(userId, categoryId, (results) => {
        res.json({'message': 'Success!'});
      });
    } else {
      res.json({'message': 'Not logged in.'});
    }
  });

  // Update category
  router.put('/:id', (req, res) => {
    let categoryId = req.params.id;

    let category = {};
    req.body.category.map((field) => {
      category[field.name] = field.value;
    });

    DataHelpers.updateCategory(categoryId, category, (results) => {
      let pointsLeft = req.body.mapPoints.length;
      req.body.mapPoints.forEach((point) => {
        let newPoint = {
          lat: point.lat,
          long: point.lng,
          image: point.image,
          place_id: point.placeId,
          title: point.title,
        };

        DataHelpers.addPoint(newPoint, categoryId, (result) => {
          pointsLeft--;
          if (!pointsLeft) {
            res.json({url: `/api/categories/${categoryId.toString()}`});
          }
        })
      });
    });
  });

  // Edit category
  router.get('/:id/edit', (req, res) => {
    let categoryId = req.params.id;

    DataHelpers.getCategoryByID(categoryId, (results) => {
      let categoryData = results;

      DataHelpers.getPoints(categoryId, (results) => {
        let pointData = results;
        let templateVars = {
          category_data: categoryData[0],
          point_data: pointData,
          username: req.session.user_name,
          user_id: req.session.user_id,
          userIsAuthenticated: req.userAuthenticated,
        };

        //res.json({category_data: categoryData, point_data: pointData});
        res.render('edit', templateVars);
      });
    });
  });

  return router;
};
