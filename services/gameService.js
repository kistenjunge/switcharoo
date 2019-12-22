'use strict';
const db = require('diskdb');

module.exports = () => {
    return {
        db: db.connect('./data', ['games']),

        getAllGames: () => {
            return db.games.find();
        },

        getGameByTitle: (title) => {
            return db.games.findOne({ title: title});
        },

        deleteAllGames: () => {
            db.games.remove();
            db.connect('./data', ['games']);
        },

        deleteGameByNsId: (nsId) => {
            db.games.remove({nsId: nsId});
        },

        getRatedGames: () => {
            return db.games.find().filter(g => Boolean(g.score));
        },

        getUnratedGames: () => {
            return db.games.find().filter(g => (g.score == undefined));
        },

        saveGame: (game) => {
            db.games.save(game);
        },

        setMetacritInfo: (id, rating, url) => {
            let query = {
                _id: id
            };
            let update = {
                score: rating,
                metacriticUrl: url
            }
            db.games.update(query, update);
        }
    }
};