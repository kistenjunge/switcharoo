'use strict';
module.exports = (dir) => {
    const nintendo = require(dir + '/nintendoShopService')();
    const metacritic = require(dir + '/metacriticService')();
    const opencritic = require(dir + '/opencriticService')();
    const data = require(dir + '/gameService')();
    const rating = require(dir + '/ratingService')(opencritic, metacritic, data);
    const saleHistory = require(dir + '/saleHistoryService')();
    const fetch = require(dir + '/fetchService')(data, nintendo, saleHistory);
    const scoreUpdate = require(dir + '/scoreUpdateService')(data, rating);
    const cronjobFetch = require(dir + '/fetchCronjob')(fetch);
    const cronjobScore = require(dir + '/scoreCronjob')(scoreUpdate);
    return {
        data,
        saleHistory,
        nintendo,
        metacritic,
        opencritic,
        rating,
        fetch,
        scoreUpdate,
        cronjobFetch,
        cronjobScore
    };
};