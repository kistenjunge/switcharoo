'use strict';


module.exports = (gameService, scoreUpdateService) => {
    return async (req, res) => {
        gameService.retry();
        scoreUpdateService.checkAndUpdateScores();
        res.sendStatus(202);
    };
};