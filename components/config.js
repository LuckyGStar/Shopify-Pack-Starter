module.exports = {
  basePath: `./components`,
  customerPath: `./components/customer`,
  exportPath: `./assets`,
  thirdParty: {
    // https://github.com/sass/node-sass#options
    sassOptions: {
      errLogToConsole: false,
      outputStyle: "expanded",
    },
    // https://github.com/fmarcia/UglifyCSS
    uglifyCssOptions: {
      maxLineLen: 312,
      uglyComments: false,
    },
  },
};
