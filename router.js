'use strict';
module.exports = (dir,s) => {//s is the services layer.
    const router = require('express').Router();
    router.get('/', require(dir + 'defaultRoute.js')(s.data));
    router.get('/fetch',require(dir + 'fetchGames.js')(s.data, s.nintendo, s.metacritic));
    return router;
};