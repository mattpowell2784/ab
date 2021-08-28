const ClientsModel = require('../models/clients');

//display clients
displayClients = async (req, res) => {
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

//search clients
const searchClients = async (req, res) => {
  try {
    // aggregate().search({
    //   text: {
    //     query: 'baseball',
    //     path: 'plot',
    //   },
    // });

    const queryObj = { ...req.query };
    console.log(req.query, req.body, req.searchString);

    const query = ClientsModel.find(req.query);
    let data = await query;

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
    const newAddress = await ClientsModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newAddress,
    });

    // console.log(req.body, req.query);
    // const newEntry = await new ClientsModel(req.body);
    // await newEntry.save(newEntry, () => {
    //   res.redirect('/');
    // });
  } catch (err) {
    console.log(res.ValidatorError);
    console.log(err);
  }
};

//edit client
const updateClient = async (req, res) => {
  try {
    console.log(req.body);
    const updateAddress = await ClientsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        updateAddress,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//delete client
const deleteClient = async (req, res) => {
  try {
    await ClientsModel.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  displayClients,
  searchClients,
  addClient,
  updateClient,
  deleteClient,
};
