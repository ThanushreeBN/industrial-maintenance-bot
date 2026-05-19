const { v4: uuidv4 } = require('uuid');

let maintenanceList = [
  { id: '1', equipmentName: 'Boiler System', maintenanceType: 'Pressure Valve Inspection', date: new Date('2023-10-24'), technicianName: 'John Doe', status: 'Pending' },
  { id: '2', equipmentName: 'CNC Machine 3', maintenanceType: 'Lubrication and Calibration', date: new Date('2023-10-25'), technicianName: 'Jane Smith', status: 'Scheduled' },
  { id: '3', equipmentName: 'Conveyor Belt A', maintenanceType: 'Motor Replacement', date: new Date('2023-10-28'), technicianName: 'Mike Johnson', status: 'Scheduled' }
];

exports.getMaintenance = (req, res) => {
  res.status(200).json({ success: true, data: maintenanceList });
};

exports.createMaintenance = (req, res) => {
  const newTask = {
    id: uuidv4(),
    ...req.body
  };
  maintenanceList.push(newTask);
  res.status(201).json({ success: true, data: newTask });
};

exports.updateMaintenance = (req, res) => {
  const index = maintenanceList.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Maintenance task not found' });
  }
  maintenanceList[index] = { ...maintenanceList[index], ...req.body };
  res.status(200).json({ success: true, data: maintenanceList[index] });
};

exports.deleteMaintenance = (req, res) => {
  const index = maintenanceList.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Maintenance task not found' });
  }
  maintenanceList.splice(index, 1);
  res.status(200).json({ success: true, data: {} });
};