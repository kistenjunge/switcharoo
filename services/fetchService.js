'use strict';

function Game(game) {
    this.nsId = Object.is(game.nsuid_txt, undefined) ? "unknown": game.nsuid_txt[0];
    this.title = game.title;
    this.description = game.excerpt;
    this.imageUrl = 'https:' + game.image_url_sq_s;
    this.priceDiscount = game.price_discounted_f;
    this.priceRegular = game.price_regular_f;
    this.discount = game.price_discount_percentage_f;
    this.nintendoUrl = game.url;
}

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = (dataService, nintendoService, metacriticService) => {
    return {
        fetchAndStore: async () => {
            const fetchedGames = await nintendoService.getGamesOnSale();
            const games = fetchedGames.map( g => new Game(g));
            await Promise.all(games.map( game => metacriticService.setRatingForSwitchGame(game)));
            games.map(game => {
                game.metacriticUrl = metacriticService.guessGameUrl('switch', game.title);
                return game;
            });
            dataService.deleteAllGames();
            games.map(game => dataService.saveGame(game));
            return games.length;
        }
    }
};