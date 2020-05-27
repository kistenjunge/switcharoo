'use strict';

const ScoreCronjob = require('cron').CronJob;

module.exports = async (scoreUpdateService) => {
    return new ScoreCronjob('0 */5 * * * *', async function () {
        console.log('cron job started - score update using metacritic');
        scoreUpdateService.checkAndUpdateScores();
    }, null, true, '');
};