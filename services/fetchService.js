'use strict';
const Sale = require('../models/Sale');
var moment = require('moment');

function Game(game) {
    this.nsId = Object.is(game.nsuid_txt, undefined) ? "unknown": game.nsuid_txt[0];
    this.title = game.title;
    this.description = game.excerpt;
    this.imageUrl = 'https:' + game.image_url_sq_s;
    this.priceRegular = game.price_regular_f;
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
            // find games we already had on sale
            let alreadyStored = idsFromStore.filter(x => idsStored.includes(x));
            // find games that aren't in sale anymore
            let notInSaleAnymore = idsStored.filter(x => !idsFromStore.includes(x));
            // find games we hadn't in sale yet
            let nowInSale = idsFromStore.filter(x => !idsStored.includes(x));

            console.log('Fetch result - unknown sales: ' + getCount(nowInSale) + ', to remove: ' + getCount(notInSaleAnymore) + ', already known: ' + getCount(alreadyStored));

            // lookup and add price details to games in sale
            const gamesToAdd = games.filter(game => nowInSale.includes(game.nsId));
            let gamesToAddWithSaleDetails = [];
            if (gamesToAdd != undefined && gamesToAdd.length >= 0) {
                const priceInfos = await nintendoService.getPriceInfoForGames(gamesToAdd.map(game => game.nsId));
                gamesToAddWithSaleDetails = gamesToAdd
                    .filter(game => priceInfos.get(game.nsId) != undefined) // remove games without price discount
                    .map(game => {
                        const info = priceInfos.get(game.nsId);
                        const historyEntry = saleService.addSale(game.nsId, new Sale(info.price, info.start, info.end));
                        game.saleDetails = historyEntry.getSaleInfo();
                        game.discount = Math.round(((game.priceRegular - game.saleDetails.price)/game.priceRegular)*100);
                        return game;
                    });
            }

            // store new games on sale
            gamesToAddWithSaleDetails.map(game => dataService.saveGame(game));

            // delete games not in sale anymmore
            notInSaleAnymore.map(nsId => dataService.deleteGameByNsId(nsId));

            this.lastFetch = moment();
            return {added: getCount(gamesToAddWithSaleDetails), removed: getCount(notInSaleAnymore), unchanged: getCount(alreadyStored)};
        },
        getLastFetchDate: () => {
            return (this.lastFetch === undefined) ? 'not fetched yet' : this.lastFetch.calendar();
        }
    }
};