var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statsData = {};

exports.calculate = function(req, res, next) {
  //Se ha usado el método all de Promises (implementado ya en sequelize), ya que
  //de esta forma se ejecutan las consultas asíncronamente en paralelo y se
  //continúa cuando han acabado todas.
  Sequelize.Promise.all([
    models.Quiz.count(),
    models.Comment.count(),
    //Se ha añadido nuevos métodos al modelo Comment en models/comment.js
    models.Comment.countCommentedQuizes(),
    models.Comment.countUnpublished()
  ]).then( function( values ){
    statsData.quizes=values[0];
    statsData.comments=values[1];
    statsData.commentedQuizes=values[2];
    statsData.unpublishedComments=values[3];
  }).catch( function (err) {
    next(err);
  }).finally( function() {
    next();
  });
};

// GET /quizes/stats
exports.show = function(req, res) {
  res.render('stats', {stats: statsData, errors: [] });
};
