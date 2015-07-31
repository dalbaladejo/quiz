var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: { id: Number(quizId) },
    include: [{ model: models.Comment }]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe la pregunta con id=' + quizId)); }
    }
  ).catch(function(error) {next(error);});
};

//GET /quizes
exports.index = function(req, res) {
  if (req.query.search) {
    var patron = '%'+req.query.search.replace(' ','%')+'%';
    models.Quiz.findAll({where: ["pregunta like ?",patron]}
      ).then(function(quizes) {
        res.render('quizes/index.ejs', { quizes: quizes, errors: []});
      }).catch(function(error) {next(error)});
  } else {
    models.Quiz.findAll().then(function (quizes){
        res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error){next(error)});
  }
};

// GET /quizes/new
exports.new = function(req,res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', { quiz: quiz, errors: [] });
};

//GET /quizes/:quizId
exports.show = function(req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz, errors: [] });
  })
};

//GET /quizes/:quizId/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; // autoload de instancia de quiz
  
  res.render('quizes/edit', { quiz: quiz, errors: []});
};

//GET /quizes/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
	}
	res.render('quizes/answer',	{ quiz: req.quiz, respuesta: resultado, errors: [] });
};

// POST /quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(
    function (err) {
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){res.redirect('/quizes');})
      }
    }
  );
};

// PUT /quizes/:quizId
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz.validate().then(
    function (err) {
      if (err) {
        res.render('quizes/edit', {quiz: quiz, errors: err.errors});
      } else {
        req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){res.redirect('/quizes');})
      }
    }
  );
};

// DELETE /quizes/:quizId
exports.destroy = function (req, res) {
  req.quiz.destroy().then (function () {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

