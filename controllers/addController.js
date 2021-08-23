const ClientsModel = require('../models/clients');

//display clients
const displayClients = async (req, res) => {
  try {
    let data = await ClientsModel.find();
    res.status(200).json({
      status: 'success',
      results: data.length,
      data: { data },
    });
  } catch (err) {
    console.log(err);
  }
};

//add cleint
const addClient = async (req, res) => {
  try {
    const newEntry = await new ClientsModel(req.body);
    await newEntry.save(newEntry, () => {
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
};

//edit client
const editClient = async (req, res) => {
  try {
    const id = req.params.id;
    let data = req.body;
    ClientsModel.findByIdAndUpdate(
      //{ _id: new mongodb.ObjectId(id) },
      id,
      { $set: data },
      () => {
        res.redirect('/');
      }
    );
  } catch (err) {
    console.log(err);
  }
};

//delete client
const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    await ClientsModel.findByIdAndDelete(id);
    res.json({ redirect: '/' });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { displayClients, addClient, editClient, deleteClient };
