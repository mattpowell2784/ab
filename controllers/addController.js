const ClientsModel = require('../models/clients');

//get all clients
getAllCleints = async (req, res) => {
  let query = ClientsModel.find();

  //execute query
  let data = await query;
  res.status(200).json({
    status: 'success',
    results: data.length,
    data: { data },
  });
};

//---------------------------------------------------------------------

//display clients
displayClients = async (req, res) => {
  try {
    //build query
    const queryObj = { ...req.query };
    const exlcudedFields = ['page', 'sort', 'limit', 'fields'];
    exlcudedFields.forEach(el => delete queryObj[el]);
    console.log(exlcudedFields);
    console.log(queryObj);

    //advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = ClientsModel.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    //limiting (limits fields returned)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }

    //pagination page/limit(number of results)
    const page = req.query.page * 1 || 1;
    console.log('page', page);
    const limit = req.query.limit * 1 || 8; //multiply by 1 to convert string to number
    console.log('limit', limit);
    let skip;
    if (page === 1) {
      skip = 0;
    } else {
      skip = (page - 1) * limit;
    }
    console.log('skip', skip);

    query = query.skip(skip).limit(limit);

    //execute query
    let data = await query;
    res.status(200).json({
      status: 'success',
      results: data.length,
      page: page,
      sort: req.query.sort,
      data: { data },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

//search clients
const searchClients = async (req, res) => {
  try {
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
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

//add cleint
const addClient = async (req, res) => {
  try {
    const newAddress = await ClientsModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newAddress,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

//edit client
const updateClient = async (req, res) => {
  try {
    console.log(req.body);
    const updateAddress = await ClientsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        updateAddress,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

//delete client
const deleteClient = async (req, res) => {
  try {
    await ClientsModel.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//---------------------------------------------------------------------

module.exports = {
  getAllCleints,
  displayClients,
  searchClients,
  addClient,
  updateClient,
  deleteClient,
};
