'use strict';

module.exports = () => {
    return (req,res) => {
        res.render('manual', {title: req.query.title, score: req.query.score});
    };
};