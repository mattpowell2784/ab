const express = require('express');
const addController = require('../controllers/addController');
const authController = require('../controllers/authController');

const router = express.Router();

//address routes
router.get('/all-clients', authController.protect, addController.getAllCleints);

router.get(
  '/get-clients',
  authController.protect,
  addController.displayClients
);

router.get(
  '/search-clients',
  authController.protect,
  addController.searchClients
);

router.post('/add-client', authController.protect, addController.addClient);

router.patch('/patch/:id', authController.protect, addController.updateClient);

router.delete(
  '/delete/:id',
  authController.protect,
  addController.deleteClient
);

module.exports = router;
