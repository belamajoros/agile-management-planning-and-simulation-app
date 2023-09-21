# AgIle Web UI

Frontend part of [AgIle](https://git.kpi.fei.tuke.sk/kpi-zp/2022/dp.peter.balaz.2/agile) project made in [React](https://react.org).

- [Development](#development)
- [Building](#building)
- [Deploying](#deploying)
- [VS Code Setup](#vs-code-setup)

## Development

### Initial setup
npm install

- set node shell to bash (only on Windows) - this is optional but it enables you to run specific npm scripts

npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"

- start development server, it will be accessible at localhost:4200

npm start

- install recommended extensions for VS Code
- that's it, you can hack now

### Updating dependencies
npm run updateDependencies
This will automatically update all dependencies with the help of ``npm-check-updates``

### Linting and formatting
Combination of eslint (linter) and prettier (formatter) is used:
- check linting and formatting: npm run lint,
- fix linting and formatting: npm run lint:fix.

### Design

App uses [React Bootstrap](https://react-bootstrap.github.io/) as the base. 
In general use CSS classes to apply styles, see [guide](docs/css.md)

#### Colors

App is setup to use light theme.

#### Typography

You never change font-family, font-size or font-family.
#### Icons

Use only [Free Icons](https://freeicons.io/) they work with React bootstrap out of the box.

#### Links

Apply default styles to anchors with class link. For external links (href is outside this app) use link-external.

### Style

Use [prettier](https://prettier.io/) for code formatting.

## Building

The build artifacts will be stored in the dist/ directory.

- run npm run build to build for development environment

## Deploying

⚠ NEVER EVER DEPLOY RESERVED STAGES (BRANCHES) MANUALLY FROM YOUR MACHINE. Reserved stages: master, development

If you want to deploy your own development create a new feature branch and deploy using:

# Deploy a new brach named: AgIle-<current_branch_name>
$ git add .
$ git commit -m "message"
$ git push <current_branch_name>

## VS Code Setup

Recommended extensions and settings are already present in .vscode directory.

### ESLint

[Angular ESLint](https://github.com/angular-eslint/angular-eslint)  
[VS Code with Angular ESLint](https://github.com/angular-eslint/angular-eslint#linting-html-files-and-inline-templates-with-the-vscode-extension-for-eslint)  
[ESLint](https://eslint.org/docs/user-guide/configuring)

### Prettier

[Prettier](https://prettier.io/docs/en/index.html)