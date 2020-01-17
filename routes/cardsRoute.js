'use strict';

module.exports = (dataService) => {
    return (req,res) => {
        const ratedGames = dataService.getRatedGames().sort( (a, b) => b.score - a.score);
        const unratedGames = dataService.getUnratedGames();
        const games = ratedGames.concat(unratedGames);
        res.render('cards', { gamesList: games });
    };
};