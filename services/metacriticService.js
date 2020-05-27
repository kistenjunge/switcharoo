'use strict';
const axios = require('axios').default;
const Rating = require('../models/Rating');
const Settings = require('../settings');
const service = 'metacritic';
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

async function getRatingFor(title) {
    try {
        let rating = await getRatingForSwitchGame(title); // TODO
        if (!rating.error && rating.known) {
            let url = 'https://www.metacritic.com' + guessGameUrl('switch', title);
            return new Rating(rating.score, url, service);
        }
        return new Rating(undefined, undefined, service);
    } catch (error) {
        return new Rating(undefined, undefined, service);
    }
}

module.exports = () => {
    return {
        searchSwitchGame: searchSwitchGame,
        getRatingFor: getRatingFor
    };
}