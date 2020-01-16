'use strict';
const Sale = require('../models/Sale');

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

module.exports = (dataService, nintendoService, saleService) => {
    return {
        lastFetch: undefined,
        fetchAndStore: async () => {
            const fetchedGames = await nintendoService.getGamesOnSale();
            const games = fetchedGames.map( g => new Game(g));
            const idsFromStore = games.map(game => game.nsId);
            const idsStored = dataService.getAllGames().map(game => game.nsId);
            // find games we already had in sale
            let alreadyStored = idsFromStore.filter(x => idsStored.includes(x));
            // find games that aren't in sale anymore
            let noInSaleAnymore = idsStored.filter(x => !idsFromStore.includes(x));
            // find games we hadn't in sale yet
            let nowInSale = idsFromStore.filter(x => !idsStored.includes(x));
            console.log('Fetch result - to add: ' + getCount(nowInSale) + ', to remove: ' + getCount(noInSaleAnymore) + ', already knwon: ' + getCount(alreadyStored));
            const gamesToAdd = games.filter(game => nowInSale.includes(game.nsId));
            const priceInfos = await nintendoService.getPriceInfoForGames(gamesToAdd.map(game => game.nsId));
            for(let entry of priceInfos.entries()) {
                saleService.addSale(entry[0], new Sale(entry[1].price, entry[1].start, entry[1].end));
            }
            gamesToAdd.map(game => {
                game.saleDetails = priceInfos.get(game.nsId);
                return game;
            });
            gamesToAdd.map(game => dataService.saveGame(game));
            noInSaleAnymore.map(nsId => dataService.deleteGameByNsId(nsId));
            this.lastFetch = Date.now();
            return {added: getCount(nowInSale), removed: getCount(noInSaleAnymore), unchanged: getCount(alreadyStored)};
        },
        getLastFetchDate: () => {
            if (this.lastFetch != null)
                return Date(this.lastFetch).toString();
            else
                return 'not fetched yet'
        }
    }
};