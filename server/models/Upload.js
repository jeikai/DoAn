// models/fileModel.js
const { Storage } = require('@google-cloud/storage');
const projectId = process.env.PROJECT_ID;
const keyFilename = 'lights-404908-1e4e060a4264.json';
const bucketName = 'graduationkt'

// Create a new Storage object with the specified project ID and key file
const storage = new Storage({ projectId, keyFilename });

class UploadModel {
  async uploadFile(file, projectId) {
    console.log(file)
    const bucket = storage.bucket(bucketName);
    const fileName = `${projectId}_${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => {
      throw new Error(err);
    });

    stream.on('finish', () => {
      // File uploaded successfully.
    });

    stream.end(file.buffer);

    return {
      fileName,
      fileUrl: `https://storage.googleapis.com/${bucketName}/${fileName}`,
    };
  }

  async getFilesByProjectId(projectId) {
    const bucket = storage.bucket(bucketName);

    const [files] = await bucket.getFiles();
    const fileList = files
      .filter(file => {
        const regex = new RegExp(`^${projectId}_[0-9]+_`);
        return regex.test(file.name);
      })
      .map(file => ({
        fileName: file.name,
        fileUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`,
      }));

    return fileList;
  }

  async deleteFilesByProjectId(projectId) {
    const bucket = storage.bucket(bucketName);

    const [files] = await bucket.getFiles();
    const filesToDelete = files
      .filter(file => {
        const regex = new RegExp(`^${projectId}_[0-9]+_`);
        return regex.test(file.name);
      })
      .map(file => file.name);

    const check = await Promise.all(filesToDelete.map(async fileName => {
      try {
        await bucket.file(fileName).delete();
        return {
          msg: 'Delete sucessful'
        }
      } catch (error) {
        return error
      }
    }));
    return check
  }
}

module.exports = new UploadModel();
