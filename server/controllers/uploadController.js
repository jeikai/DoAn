const csv = require('csv-parser')
const fs = require('fs')
const uploadModel = require('../models/Upload');
const stream = require('stream');

class UploadController {
  async uploadFile(req, res) {
    try {
      const projectId = req.params.projectId
      const file = req.file;
      const result = await uploadModel.uploadFile(file, projectId);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getFilesByProjectId(req, res) {
    try {
      const projectId = req.params.projectId;
      const fileList = await uploadModel.getFilesByProjectId(projectId);
      res.status(200).json(fileList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteFilesByProjectId(req, res) {
    try {
      const projectId = req.params.projectId;
      const result = await uploadModel.deleteFilesByProjectId(projectId)
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async uploadUser(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = [];
      const fileBuffer = req.file.buffer;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);
      bufferStream.pipe(csv({}))
        .on('data', (data) => result.push(data))
        .on('end', () => {
          console.log(result);
          res.status(200).json({ message: 'File uploaded successfully', data: result });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new UploadController();
