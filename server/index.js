const express = require('express');
const massive = require('massive');
const session = require('express-session');
require('dotenv').config();
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const PORT = 4000;
const { SESSION_SECRET, CONNECTION_STRING} = process.env;

const app = express();
app.use(express.json());

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
}).then(database => app.set('db', database))
.catch(err => console.log(err));

app.use(session({ //how is session actually working??
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user',auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user',auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);




app.listen(PORT, () => console.log('server listening on ' + PORT));

