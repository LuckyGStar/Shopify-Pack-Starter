const { extname, parse } = require("path");
const { readdirSync, existsSync } = require("fs");

const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const merge = require("merge-stream");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const uglifycss = require("gulp-uglifycss");
const webpack = require("webpack-stream");

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const CONFIG = require(`./components/config`);

const buildFiles = (basePath, files) => {
  const { name, type } = files[0];
  const path = `${basePath}${type}.${name}.liquid`;

  // Establish gulp task
  return gulp
    .src(path)
    .pipe(rename({ basename: name }))
    .pipe(gulp.dest(`./${type}s/`));
};

const checkFile = (name, ext) => {
  const basePath = `${CONFIG.basePath}/${name}`;
  const defaultPath = `${basePath}/${name}`;
  const defaultFile = existsSync(`${defaultPath}.${ext}`);
  if (defaultFile) return `${defaultPath}.${ext}`;
};

gulp.task("liquid", () => {
  const paths = getDirectories(`${CONFIG.basePath}/`)
    .map((name) => `${CONFIG.basePath}/${name}/`)
    .flat()
    .filter((path) => path);

  const customerPaths = getDirectories(`${CONFIG.customerPath}/`)
    .map((name) => `${CONFIG.customerPath}/`)
    .flat()
    .filter((path) => path);

  const fullPaths = paths.concat(customerPaths);

  const tasks = fullPaths.map((path) => {
    let t = [];
    const categorizedFiles = {};
    readdirSync(path)
      .filter((file) => extname(file) === ".liquid")
      .map((file) => {
        const fileParts = parse(file).name.split(".");
        const name = fileParts.pop();
        const type = fileParts.pop();
        if (!categorizedFiles[name]) categorizedFiles[name] = [];
        categorizedFiles[name].push({ name, type });
      });

    if (!Object.keys(categorizedFiles).length) return;

    for (const categorizedFile of Object.values(categorizedFiles)) {
      const sections = categorizedFile.filter(
        (file) => file.type === "section"
      );
      const snippets = categorizedFile.filter(
        (file) => file.type === "snippet"
      );
      if (sections.length) t.push(buildFiles(path, sections));
      if (snippets.length) t.push(buildFiles(path, snippets));
    }

    return t;
  });

  // Flatten the array and filter out null/undefined tasks
  const filteredTasks = tasks.flat().filter((task) => task);
  if (!filteredTasks.length) return;
  return merge(filteredTasks);
});

gulp.task("css", function () {
  const paths = getDirectories(`${CONFIG.basePath}/`)
    .map((name) => checkFile(name, "scss"))
    .filter((path) => path);

  return gulp
    .src(paths)
    .pipe(sass(CONFIG.thirdParty.sassOptions).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss(CONFIG.thirdParty.uglifyCssOptions))

    .pipe(
      rename(({ basename, dirname, extname }) => {
        const name = basename.split(".").pop();
        return {
          basename: `${name}.min`,
          dirname,
          extname,
        };
      })
    )
    .pipe(gulp.dest(CONFIG.exportPath));
});

gulp.task("js", () => {
  return gulp
    .src(`${CONFIG.basePath}/**/*.{js,jsx}`, { since: gulp.lastRun("js") })
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest(CONFIG.exportPath));
});

gulp.task("watch", () => {
  gulp.watch("./components/**/*.scss", gulp.series("css"));
  gulp.watch("./components/**/*.{js,jsx}", gulp.series("js"));
  gulp.watch("./components/**/*.liquid", gulp.series("liquid"));
});

gulp.task("build", gulp.parallel("css", "js", "liquid"));
gulp.task("default", gulp.series("build", "watch"));
