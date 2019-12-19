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

        setRatingForSwitchGame: (game) => {
            return axios({
                method: 'get',
                url: Settings.metacriticBase + encodeURIComponent(game.title.replace(/\//g, '')),
                params: {
                    platform: 'switch'
                },
                headers: {
                    'x-rapidapi-host': Settings.metacriticHost,
                    'x-rapidapi-key': Settings.metacriticKey
                }
            }).then( response => {
                if (response.status === 200) {
                    game.score = Object.is(response.data.result, 'No result') ? undefined: response.data.result.score;
                }
                else
                    game.score = undefined;
            }).catch( error => {
                console.log('Failed to fetch score for ' + game.title);
                game.score = undefined;
            });
        }
    }
};