import ExcelJS from 'exceljs';
import path from 'path';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { area, machine, description, requester } = req.body;

    console.log('Received data:', { area, machine, description, requester });

    if (!area || !machine || !description || !requester) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    try {
      // Leer y actualizar el archivo Excel
      const filePath = path.join(process.cwd(), 'data', 'records.xlsx');
      const fileBuffer = await fs.readFile(filePath);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);
      const sheet = workbook.getWorksheet(1);

      // Formatear la fecha al horario de Colombia
      const now = new Date();
      const options = {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('es-CO', options);
      const formattedDate = formatter.format(now);

      // Generar ID automático basado en la cantidad de filas
      const id = sheet.rowCount + 1;

      const newRow = sheet.addRow([id, formattedDate, area, machine, description, requester]);
      newRow.commit();

      const buffer = await workbook.xlsx.writeBuffer();
      await fs.writeFile(filePath, buffer);

      console.log('Excel updated successfully');

      // Configurar nodemailer
      const transporter = nodemailer.createTransport({
        service: 'zoho',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'mantenimiento@intercalco.com',
        subject: 'Nueva solicitud de mantenimiento',
        text: `Se ha recibido una nueva solicitud de mantenimiento:
               \nID: ${id}
               \nFecha: ${formattedDate}
               \nÁrea: ${area}
               \nEquipo: ${machine}
               \nDescripción: ${description}
               \nSolicitante: ${requester}`,
      };

      console.log('Sending email with nodemailer');

      await transporter.sendMail(mailOptions);

      console.log('Email sent successfully');

      res.status(200).json({ message: 'Registro agregado y correo electrónico enviado exitosamente' });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'Error occurred', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
