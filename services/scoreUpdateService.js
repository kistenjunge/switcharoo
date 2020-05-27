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

module.exports = (dataService, ratingService) => {
    return {
        lastUpdate: undefined,
        checkAndUpdateScores: async () => {
            let games = dataService.getGamesWithoutRating();
            let failedGames = [];
            await Promise.all(games.map( async game => {
                let rating = await ratingService.getRatingFor(game.title);
                if (rating.ratings && rating.ratings.length) {
                    dataService.setRating(game._id, rating);
                }
                else {
                    failedGames.push(game);
                }
            }));
            console.log("Finished score update. Total failures: " + failedGames.length + " out of " + games.length);
            return {checked: games.length, updated: (games.length - failedGames.length), failures: failedGames.length};
        },
        checkAndUpdateScoresDWBranch: () => {
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