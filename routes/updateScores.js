'use strict';


module.exports = (scoreUpdateService) => {
    return async (req,res) => {
        let result = await scoreUpdateService.checkAndUpdateScores();
        res.send("Finished score update. Total failures: " + result.failures + " out of " + result.checked);
    };
};