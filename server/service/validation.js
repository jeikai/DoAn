const Joi = require('joi');

exports.registerValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    DOB: Joi.string().required(),
    department: Joi.string().required(),
    majors: Joi.string().required(),
    msv: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().required()
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

exports.loginValidate = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};