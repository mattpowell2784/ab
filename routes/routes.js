const express = require('express');
const addController = require('../controllers/addController');

const router = express.Router();

router.get('/all-clients', addController.displayClients);

router.post('/add-client', addController.addClient);

router.post('/patch/:id', addController.editClient);

router.delete('/delete/:id', addController.deleteClient);

module.exports = router;
