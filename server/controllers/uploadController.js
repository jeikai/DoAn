
const uploadModel = require('../models/Upload');

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
    try{
      const projectId = req.params.projectId;
      const result = await uploadModel.deleteFilesByProjectId(projectId)
      res.status(200).json(result);
    }catch (error) { 
      res.status(500).json(error);
  }
  }
}

module.exports = new UploadController();
