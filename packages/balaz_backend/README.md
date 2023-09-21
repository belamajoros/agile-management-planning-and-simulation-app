# AgIle Backend

Backend part of [AgIle](https://git.kpi.fei.tuke.sk/kpi-zp/2022/dp.peter.balaz.2/agile.git) project configured using a NodeJs.

- [Development](#development)
- [Initial setup](#initial-setup)

# Development

For quick look at configuration [package.json](package.json) . For more detailed documentation look inside [docs](docs) folder.

## Initial setup

Set node shell to bash (only on Windows) - this is optional, but recommended

# From bash:
$ npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"

# Or if using cmd:
> npm config set script-shell "C:\Program Files\git\bin\bash.exe"

,or (for user installation of git)

# From bash:
$ npm config set script-shell "C:\\Users\\$(whoami)\\AppData\\Local\\Programs\\Git\\bin\\bash.exe"

# Or if using cmd:
> npm config set script-shell "C:\Users\%username%\AppData\Local\Programs\Git\bin\bash.exe"

Setup your local project by running:

# Clone this repository
$ git clone git@git.kpi.fei.tuke.sk:kpi-zp/2022/dp.peter.balaz.2/agile.git

# Navigate into project folder

# Install dependencies
$ npm install

Reserved stages:

- master
- development

If you want to deploy your own development create a new feature branch and deploy using:

# Deploy a new brach named: AgIle-<current_branch_name>
$ git add .
$ git commit -m "message"
$ git push <current_branch_name>

## Adding dependencies

# Install package as production dependency
$ npm install --save-prod <package>

In order to run API locally using npm run start or npm run server, all production packages need to be added as development dependencies in main ./package.json file as well.

# Inside root folder
$ npm install --save-dev <package>

# API

All REST API endpoints are documented using Docusarus inside docs folder.