'use strict';


module.exports = (gameService, scoreUpdateService) => {
    return async (req, res) => {
        gameService.resetRatingForGamesWithoutScore();
        await scoreUpdateService.checkAndUpdateScores();
        res.sendStatus(202);
    };
};