'use strict';

module.exports = (fetchService) => {
    return async (req,res) => {
        let result = await fetchService.fetchAndStore();
        res.send("Fetched and stored " + result.added + " new games, and removed " + result.removed + " games, and kept " + result.unchanged + " games");
    };
};