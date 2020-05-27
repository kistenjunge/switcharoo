'use strict';
const axios = require('axios').default;
const Rating = require('../models/Rating');
const Settings = require('../settings');
const service = 'opencritic';

async function searchGame(title) {
    const titleEncoded = encodeURIComponent(title);
    return await axios({
        method: 'get',
        url: Settings.opencriticBase + '/meta/search',
        params: {
            criteria: titleEncoded
        },
    }).then(response => {
        // get first search result
        let first = response.data[0];
        // check dist and discard if bigger than 0.59
        if (first.dist <= 0.59) {
            return {error: false, id: first.id, name: first.name};
        }
        console.log('[info] opencritic - ' + title + ' - not found - distance too high');
        return {error: false, id: undefined, name: undefined};
    }).catch( () => {
        console.log('[error] opencritic - ' + title + ' - search request failed - criteria: ' + titleEncoded);
        return {error: true, id: undefined, name: undefined};
    });
}

async function getScore(id) {
    return await axios({
        method: 'get',
        url: Settings.opencriticBase + '/game/' + id,
    }).then(response => {
        let score = (response.data.medianScore > -1) ? response.data.medianScore : undefined;
        return {error: false, score: score};
    }).catch( () => {
        console.log('[error] opencritic - score request failed - id: ' + id);
        return {error: true, score: undefined};
    });
}

async function getRatingForWithErrors(title) {
    let searchResult = await searchGame(title);
    if (searchResult.error) {
        return {error: true, rating: undefined};
    }
    if (searchResult.id === undefined) {
        return {error: false, rating: undefined};
    }

    let link = 'https://opencritic.com/game/' + searchResult.id + '/' + searchResult.name.replace(/ /g, "-");
    let rating = await getScore(searchResult.id);
    if (rating.error) {

        return {error: true, rating: new Rating(undefined, link)};
    }
    return {error: false, rating: new Rating(rating.score, link)};
}

async function getRatingFor(title) {
    let searchResult = await searchGame(title);
    if (searchResult.error || searchResult.id === undefined) {
        return new Rating(undefined, undefined, service);
    }

    let link = 'https://opencritic.com/game/' + searchResult.id + '/' + searchResult.name.replace(/ /g, "-");
    let rating = await getScore(searchResult.id);
    if (rating.error) {
        return new Rating(undefined, link, service);
    }
    return new Rating(rating.score, link, service);
}

module.exports = () => {
    return {
        getRatingFor: getRatingFor
    }
};