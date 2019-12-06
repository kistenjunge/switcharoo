require('dotenv').config({silent: true});

module.exports = {
    port: process.env.PORT || 3000,
    metacriticKey: process.env.API_KEY_METACRITIC || undefined,
    metacriticHost: process.env.API_HOST_METACRITIC || 'chicken-coop.p.rapidapi.com',
    metacriticBase: process.env.API_BASE_METACRITIC || 'https://chicken-coop.p.rapidapi.com/games/'
};