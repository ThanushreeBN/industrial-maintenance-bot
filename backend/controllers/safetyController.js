const { v4: uuidv4 } = require('uuid');

let safetyProcedures = [
  { id: '1', title: 'Boiler Operation', guidelines: 'Always wear protective gear. Check pressure valves daily before startup.' },
  { id: '2', title: 'CNC Machine Use', guidelines: 'Ensure safety guards are in place. Never bypass interlocking mechanisms.' }
];

exports.getSafetyProcedures = (req, res) => {
  res.status(200).json({ success: true, data: safetyProcedures });
};

exports.addSafetyProcedure = (req, res) => {
  const newSafety = {
    id: uuidv4(),
    ...req.body
  };
  safetyProcedures.push(newSafety);
  res.status(201).json({ success: true, data: newSafety });
};