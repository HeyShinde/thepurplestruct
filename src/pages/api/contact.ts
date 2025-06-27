import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import formidable, { Fields, Files, File as FormidableFile } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY || 'RESEND_API_KEY');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const { name, email, message } = fields;
    let attachments: { filename: string; content: Buffer }[] = [];

    if (files && files.file) {
      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      attachments = fileArray.map((file: FormidableFile) => {
        const fileData = fs.readFileSync(file.filepath);
        return {
          filename: file.originalFilename || 'attachment',
          content: fileData,
        };
      });
    }

    try {
      await resend.emails.send({
        from: 'Contact Form <contactmodal@heyshinde.com>',
        to: 'hello@heyshinde.com', // <-- change to your email
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        attachments,
      });
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: 'Failed to send email' });
    }
  });
} 