const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load models
const Equipment = require('./models/Equipment');
const Maintenance = require('./models/Maintenance');
const Alert = require('./models/Alert');
const Chat = require('./models/Chat');
const Safety = require('./models/Safety');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const sampleEquipment = [
  { name: 'CNC Machine', type: 'Manufacturing', status: 'Operational', healthStatus: 'Good' },
  { name: 'Conveyor Belt A', type: 'Transport', status: 'Needs Attention', healthStatus: 'Warning' },
  { name: 'Air Compressor', type: 'Utility', status: 'Operational', healthStatus: 'Good' },
  { name: 'Boiler System B', type: 'Utility', status: 'Down / Alert', healthStatus: 'Critical', temperature: 105 },
  { name: 'Generator 2', type: 'Power', status: 'Operational', healthStatus: 'Warning' }
];

const sampleMaintenance = [
  { equipmentName: 'Boiler System', maintenanceType: 'Pressure Valve Inspection', date: new Date('2023-10-24'), technicianName: 'John Doe', status: 'Pending' },
  { equipmentName: 'CNC Machine 3', maintenanceType: 'Lubrication and Calibration', date: new Date('2023-10-25'), technicianName: 'Jane Smith', status: 'Scheduled' },
  { equipmentName: 'Conveyor Belt A', maintenanceType: 'Motor Replacement', date: new Date('2023-10-28'), technicianName: 'Mike Johnson', status: 'Scheduled' }
];

const sampleAlerts = [
  { title: 'High Temperature', description: 'Boiler System B - Exceeds safe limit', severity: 'Critical', status: 'Active' },
  { title: 'Low Oil Level', description: 'Generator 2 - Requires refill', severity: 'Medium', status: 'Active' },
  { title: 'Motor Vibration', description: 'Conveyor Belt A - Unusual vibration detected', severity: 'Medium', status: 'Active' }
];

const sampleSafety = [
  { title: 'Boiler Operation', guidelines: 'Always wear protective gear. Check pressure valves daily before startup.' },
  { title: 'CNC Machine Use', guidelines: 'Ensure safety guards are in place. Never bypass interlocking mechanisms.' }
];

const importData = async () => {
  try {
    await Equipment.deleteMany();
    await Maintenance.deleteMany();
    await Alert.deleteMany();
    await Chat.deleteMany();
    await Safety.deleteMany();

    await Equipment.insertMany(sampleEquipment);
    await Maintenance.insertMany(sampleMaintenance);
    await Alert.insertMany(sampleAlerts);
    await Safety.insertMany(sampleSafety);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Equipment.deleteMany();
    await Maintenance.deleteMany();
    await Alert.deleteMany();
    await Chat.deleteMany();
    await Safety.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}