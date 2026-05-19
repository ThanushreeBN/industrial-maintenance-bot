const express = require('express');
const {
  getAlerts,
  createAlert,
  updateAlert
} = require('../controllers/alertController');

const router = express.Router();

router
  .route('/')
  .get(getAlerts)
  .post(createAlert);

router
  .route('/:id')
  .put(updateAlert);

module.exports = router;