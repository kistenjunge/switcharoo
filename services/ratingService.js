'use strict';
const Rating = require('../models/Rating');

module.exports = (opencritic, metacritic) => {
    return {
        getRatingFor: async (title) => {
            let ratings = [];
            let score = undefined;

            let queryOC = opencritic.getRatingFor(title);
            let queryMC = metacritic.getRatingFor(title);

            let ratingOC = await queryOC;
            let ratingMC = await queryMC;
            [ratingOC, ratingMC].map((rating) => {
                if (rating.link !== undefined) {
                    ratings.push(rating);
                }
            });

            let scores = ratings.filter( x => x.score !== undefined );
            if (scores.length > 0) {
                let sum = scores.reduce((previous, current) => ({ score: previous.score +  current.score }));
                score = sum.score / scores.length;
            }

            return {score: score, ratings: ratings};
        }
    }
};