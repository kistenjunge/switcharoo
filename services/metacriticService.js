'use strict';
const Rating = require('../models/Rating');
const service = 'metacritic';
const metacriticScrape = require('./metacriticScrapeService');
const { promisify } = require('util');
const levenshtein = require('fast-levenshtein');
const platformIdSwitch = 268409;
const categoryGame = 'game';

const asyncScrapeSearch = promisify(metacriticScrape.Search);

async function searchSwitchGame(title) {
    const searchTitle = getSearchTitle(title);
    console.log(`${title} = ${searchTitle}`);

    const options = { text: searchTitle, category: categoryGame, platformId: platformIdSwitch };
    return asyncScrapeSearch(options);
}

const getBestMatchTitle = (title, titlesFromMC) => {
    var lowestScore = 99;
    var bestMatch = titlesFromMC[0];

    titlesFromMC.forEach(game => {
        const score = levenshtein.get(title, game.title);
        if (score < lowestScore) {
            lowestScore = score;
            bestMatch = game;
        }
    });

    console.log(`Found best match for "${title}" with a score of ${lowestScore}: "${bestMatch.title}"`);
    return bestMatch;
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
        const list = await searchSwitchGame(title);
        const bestMatch = getBestMatchTitle(title, list);
        console.debug(`${title}: ${bestMatch.metascore}, ${bestMatch.link}`);
        let score = (bestMatch.metascore !== 'tbd') ? parseInt(bestMatch.metascore) : undefined;
        return new Rating(score, bestMatch.link, service);
    }
    catch (err) {
        console.error(`failed to fetch score for "${title}": ${err}`);
        if (err === 'No results') {
            return new Rating(undefined, undefined, service);
        }
        else {
            // error but no results... what should we do here?
            return new Rating(undefined, undefined, service);
        }
    }
}

module.exports = () => {
    return {
        searchSwitchGame: searchSwitchGame,
        getRatingFor: getRatingFor
    };
}