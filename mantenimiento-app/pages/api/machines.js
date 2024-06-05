import ExcelJS from 'exceljs';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'machines.xlsx');
  const fileBuffer = await fs.readFile(filePath);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);
  const sheet = workbook.getWorksheet(1);
  
  const machines = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Assuming first row is header
      machines.push({
        area: row.getCell(1).value,
        machine: row.getCell(2).value,
      });
    }
  });

  res.status(200).json({ machines });
}
