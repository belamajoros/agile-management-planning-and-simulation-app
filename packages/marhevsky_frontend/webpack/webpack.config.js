const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("../package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:3001/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3001,
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
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "marhevsky",
      filename: "remoteEntry.js",
      remotes: {
      },
      exposes: {
        "./Home": "./src/components/home",
        "./AuthApi": "./src/api/authApi",
        "./UserApi": "./src/api/userApi",
        "./PrivateRoute": "./src/components/profile/PrivateRoute",
        "./TokenUtil": "./src/utils/token-util",
        "./SimulationSprint": "./src/components/simulation/DnDComponents/DragList2",
        "./SimulationBacklog": "./src/components/simulation/assignTasks",
        "./Category": "./src/components/forms/categoryForm.tsx",
        "./Task": "./src/components/forms/taskForm.tsx",
        "./Backlog": "./src/components/forms/backlogForm.tsx",
        "./Project": "./src/components/forms/projectForm.tsx",
        "./Talent": "./src/components/forms/talentForm.tsx",
        "./Worker": "./src/components/forms/workerForm.tsx",
        "./ProjectOverview": "./src/components/simulation/projectOverview.tsx",
        './DragList': "./src/components/simulation/DnDComponents/DragList",
        './jwtApi': './src/api/jwtApi',
        "./AssignTasks": "./src/components/simulation/assignTasks",
        "./ProjectSimulationReview": "./src/components/simulation/projectSimulationReview",
        "./AdminCenter": "./src/components/admin/adminCenter",
        "./BacklogList": "./src/components/admin/entities/backlogList",
        "./CategoryList": "./src/components/admin/entities/categoryList",
        "./ProjectList": "./src/components/admin/entities/projectList",
        "./TalentList": "./src/components/admin/entities/talentList",
        "./TaskList": "./src/components/admin/entities/taskList",
        "./UserList": "./src/components/admin/entities/userList",
        "./WorkerList": "./src/components/admin/entities/workerList",
        "./Logout": './src/components/profile/logout',
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