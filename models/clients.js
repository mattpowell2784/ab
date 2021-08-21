const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// var Schema = new mongoose.Schema({
//   name: { type: String, required: true, maxLength: 20 },
// });

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 75,
    },
    address: {
      type: String,
      required: true,
      maxLength: 75,
    },
    postCode: {
      type: String,
      required: true,
      maxLength: 10,
    },
  },
  { timestamps: true }
);

const ClientsModel = mongoose.model('ClientsModel', clientSchema);

module.exports = ClientsModel;
