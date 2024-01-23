const csv = require('csv-parser')
const fs = require('fs')
const uploadModel = require('../models/Upload');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const stream = require('stream');
const cryptoJS = require("crypto-js");

function validateUserData(data) {
  return data.map((entry) => {
    const requiredFields = ['email', 'name', 'phoneNumber', 'DOB', 'address', 'Department', 'Majors', 'role'];
    for (const field of requiredFields) {
      if (!entry[field]) {
        throw new Error(`Field '${field}' is required for each entry`);
      }
    }
    return entry;
  });
}

function processUserData(data) {
  return data.map((entry) => {
    entry = convertKeysToLowercase(entry);
    entry.email = entry.email.toLowerCase();
    entry.role = convertRoleToNumber(entry.role);

    const cleanedName = entry.name.replace(/\s/g, '');
    entry.password = `${cleanedName}_${entry.phonenumber}`;
    return entry;
  });
}

function convertKeysToLowercase(obj) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key.toLowerCase()] = obj[key];
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

function convertRoleToNumber(role) {
  switch (role.toLowerCase()) {
    case 'student':
      return 0;
    case 'teacher':
      return 1;
    case 'admin':
      return 2;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
}

const createUser = async (userData) => {
  try {
    const {
      email,
      password,
      name,
      phonenumber,
      dob,
      address,
      department,
      majors,
      role
    } = userData;
    if (!email || !password || !name) {
      throw new Error("Vui lòng cung cấp email, password và tên");
    }

    let existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = new User({
      email,
      password: hashedPassword,
      name,
      phonenumber,
      DOB: new Date(dob),
      address,
      department,
      majors,
      role,
      date_created: new Date()
    });

    await newUser.save();

    return {
      status: true,
      message: "Đăng ký thành công",
      data: userData,
      user: newUser
    };
  } catch (error) {
    throw error;
  }
};
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

      const processedDataPromise = new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv({}))
          .on('data', (data) => {
            let email = Object.keys(data)[0];
            data.email = data[email];
            delete data[email];
            result.push(data);
          }) 
          .on('end', () => {
            resolve(result);
          })
          .on('error', (error) => {
            reject(error);
          });
      });

      try {
        const validatedData = validateUserData(await processedDataPromise);
        const processedData = processUserData(validatedData);
        for (const entry of processedData) {
          console.log(entry)
          await createUser(entry);
        }
        res.status(200).json({ status: 0, data: processedData });
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new UploadController();