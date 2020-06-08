'use strict';

/**
 *
 * @param providerQueries
 * @returns average Score and ratings obtained from game rating providers
 *
 * Tries to query all rating providers and calculates the average score from all obtained ratings. But it might
 * occur that the game is listed at the given providers, but hasn't got any score yet. In such cases the returned
 * average score will be set to '-1'.
 */
async function getRatingFromProviders(providerQueries) {
    try {
        let ratings = [];
        let avgScore = -1;

        const results = await Promise.all(providerQueries);
        results.map((rating) => {
            if (typeof rating.link !== 'undefined') {
                ratings.push(rating);
            }
        });

        let scores = ratings.filter( x => typeof x.score !== 'undefined' );
        if (scores.length > 0) {
            let sum = scores.reduce((previous, current) => ({ score: previous.score +  current.score }));
            avgScore = sum.score / scores.length;
        }

        return {avgScore: avgScore, ratings: ratings};
    }
    catch (err) {
        console.log(err);
    }
}

function getRatingUpdate(ratingsFromRepo, ratingFromProvider) {
    let ratingsToReturn = [];
    let avgScore = undefined;

    // add rating from provider or replace existing rating
    if (typeof ratingsFromRepo !== 'undefined') {
        ratingsToReturn = ratingsFromRepo.filter(entry => entry.service !== ratingFromProvider.service)
    }
    if (typeof ratingFromProvider.link !== 'undefined') {
        // add rating
        ratingsToReturn.push(ratingFromProvider);
    }
    else {
        // game wasn't found
    }

    // update average score
    let scores = ratingsToReturn.filter( x => typeof x.score !== 'undefined' );
    if (scores.length > 0) {
        let sum = scores.reduce((previous, current) => ({ score: previous.score +  current.score }));
        avgScore = Math.round(sum.score / scores.length);
    }

    return {score: avgScore, ratings: ratingsToReturn};
}

module.exports = (opencritic, metacritic, gameRepo) => {
    return {
        updateRatingOf: async (game) => {
            opencritic.getRatingFor(game.title)
                .then( (rating) => {
                    const ratingsFromRepo = gameRepo.getRatingsFromProviders(game._id);
                    const update = getRatingUpdate(ratingsFromRepo, rating);
                    gameRepo.setRating(game._id, update.score, update.ratings);
                });
            metacritic.getRatingFor(game.title)
                .then((rating) => {
                    const ratingsFromRepo = gameRepo.getRatingsFromProviders(game._id);
                    const update = getRatingUpdate(ratingsFromRepo, rating);
                    gameRepo.setRating(game._id, update.score, update.ratings);
                });
           // let queryOC = opencritic.getRatingFor(game.title);
            //let queryMC = metacritic.getRatingFor(game.title);
           // const rating = await getRatingFromProviders([queryOC, queryMC]);
            // update rating only if any rating (with or without score) was returned from the given rating providers
           // if (typeof rating.ratings !== 'undefined' && rating.ratings.length) {
           //     gameRepo.setRating(game._id, rating);
           // }
        }
    }
};