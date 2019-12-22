'use strict';

module.exports = (dataService, metacriticService) => {
    return async (req,res) => {
        let games = dataService.getAllGames();
        await Promise.all(games.map( async game => {
            let score = await metacriticService.getRatingForSwitchGame(game.title);
            let url = metacriticService.guessGameUrl('switch', game.title);
            dataService.setMetacritInfo(game._id, score, url);
        }));
        res.send("Finished updating games with scores");
    };
};