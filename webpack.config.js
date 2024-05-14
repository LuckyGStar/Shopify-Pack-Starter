const { readdirSync, existsSync } = require("fs");
const TerserPlugin = require("terser-webpack-plugin");
const mode = require("gulp-mode")();

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const CONFIG = require(`./components/config`);

const checkFile = (path, exts) => {
  const match = exts.find((ext) => existsSync(`${path}.${ext}`));
  if (!match) return null;
  return `${path}.${match}`;
};

const buildEntryPoints = () => {
  const entryPoints = {};

  getDirectories(`${CONFIG.basePath}/`).map((name) => {
    const basePath = `./components/${name}`;
    const defaultPath = `${basePath}/${name}`;
    const defaultFile = checkFile(defaultPath, ["js", "jsx"]);
    if (defaultFile) return (entryPoints[name] = defaultFile);
  });
  return entryPoints;
};

module.exports = {
  mode: mode.development() ? "development" : "production",
  watch: mode.development(),
  entry: buildEntryPoints(),
  output: {
    filename: "[name].min.js",
    sourceMapFilename: "[name].min.map",
  },
  devtool: mode.development() ? "eval" : false,
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            ["@babel/transform-runtime"],
            [
              "@babel/plugin-transform-react-jsx",
              { pragma: "h", pragmaFrag: "Fragment" },
            ],
          ],
        },
      },
    ],
  },
};
