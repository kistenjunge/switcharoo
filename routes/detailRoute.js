'use strict';

module.exports = (dataService) => {
    return (req,res) => {
        const game = dataService.getGameByStoreId(req.param("gameId"));
        res.render('detail', { game: game });
    };
};