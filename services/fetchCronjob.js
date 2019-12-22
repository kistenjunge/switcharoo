'use strict';

const FetchCronjob = require('cron').CronJob;

module.exports = (fetchService) => {
    return new FetchCronjob('0 8 */1 * * *', async function() {
        console.log('cron job started - fetch games from store');
        let result = await fetchService.fetchAndStore();
        console.log("cronjob fetched and stored " + result.added + " new games, and removed " + result.removed + " games")
    }, null, true, '');
};