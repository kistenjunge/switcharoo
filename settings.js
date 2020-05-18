require('dotenv').config({ silent: true });

module.exports = {
    port: process.env.PORT || 3000,
    buildVersion: process.env.IMAGE_VERSION || undefined
};