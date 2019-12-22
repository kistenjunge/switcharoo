'use strict';

const ScoreCronjob = require('cron').CronJob;

module.exports = (scoreUpdateService) => {
    return new ScoreCronjob('0 */5 * * * *', async function() {
        console.log('cron job started - score update using metacritic');
        await scoreUpdateService.checkAndUpdateScores();
    }, null, true, '');
};