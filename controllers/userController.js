const UsersModel = require('../models/usersModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports ={ getAllUsers };
