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

function getCount(array) {
    return (array == null) ? 0 : array.length;
}

module.exports = (dataService, nintendoService) => {
    return {
        lastFetch: undefined,
        fetchAndStore: async () => {
            const fetchedGames = await nintendoService.getGamesOnSale();
            const games = fetchedGames.map( g => new Game(g));
            const idsFromStore = games.map(game => game.nsId);
            const idsStored = dataService.getAllGames().map(game => game.nsId);
            // find games we already had on sale
            let alreadyStored = idsFromStore.filter(x => idsStored.includes(x));
            // find games that aren't on sale anymore
            let noOnSaleAnymore = idsStored.filter(x => !idsFromStore.includes(x));
            // find games we hadn't on sale yet
            let nowOnSale = idsFromStore.filter(x => !idsStored.includes(x));
            console.log('Fetch result - to add: ' + getCount(nowOnSale) + ', to remove: ' + getCount(noOnSaleAnymore) + ', already knwon: ' + getCount(alreadyStored));
            const gamesToAdd = games.filter(game => nowOnSale.includes(game.nsId));
            gamesToAdd.map(game => dataService.saveGame(game));
            noOnSaleAnymore.map(nsId => dataService.deleteGameByNsId(nsId));
            this.lastFetch = Date.now();
            return {added: getCount(nowOnSale), removed: getCount(noOnSaleAnymore), unchanged: getCount(alreadyStored)};
        },
        getLastFetchDate: () => {
            if (this.lastFetch != null)
                return Date(this.lastFetch).toString();
            else
                return 'not fetched yet'
        }
    }
};