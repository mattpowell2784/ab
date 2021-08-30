const express = require('express');
const addController = require('../controllers/addController');

const router = express.Router();

router.get('/all-clients', addController.getAllCleints);

router.get('/get-clients', addController.displayClients);

router.get('/search-clients', addController.searchClients);

router.post('/add-client', addController.addClient);

router.patch('/patch/:id', addController.updateClient);

router.delete('/delete/:id', addController.deleteClient);

module.exports = router;
