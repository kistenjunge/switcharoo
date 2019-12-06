'use strict';
const SwitchEshop = require('nintendo-switch-eshop');

/* https://gist.github.com/lmmfranco/bd2ca333d0c10f274a286ec05ac1d106 */
module.exports = () => {
    return {
        getGamesOnSale: () => {
            return SwitchEshop.getGamesEurope().then(games => {
                return games.filter(g => g.price_has_discount_b);
            }, () => { console.log('Failed to fetch games from store')});
        }
    }
};