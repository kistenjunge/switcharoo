'use strict';
const Settings = require('../settings');
const fs = require('fs');

module.exports = (dataService, fetchService) => {
    return (req,res) => {
        const ratedGames = dataService.getRatedGames().sort( (a, b) => b.score - a.score);
        const unratedGames = dataService.getUnratedGames();
        const games = ratedGames.concat(unratedGames);
        const lastUpdate = fetchService.getLastFetchDate();
        const versionInfo = Settings.buildVersion || Settings.buildVersion || 'local build';
        res.render('games', { title: games.length + ' Games on Sale', gamesList: games, lastFetch: lastUpdate, version: versionInfo });
    };
};