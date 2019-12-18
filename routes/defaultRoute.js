'use strict';
const fs = require('fs');

module.exports = (dataService) => {
    return (req,res) => {
        const ratedGames = dataService.getRatedGames().sort( (a, b) => b.score - a.score);
        const unratedGames = dataService.getUnratedGames();
        const games = ratedGames.concat(unratedGames);
        res.render('games', { title: 'Games on Sale', gameCount: games.length, gamesList: games });
    };
};