'use strict';
const axios = require('axios').default;
const Rating = require('../models/Rating');
const Settings = require('../settings');
const service = 'opencritic';

async function searchGame(title) {
    try {
        const titleEncoded = encodeURIComponent(title);
        const response = await axios({
            method: 'get',
            url: Settings.opencriticBase + '/meta/search',
            params: {
                criteria: titleEncoded
            },
        });

        let first = response.data[0];
        // check dist and discard if bigger than 0.59
        if (first.dist <= 0.59) {
            return {error: false, id: first.id, name: first.name};
        }
        console.log('[info] opencritic - ' + title + ' - not found - distance too high');
        return {error: false, id: undefined, name: undefined};
    }
    catch (e) {
        console.log('[error] opencritic - ' + title + ' - search request failed - criteria: ' + titleEncoded);
        throw Error('opencritic - ' + title + ' - search request failed - criteria: ' + titleEncoded);
    }
}

async function getScore(id) {
    try {
        const response = await axios({
            method: 'get',
            url: Settings.opencriticBase + '/game/' + id,
        });
        let score = (response.data.medianScore > -1) ? response.data.medianScore : undefined;
        return {error: false, score: score};
    }
    catch (e) {
        console.log('[error] opencritic - score request failed - id: ' + id);
        throw Error('opencritic - score request failed - id: ' + id);
    }
}

async function getRatingFor(title) {
    let link = undefined;
    try {
        const searchResult = await searchGame(title);
        if (typeof searchResult.id === 'undefined') {
            return new Rating(undefined, undefined, service);
        }
        link = 'https://opencritic.com/game/' + searchResult.id + '/' + searchResult.name.replace(/ /g, "-");
        let rating = await getScore(searchResult.id);
        return new Rating(rating.score, link, service);
    }
    catch (e) {
        return new Rating(undefined, link, service);
    }
}

module.exports = () => {
    return {
        getRatingFor: getRatingFor
    }
};