const express = require('express');
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');

const router = express.Router();

router
  .route('/')
  .get(getEquipment)
  .post(createEquipment);

router
  .route('/:id')
  .get(getEquipmentById)
  .put(updateEquipment)
  .delete(deleteEquipment);

module.exports = router;