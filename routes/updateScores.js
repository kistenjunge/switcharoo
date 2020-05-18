'use strict';


module.exports = (scoreUpdateService) => {
    return async (req, res) => {
        scoreUpdateService.checkAndUpdateScores();
        res.sendStatus(202);
    };
};