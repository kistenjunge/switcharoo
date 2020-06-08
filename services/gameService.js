'use strict';
const db = require('diskdb');

module.exports = () => {
    return {
        db: db.connect('./data', ['games']),

        getAllGames: () => {
            return db.games.find();
        },

        getGameByTitle: (title) => {
            return db.games.findOne({ title: title });
        },

        deleteAllGames: () => {
            db.games.remove();
            db.connect('./data', ['games']);
        },

        deleteGameByNsId: (nsId) => {
            db.games.remove({ nsId: nsId });
        },

        getRatedGames: () => {
            return db.games.find({rating_available: true, rating_hasScore: true});
        },

        // rating website link exists, but rating is not available yet
        getGamesWithoutScore: () => {
            return db.games.find({rating_available: true, rating_hasScore: false});
        },

        // could not be found at any rating website
        getGamesWithoutRating: () => {
            return db.games.find({rating_available: false});
        },

        getStats: () => {
            const gameOnSale = db.games.count();
            const gamesWithRating = module.exports().getRatedGames().length;
            const tbd = module.exports().getGamesWithoutScore().length;
            const notFound = module.exports().getGamesWithoutRating().length;
            return { notFound: notFound, unrated: tbd, rated: gamesWithRating, total: gameOnSale};
        },

        saveGame: (game) => {
            db.games.save(game);
        },

        // FIXME - resets everything. Seems like using a query with more than one parameter might be broken?
        resetRatingForGamesWithoutScore: () => {
            const options = {
                multi: true
            };
            const queryWithoutScore = {
                //rating_score: undefined
                //not working as expected
                rating_available: true,
                rating_hasScore: false
            };
            const update = {
                rating_providers: undefined,
                rating_available: false,
                rating_hasScore: false,
                rating_score: undefined
            };
            db.games.update(queryWithoutScore, update, options);
        },

        getRatingsFromProviders: (id) => {
            return db.games.findOne({ _id: id }).rating_providers;
        },

        setRating: (id, score, ratings) => {
            const hasScore = typeof score !== 'undefined';
            const hasRating = (typeof ratings !== 'undefined' && ratings.length > 0);
            let query = {
                _id: id
            };
            let update = {
                rating_available: hasRating,
                rating_hasScore: hasScore,
                rating_providers: ratings,
                rating_score: score
            };
            db.games.update(query, update);
        }
    }
};