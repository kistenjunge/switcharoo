'use strict';
module.exports = (dir, s) => {//s is the services layer.
    const router = require('express').Router();
    router.get('/', require(dir + 'defaultRoute.js')(s.data, s.fetch));
    router.get('/fetch', require(dir + 'fetchGames.js')(s.fetch));
    router.get('/score', require(dir + 'updateScores.js')(s.scoreUpdate));
    router.get('/manual', require(dir + 'manualRoute.js')());
    router.get('/cards', require(dir + 'cardsRoute.js')(s.data));
    router.get('/stats', require(dir + 'statsRoute.js')(s.data));
    router.get('/retry', require(dir + 'retryRoute.js')(s.data, s.scoreUpdate));
    //router.post('/updategame', require(dir + 'updateScoreForGame.js')(s.data, s.metacritic));
    return router;
};