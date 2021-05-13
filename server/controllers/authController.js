const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const {username, password, isAdmin} = req.body;
    const db = req.app.get('db');

    const result = await db.get_user(username);
    const existingUser = result[0];
    existingUser ? res.status(409).send('Username Taken'): null;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.register_user(isAdmin, username, hash);
    const user = registeredUser[0];
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    }
    return res.send(req.session.user);
  },

  login: async (req, res) => {
    const {username, password} = req.body;
    const db = req.app.get('db'); // is this a part of express connected through massive?
    const foundUser = await db.get_user(username);
    const user = foundUser[0];
    !user ? res.status(401).send('User not found, please register as a new user.') : null;
    const isAuthenticated = bcrypt.compareSync(password, user.hash); //how does this work?
    !isAuthenticated ? res.status(403).send('Incorrect password') : null;
    req.session.user = { //session is used here but imported in index.js?
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    }
    return res.status(200).send(req.session.user);

  },

  logout: async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  }
  

}