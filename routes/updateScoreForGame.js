'use strict';


module.exports = (dataService, metacriticService) => {
    return async (req, res) => {
        const title = req.body.title;
        const game = dataService.getGameByTitle(title);
        var metacriticTitle;
        if (game.metacriticTitle) {
            metacriticTitle = game.metacriticTitle;
        } else {
            metacriticTitle = await metacriticService.searchSwitchGame(title);
            dataService.setMetacriticTitle(game._id, metacriticTitle)
        }
        let score = await metacriticService.fetchSoreForSwitchGame(metacriticTitle);
        if (score && score >= 0) {
            let url = metacriticService.guessGameUrl('switch', title);
            const game = dataService.getGameByTitle(title);
            dataService.setMetacritInfo(game._id, score, url);
        }
        res.redirect('/manual?title=' + title + '&score=' + score);
    };
};