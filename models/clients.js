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
      maxLength: 1000,
    },
    address: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    postCode: {
      type: String,
      required: true,
      maxLength: 100,
    },
  },
  { timestamps: true }
);

const ClientsModel = mongoose.model('ClientsModel', clientSchema);


module.exports = ClientsModel;
