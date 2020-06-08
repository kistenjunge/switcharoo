'use strict';

module.exports = (dataService) => {
    return (req,res) => {
        const ratedGames = dataService.getRatedGames().sort( (a, b) => b.rating_score - a.rating_score);
        const withoutScore = dataService.getGamesWithoutScore();
        const unratedGames = dataService.getGamesWithoutRating();
        const games = ratedGames.concat(withoutScore, unratedGames);
        res.render('cards', { gamesList: games });
    };
};