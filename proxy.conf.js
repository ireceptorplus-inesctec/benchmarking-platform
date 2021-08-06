require('dotenv').config()
var process = require("process");
var API_URI = process.env.API_URI;

console.log(API_URI);

const PROXY_CONFIG = [
    {
        context: [
            "/api/**"
        ],
        target: API_URI + "/"
    },
];

module.exports = PROXY_CONFIG;