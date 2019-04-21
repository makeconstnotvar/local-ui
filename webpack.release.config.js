 let path = require('path');

module.exports = {
  entry: {
    app: './app/index.jsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'app'),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env",{"targets": {
                  "chrome": "70"

                }}],
              "@babel/preset-react"
            ],
            plugins: [
              [
                "@babel/plugin-proposal-decorators",
                {
                  "legacy": true
                }
              ],
              [
                "@babel/plugin-proposal-class-properties",
                {
                  "loose": true
                }
              ],
            ]
          }
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname),
      path.join(__dirname, 'node_modules'),

    ]
  },
  /*optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'libs'
    },

  },*/
  mode: 'production',
  devtool: false
};
