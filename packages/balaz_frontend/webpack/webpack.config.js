const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("../package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8081/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8081,
    historyApiFallback: true,
    hot: true,
    open: false
  },

  devtool: "eval-cheap-source-map",

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name:'assets/[name].[ext]'
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }]
      }
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "balaz",
      filename: "remoteEntry.js",
      remotes: {
      },
      exposes: {
        "./AuthService": "./src/services/auth.service",
        "./UserService": "./src/services/user.service",
        "./Home": "./src/components/userscreens/home.component",
        "./Login": "./src/components/userscreens/login.component",
        "./Register": "./src/components/userscreens/register.component",
        "./Project": "./src/components/project/project.component",
        "./IUser": "./src/types/user.type",
        "./Backlog": './src/components/backlog/backlog.component',
        "./Profile": './src/components/userscreens/profile.component',
        "./BoardAdmin": './src/components/boards/board-admin.component',
        "./ProjectList": './src/components/boards/entities/projectList',
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};