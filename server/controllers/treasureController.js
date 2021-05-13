

module.exports = {
  dragonTreasure: async (req, res) => {
    const treasure = await req.app.get('db').get_dragon_treasure(1);
    res.status(200).send(treasure);
  },

  getUserTreasure: async (req, res) => {
    usertreasure = await req.app.get('db').get_user_treasure(req.session.user.id); // no reference to session in this file?
    res.status(200).send(usertreasure);
  },
  
  addUserTreasure: async (req, res) => {
    const { treasureURL } = req.body;
    const { id } = req.session.user;

    usertreasure = await req.app.get('db').add_user_treasure(treasureURL, id);
    res.status(200).send(usertreasure);
  },

  getAllTreasure: async (req, res) => {
    alltreasure = req.app.get('db').get_all_treasure();
    res.status(200).send(alltreasure);
  }
}