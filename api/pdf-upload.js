// api/pdf-upload.js
const pdfParse = require('pdf-parse');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the file.' });
        return;
      }

      const file = files.file[0];
      try {
        const fileBuffer = fs.readFileSync(file.filepath);
        const data = await pdfParse(fileBuffer);

        res.status(200).json({
          text: data.text,
          info: data.info,
          numpages: data.numpages,
        });
      } catch (error) {
        res.status(500).json({ error: 'Error processing PDF.' });
      } finally {
        fs.unlinkSync(file.filepath);
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
