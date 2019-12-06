'use strict';
const fs = require('fs');

module.exports = (dataService) => {
    return (req,res) => {
        const games = dataService.getRatedGames().sort( (a, b) => b.score - a.score);
        res.render('games', { title: 'Games in Sale', gameCount: games.length, gamesList: games });
    };
};