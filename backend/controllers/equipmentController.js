const { v4: uuidv4 } = require('uuid');

let equipmentList = [
  { id: '1', name: 'CNC Machine', type: 'Manufacturing', status: 'Operational', healthStatus: 'Good', lastMaintenanceDate: new Date() },
  { id: '2', name: 'Conveyor Belt A', type: 'Transport', status: 'Needs Attention', healthStatus: 'Warning', lastMaintenanceDate: new Date() },
  { id: '3', name: 'Air Compressor', type: 'Utility', status: 'Operational', healthStatus: 'Good', lastMaintenanceDate: new Date() },
  { id: '4', name: 'Boiler System B', type: 'Utility', status: 'Down / Alert', healthStatus: 'Critical', temperature: 105, lastMaintenanceDate: new Date() },
  { id: '5', name: 'Generator 2', type: 'Power', status: 'Operational', healthStatus: 'Warning', lastMaintenanceDate: new Date() }
];

exports.getEquipment = (req, res) => {
  res.status(200).json({ success: true, data: equipmentList });
};

exports.getEquipmentById = (req, res) => {
  const equipment = equipmentList.find(e => e.id === req.params.id);
  if (!equipment) {
    return res.status(404).json({ success: false, error: 'Equipment not found' });
  }
  res.status(200).json({ success: true, data: equipment });
};

exports.createEquipment = (req, res) => {
  const newEquipment = {
    id: uuidv4(),
    ...req.body,
    lastMaintenanceDate: new Date()
  };
  equipmentList.push(newEquipment);
  res.status(201).json({ success: true, data: newEquipment });
};

exports.updateEquipment = (req, res) => {
  const index = equipmentList.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Equipment not found' });
  }
  equipmentList[index] = { ...equipmentList[index], ...req.body };
  res.status(200).json({ success: true, data: equipmentList[index] });
};

exports.deleteEquipment = (req, res) => {
  const index = equipmentList.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Equipment not found' });
  }
  equipmentList.splice(index, 1);
  res.status(200).json({ success: true, data: {} });
};