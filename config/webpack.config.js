const { resolve } = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const packageJSON = require('../package.json');
const packageName = normalizePackageName(packageJSON.name);

const LIB_NAME = pascalCase(packageName);
const ROOT = resolve(__dirname, '..');
const PATHS = {
  entry: resolve(ROOT, 'src/index.ts'),
  umd: resolve(ROOT, 'lib'),
};

const DEFAULT_ENV = { dev: true };

const RULES = {
  ts: {
    test: /\.tsx?$/,
    include: /src/,
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {},
      },
    ],
  },
};

const config = (env = DEFAULT_ENV) => {
  const { ifProd, ifNotProd } = getIfUtils(env);
  const mode = ifProd('production', 'development');

  const PLUGINS = removeEmpty([
    ifProd(
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
          output: { comments: false },
        },
      }),
    ),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      minimize: true,
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: ifProd('"production"', '"development"') },
    }),
  ]);

  const UMDConfig = {
    entry: {
      [ifProd(`${packageName}.min`, packageName)]: [PATHS.entry],
    },
    output: {
      path: PATHS.umd,
      filename: '[name].umd.js',
      libraryTarget: 'umd',
      library: LIB_NAME,
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    externals: {},
    devtool: 'source-map',
    mode,
    performance: {
      hints: 'warning',
    },
    stats: 'minimal',
    plugins: PLUGINS,
    module: {
      rules: [RULES.ts],
    },
  };

  return [UMDConfig];
};

module.exports = config;

// helpers

/**
 *
 * @param {string} myStr
 */
function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 *
 * @param {string} myStr
 */
function dashToCamelCase(myStr) {
  return myStr.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

/**
 *
 * @param {string} myStr
 */
function toUpperCase(myStr) {
  return `${myStr.charAt(0).toUpperCase()}${myStr.substr(1)}`;
}

/**
 *
 * @param {string} myStr
 */
function pascalCase(myStr) {
  return toUpperCase(dashToCamelCase(myStr));
}

/**
 *
 * @param {string} rawPackageName
 */
function normalizePackageName(rawPackageName) {
  const scopeEnd = rawPackageName.indexOf('/') + 1;

  return rawPackageName.substring(scopeEnd);
}
