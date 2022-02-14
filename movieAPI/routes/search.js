var express = require('express');
var router = express.Router();

const movies = require('../data/movies');
const people = require('../data/people');

const queryRequired = (req, res, next) => {
  const searchTerm = req.query.query;

  if (!searchTerm) {
    res.json({ msg: 'Query is required' });
  } else {
    next();
  }
};

router.use(queryRequired);

/* GET search page. */
router.get('/', (req, res, next) => {
  res.json('test');
});

//GET /search/movie
router.get('/movie', (req, res, next) => {
  const searchTerm = req.query.query;

  const results = movies.filter(movie => {
    const found = movie.overview.includes(searchTerm) || movie.title.includes(searchTerm);
    return found;
  });

  res.json({ results });
});

//GET /search/person
router.get('/person', (req, res, next) => {
  const searchTerm = req.query.query;

  const results = people.filter(person => {
    const found = person.name.includes(searchTerm);
    return found;
  });

  res.json({ results });
});

module.exports = router;
