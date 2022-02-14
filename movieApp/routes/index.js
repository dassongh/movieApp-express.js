var express = require('express');
var router = express.Router();
const request = require('request');
const passport = require('passport');
const { route } = require('../app');

const API_KEY = '0fbf6f1a4cbaabd00dcc7bb0f87f0a26';
// const API_KEY = '123456789';
const API_BASE_URL = 'http://api.themoviedb.org/3';
// const API_BASE_URL = 'http://localhost:3030';
// const NOW_PLAYING_URL = `${API_BASE_URL}/most_popular?api_key=${API_KEY}`;
const NOW_PLAYING_URL = `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
const IMAGE_BASE_URL = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = IMAGE_BASE_URL;
  next();
});

router.get('/', function (req, res, next) {
  console.log(req.user);
  request.get(NOW_PLAYING_URL, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    // res.json(parsedData);
    res.render('index', {
      parsedData: parsedData.results,
    });
  });
});

router.get('/login', passport.authenticate('github'));

router.get('/favorites', (req, res, next) => {
  res.json(req.user.displayName);
});

router.get(
  '/auth',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/loginFailed',
  }),
);

router.get('/movie/:id', (req, res, next) => {
  const movieId = req.params.id;
  const thisMovieUrl = `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
  request.get(thisMovieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    res.render('single-movie', {
      parsedData,
    });
  });
});

router.post('/search', (req, res, next) => {
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${API_BASE_URL}/search/${cat}?query=${userSearchTerm}&api_key=${API_KEY}`;
  request.get(movieUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData);

    if (cat === 'person') parsedData.results = parsedData.results[0].known_for;

    res.render('index', {
      parsedData: parsedData.results,
    });
  });
});

module.exports = router;
