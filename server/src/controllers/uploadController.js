import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import Item from '../models/Item.js';
import Agent from '../models/Agent.js';

export const uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  let items = [];
  try {
    if (req.file.mimetype === 'text/csv') {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', row => items.push(row))
        .on('end', async () => {
          await distributeTasks(items, res);
          fs.unlinkSync(req.file.path);
        });
    } else {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      items = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await distributeTasks(items, res);
      fs.unlinkSync(req.file.path);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

const distributeTasks = async (items, res) => {
  const agents = await Agent.find();
  if (agents.length === 0) return res.status(400).json({ msg: 'No agents found' });

  const requiredColumns = ['FirstName','Phone','Notes'];
  for (let col of requiredColumns) {
    if (!items[0][col]) return res.status(400).json({ msg: `Missing column: ${col}` });
  }

  // Clear previous items
  await Item.deleteMany({});

  // Distribute items
  const agentsWithItems = agents.map(a => ({ agent: a, items: [] }));

  for (let i = 0; i < items.length; i++) {
    const idx = i % agentsWithItems.length;
    const agentObj = agentsWithItems[idx];

    const task = new Item({
      firstName: items[i].FirstName,
      phone: items[i].Phone,
      notes: items[i].Notes,
      agent: agentObj.agent._id
    });
    await task.save();

    agentObj.items.push(task);
  }

  res.json({
    msg: 'Uploaded and distributed successfully',
    total: items.length,
    agents: agentsWithItems
  });
};
