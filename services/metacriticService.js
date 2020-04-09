'use strict';
const axios = require('axios').default;
const Settings = require('../settings');
const levenshtein = require('fast-levenshtein');

const apiHeaders = {
    'content-type': 'application/octet-stream',
    'x-rapidapi-host': Settings.metacriticHost,
    'x-rapidapi-key': Settings.metacriticKey
};

const searchSwitchGame = async (title) => {
    const searchTitle = getSearchTitle(title);
    return axios({
        "method": "GET",
        "url": "https://chicken-coop.p.rapidapi.com/games",
        headers: apiHeaders,
        params: {
            "title": searchTitle
        }
    })
        .catch(error => {
            return Promise.reject('searchError')
        })
        .then((response) => {
            if (response.status != 200 || !response.data) {

                console.log(`Error searching title ${title}: ${response.status} ${response.data}`);
                return Promise.reject('searchError')
            }

            if (response.data.result && Array.isArray(response.data.result)) {
                const switchGames = response.data.result.filter(r => r.platform === 'Switch');
                if (Array.isArray(switchGames) && switchGames[0]) {
                    return Promise.resolve(getBestMatchTitle(title, switchGames));
                } else {
                    if (response.data.result.length == 10) {
                        // API only returns ten results, let's try to find the closest match
                        return Promise.resolve(getBestMatchTitle(title, response.data.result));
                    }
                }
            }
            console.log(`title "${title}" not found using "${searchTitle}"`)
            return Promise.reject('notFound');
        })
}

const fetchSoreForSwitchGame = async (title) => {
    if (!title) {
        console.log('title is undefined');
    }
    const encodedTitle = encodeURIComponent(title.replace(/\//g, ''));
    return await axios({
        method: 'get',
        url: Settings.metacriticBase + encodedTitle,
        params: {
            platform: 'switch'
        },
        headers: apiHeaders
    }).then(response => {
        if (response.status === 200) {
            return Object.is(response.data.result, 'No result') ? { known: false, error: false, score: undefined } : { known: true, error: false, score: response.data.result.score };
        }
        else {
            console.log('Error response from metacritic server while getting score for ' + title + ' with uri: ' + queryTitle);
            console.log('\tresponse - ' + response.status);
            console.log('\tmessage - ' + response.data);
            return { error: true, known: undefined, score: undefined };
        }
    }).catch(error => {
        console.log('Exception while getting score for ' + title + ' with uri: ' + encodedTitle);
        return { error: true, known: undefined, score: undefined };
    });
}

const getBestMatchTitle = (title, titlesFromMC) => {
    var lowestScore = 99;
    var bestMatch = title;

    titlesFromMC.map(e => e.title).forEach(element => {
        const score = levenshtein.get(title, element);
        if (score < lowestScore) {
            lowestScore = score;
            bestMatch = element;
        }
    });

    console.log(`Found best match for "${title}" with a score of ${lowestScore}: "${bestMatch}"`);
    return bestMatch;
}

/**
 * Generates a path witch might point to the game's website
 * @param title will be escaped and changed so that it might work
 * @returns {string}
 */
const guessGameUrl = (platform, title) => {
    const possiblePath = title
        .replace(/([#;,:\/'])/g, '')
        .replace(/\s/g, '-')
        .toLowerCase();
    return `/game/${platform}/${possiblePath}`;
}

function getSearchTitle(title) {
    return title
        .replace(/[^a-zA-Z0-9öäüÖÄÜß\-:.]/g, ' ')
        .replace(/ f[oü]r Nintendo Switch/g, '')
        .replace(/[\s\-]*Nintendo Switch Edition/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/* https://rapidapi.com/collection/metacritic-api-alternatives */
module.exports = () => {
    return {
        fetchSoreForSwitchGame,
        searchSwitchGame,
        guessGameUrl
    };
}