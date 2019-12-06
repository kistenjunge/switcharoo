'use strict';
module.exports = (dir) => {
    const nintendo = require(dir + '/nintendoShopService')();
    const metacritic = require(dir + '/metacriticService')();
    const data = require(dir + '/gameService')();
    return {
        data,
        nintendo,
        metacritic
    };
};