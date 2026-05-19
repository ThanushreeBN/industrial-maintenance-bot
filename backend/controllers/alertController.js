const { v4: uuidv4 } = require('uuid');

let alertsList = [
  { id: '1', title: 'High Temperature', description: 'Boiler System B - Exceeds safe limit', severity: 'Critical', date: new Date(), status: 'Active' },
  { id: '2', title: 'Low Oil Level', description: 'Generator 2 - Requires refill', severity: 'Medium', date: new Date(), status: 'Active' },
  { id: '3', title: 'Motor Vibration', description: 'Conveyor Belt A - Unusual vibration detected', severity: 'Medium', date: new Date(), status: 'Active' }
];

exports.getAlerts = (req, res) => {
  res.status(200).json({ success: true, data: alertsList });
};

exports.createAlert = (req, res) => {
  const newAlert = {
    id: uuidv4(),
    date: new Date(),
    status: 'Active',
    ...req.body
  };
  alertsList.push(newAlert);
  res.status(201).json({ success: true, data: newAlert });
};

exports.updateAlert = (req, res) => {
  const index = alertsList.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Alert not found' });
  }
  alertsList[index] = { ...alertsList[index], ...req.body };
  res.status(200).json({ success: true, data: alertsList[index] });
};