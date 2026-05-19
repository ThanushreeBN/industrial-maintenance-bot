const express = require('express');
const {
  getSafetyProcedures,
  addSafetyProcedure
} = require('../controllers/safetyController');

const router = express.Router();

router
  .route('/')
  .get(getSafetyProcedures)
  .post(addSafetyProcedure);

module.exports = router;