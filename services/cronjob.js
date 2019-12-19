'use strict';

const CronJob = require('cron').CronJob;

module.exports = (fetchService) => {
    return new CronJob('5 */1 * * * *', async function() {
        let fetchedGames = await fetchService.fetchAndStore();
        console.log('fetch and stored' + fetchedGames + ' games')
    }, null, true, '');
};