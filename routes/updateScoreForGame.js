'use strict';


module.exports = (dataService, metacriticService) => {
    return async (req,res) => {
        let title = req.body.title;
        let score = await metacriticService.getRatingForSwitchGame(title);
        if (score && score >= 0) {
            let url = metacriticService.guessGameUrl('switch', title);
            const game = dataService.getGameByTitle(title);
            dataService.setMetacritInfo(game._id, score, url);
        }
        res.redirect('/manual?title=' + title + '&score=' + score);
    };
};