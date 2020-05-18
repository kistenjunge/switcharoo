'use strict';
const levenshtein = require('fast-levenshtein');

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

module.exports = (dataService, metacriticService) => {
    return {
        lastUpdate: undefined,
        checkAndUpdateScores: () => {
            let games = dataService.getUnratedGames();

            var i = 0;

            games.slice(0, 100).map(game => {
                metacriticService.searchSwitchGame(game.title, (err, list) => {
                    if (err) {
                        console.error(`failed to fetch score for "${game.title}": ${err}`);
                        if (err === 'No results') {
                            dataService.setMetacritInfo(game._id, -1, null);
                        }
                    } else if (list && list[0]) {
                        const bestMatch = getBestMatchTitle(game.title, list);

                        console.debug(`${game.title}: ${bestMatch.metascore}, ${bestMatch.link}`);
                        dataService.setMetacritInfo(game._id, bestMatch.metascore, bestMatch.link);
                    }
                });
            })
        },
        getLastUpdateDate: () => {
            if (this.lastUpdate != null)
                return Date(this.lastUpdate).toString();
            else
                return 'not updated yet'
        }
    }
};