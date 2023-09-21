const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./config/keys');

const RegistrationRouter = require('./routes/registrationRoute');
const LoginRouter = require('./routes/loginRoute');
const SprintRouter = require('./routes/sprintRoute');
const StoryRouter = require('./routes/storyRoute');
const ProjectRouter = require('./routes/projectRoute');
const TaskRouter = require('./routes/taskRoute');
const UsersRouter = require('./routes/usersRoute');

require('./models/user');
require('./services/passport');

mongoose.connect(keys.mongoURI, async (err) => {
  if (err) throw err;
  console.log('conncted to db');
});

// mongoose.set('useFindAndModify', false);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(cors()); // Use this after the variable declaration

app.use('/registration', RegistrationRouter);
app.use('/login', LoginRouter);
app.use('/sprint', SprintRouter);
app.use('/project', ProjectRouter);
app.use('/story', StoryRouter);
app.use('/task', TaskRouter);
app.use('/users', UsersRouter);

app.use(passport.initialize());

app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
