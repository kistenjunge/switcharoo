'use strict';
const SwitchEshop = require('nintendo-switch-eshop');

/* https://gist.github.com/lmmfranco/bd2ca333d0c10f274a286ec05ac1d106 */
module.exports = () => {
    return {
        getGamesOnSale: () => {
            return SwitchEshop.getGamesEurope({ limit: SwitchEshop.EshopError.EU_GAME_LIST_LIMIT, locale: 'de'}).then(games => {
                return games.filter(g => g.price_has_discount_b);
            }, () => { console.log('Failed to fetch games from store')});
        },
        getPriceInfoForGames: (nsuids) => {
            return SwitchEshop.getPrices('DE', nsuids)
                .then(
                    info => {
                        return info.prices
                            .filter(item => item.sales_status ==='onsale') // only interested in games we can play right now
                            .filter(item => item.discount_price != undefined) // sometimes a sale hasn't got a discount price
                            .reduce((acc, item) => acc.set(item.title_id.toString(), {
                                price: item.discount_price.raw_value,
                                start: item.discount_price.start_datetime,
                                end: item.discount_price.end_datetime
                            }), new Map());
                    },
                    (res) => {
                        console.log('Failed to fetch price info for game with nsuid ' + nsuid)
                    }
                    );
        }
    }
};