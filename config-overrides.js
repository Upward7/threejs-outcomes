const {override} = require("customize-cra");

//  "build": "react-app-rewired build",
module.exports = override(
    config => {
        config.output.publicPath = "/threejs-outcomes/"
        config.output.path = require("path").resolve(__dirname, "docs");
        return config;
    }
)