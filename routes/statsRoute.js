'use strict';


module.exports = (gameService) => {
    return async (req, res) => {
        const stats = gameService.getStats();
        res.send(stats);
    };
};