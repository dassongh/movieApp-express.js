var express = require('express');
var router = express.Router();

const movieDetails = require('../data/movieDetails');

const requireJSON = (req, res, next) => {
  if (!req.is('application/json')) {
    res.json({ msg: 'Content type must be application/json' });
  } else {
    next();
  }
};

router.param('movieId', (req, res, next) => {
  next();
});

/* GET movie page. */
router.get('/top_rated', (req, res, next) => {
  let page = req.query.page;
  if (!page) page = 1;

  const results = movieDetails.sort((a, b) => b.vote_average - a.vote_average);
  let indexToStart = (page - 1) * 20;
  res.json(results.slice(indexToStart, indexToStart + 20));
});

router.get('/:movieId', (req, res, next) => {
  const movieId = req.params.movieId;
  const results = movieDetails.find(el => el.id === Number(movieId));

  if (!results) {
    res.json({ msg: 'movie not found', production_companies: [] });
  } else {
    res.json(results);
  }
});

//POST /movie/{movieId}/raiting
router.post('/:movieId/rating', requireJSON, (req, res, next) => {
  const movieId = req.params.movieId;
  const userRainting = req.body.value;

  if (userRainting < 0.5 || userRainting > 10) {
    res.json({ msg: 'Raiting must be between .5 and 10' });
  } else {
    res.json({ msg: 'Thank you for submitting', status_code: 200 });
  }
});

//DELETE /movie/{movieId}/raiting
router.delete('./:movieId/rating', requireJSON, (req, res, next) => {
  res.json({ msg: 'Rating deleted' });
});

module.exports = router;
