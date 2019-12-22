'use strict';
module.exports = (dir) => {
    const nintendo = require(dir + '/nintendoShopService')();
    const metacritic = require(dir + '/metacriticService')();
    const data = require(dir + '/gameService')();
    const fetch = require(dir + '/fetchService')(data, nintendo);
    const scoreUpdate = require(dir + '/scoreUpdateService')(data, metacritic);
    const cronjobFetch = require(dir + '/fetchCronjob')(fetch);
    const cronjobScore = require(dir + '/scoreCronjob')(scoreUpdate);
    return {
        data,
        nintendo,
        metacritic,
        fetch,
        scoreUpdate,
        cronjobFetch,
        cronjobScore
    };
};