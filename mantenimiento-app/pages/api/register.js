import ExcelJS from 'exceljs';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { area, machine, description } = req.body;

    const filePath = path.join(process.cwd(), 'data', 'records.xlsx');

    try {
      const fileBuffer = await fs.readFile(filePath);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);
      const sheet = workbook.getWorksheet(1);

      const newRow = sheet.addRow([new Date().toISOString(), area, machine, description]);
      newRow.commit();

      const buffer = await workbook.xlsx.writeBuffer();
      await fs.writeFile(filePath, buffer);

      res.status(200).json({ message: 'Record added successfully' });
    } catch (error) {
      console.error('Error accessing file:', error);
      res.status(500).json({ message: 'Error accessing the file', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

