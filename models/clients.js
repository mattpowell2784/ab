const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// var Schema = new mongoose.Schema({
//   name: { type: String, required: true, maxLength: 20 },
// });

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is a required field'],
      maxLength: [200, ' Name field has a maximum of 200 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is a required field'],
      maxLength: [200, ' Address field has a maximum of 200 characters'],
    },
    postCode: {
      type: String,
      required: [true, 'Post Code is a required field'],
      maxLength: [10, ' Post Code field has a maximum of 10 characters'],
    },
    numOfMonth: {
      type: Number,
      //required: [false, 'Month is a required field'],
    },
  },
  { timestamps: true }
);

const ClientsModel = mongoose.model('ClientsModel', clientSchema);

module.exports = ClientsModel;
