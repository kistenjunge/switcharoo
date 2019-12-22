'use strict';
module.exports = (dir,s) => {//s is the services layer.
    const router = require('express').Router();
    router.get('/', require(dir + 'defaultRoute.js')(s.data, s.fetch));
    router.get('/fetch',require(dir + 'fetchGames.js')(s.fetch));
    router.get('/score', require(dir + 'updateScores.js')(s.scoreUpdate));
    router.get('/manual', require(dir + 'manualRoute.js')());
    router.post('/updategame', require(dir + 'updateScoreForGame.js')(s.data, s.metacritic));
    return router;
};