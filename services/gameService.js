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
            return db.games.find().filter(g => (g.score != undefined));
        },

        getUnratedGames: () => {
            return db.games.find().filter(g => (g.score == undefined));
        },

        getStats: () => {
            const tbd = db.games.find().filter(g => (g.score === 0)).length;
            const notFound = db.games.find().filter(g => (g.score === -1)).length;
            return { tbd: tbd, notFound: notFound }
        },

        saveGame: (game) => {
            db.games.save(game);
        },

        retry: () => {

            const options = {
                multi: true
            }

            const queryTba = {
                score: 0
            };

            const queryNotFound = {
                score: -1
            };

            const update = {
                score: undefined
            }

            db.games.update(queryTba, update, options);
            db.games.update(queryNotFound, update, options);
        },

        setMetacritInfo: (id, rating, url) => {
            const score = (rating === 'tbd') ? 0 : rating;

            let query = {
                _id: id
            };
            let update = {
                score: score,
                metacriticUrl: url
            }
            db.games.update(query, update);
        }
    }
};