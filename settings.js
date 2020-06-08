require('dotenv').config({ silent: true });

module.exports = {
    port: process.env.PORT || 3000,
    opencriticBase: process.env.API_BASE_OPENCRITIC || 'https://api.opencritic.com/api',
    buildVersion: process.env.IMAGE_VERSION || undefined
};