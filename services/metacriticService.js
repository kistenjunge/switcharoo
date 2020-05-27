'use strict';
const Settings = require('../settings');
const metacriticScrape = require('./metacriticScrapeService');

const platformIdSwitch = 268409;
const categoryGame = 'game';

const searchSwitchGame = async (title, cb) => {
    const searchTitle = getSearchTitle(title);
    console.log(`${title} = ${searchTitle}`);

    const options = { text: searchTitle, category: categoryGame, platformId: platformIdSwitch };

    metacriticScrape.Search(options, cb);
}

function getSearchTitle(title) {
    return title
        .toLowerCase()
        .replace(/[:-][a-z0-9öäüß\s]+edition.*/g, '')
        .replace(/[^a-z0-9öäüßō]/g, ' ')
        .replace(/ f[oü]r nintendo switch.*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

module.exports = () => {
    return {
        searchSwitchGame
    };
}