'use strict';

module.exports = (dataService) => {
    return (req,res) => {
        const ratedGames = dataService.getRatedGames().sort( (a, b) => b.rating.score - a.rating.score);
        const withoutScore = dataService.getGamesWithoutScore();
        const unratedGames = dataService.getGamesWithoutRating();
        const games = ratedGames.concat(withoutScore, unratedGames);
        res.render('cards', { gamesList: games });
    };
};