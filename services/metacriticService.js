'use strict';
const axios = require('axios').default;
const Settings = require('../settings');

/* https://rapidapi.com/collection/metacritic-api-alternatives */
module.exports = () => {
    return {
        /**
         * Generates a path witch might point to the game's website
         * @param platform [switch, pc, ...]
         * @param title will be escaped and changed so that it might work
         * @returns {string}
         */
        guessGameUrl: (platform, title) => {
            const possiblePath = title
                .replace(/([#;,:\/'])/g, '')
                .replace(/\s/g, '-')
                .toLowerCase();
            return `/game/${platform}/${possiblePath}`;
        },

        getRatingForSwitchGame: async (title) => {
            const encodedTitle = encodeURIComponent(title.replace(/\//g, ''));
            const queryTitle = encodeURIComponent(encodedTitle);
            return await axios({
                method: 'get',
                url: Settings.metacriticBase + encodedTitle,
                params: {
                    platform: 'switch'
                },
                headers: {
                    'x-rapidapi-host': Settings.metacriticHost,
                    'x-rapidapi-key': Settings.metacriticKey
                }
            }).then( response => {
                if (response.status === 200) {
                    return Object.is(response.data.result, 'No result') ? {known: false, error: false, score: undefined} : {known: true, error: false, score: response.data.result.score};
                }
                else {
                    console.log('Error response from metacritic server while getting score for ' + title + ' with uri: ' + queryTitle);
                    console.log('\tresponse - ' + response.status);
                    console.log('\tmessage - ' + response.data);
                    return {error:true, known: undefined, score: undefined};
                }
            }).catch( error => {
                console.log('Exception while getting score for ' + title + ' with uri: ' + queryTitle);
                return {error: true, known: undefined, score: undefined};
            });
        }
    }
};