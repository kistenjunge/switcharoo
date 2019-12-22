'use strict';
module.exports = (dir) => {
    const nintendo = require(dir + '/nintendoShopService')();
    const metacritic = require(dir + '/metacriticService')();
    const data = require(dir + '/gameService')();
    const fetch = require(dir + '/fetchService')(data, nintendo);
    const cronjob = require(dir + '/cronjob')(fetch);
    return {
        data,
        nintendo,
        metacritic,
        fetch,
        cronjob
    };
};