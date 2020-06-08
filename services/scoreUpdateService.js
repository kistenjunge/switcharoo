'use strict';

module.exports = (dataService, ratingService) => {
    return {
        lastUpdate: undefined,
        checkAndUpdateScores: async () => {
            let games = dataService.getGamesWithoutRating();
            games.slice(0,100).map(async game => {
                await ratingService.updateRatingOf(game);
            })
        }
    }
};