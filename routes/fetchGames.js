'use strict';

module.exports = (fetchService) => {
    return async (req,res) => {
        let count = await fetchService.fetchAndStore();
        res.send("Fetched and stored " + count + " games");
    };
};