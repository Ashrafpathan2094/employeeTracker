const Joi = require("joi");

const employeeAddSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  departmentId: Joi.string().required(),
  age: Joi.number().min(1).max(100).required(),
  onBoardDate: Joi.date(),
});

module.exports = {
  employeeAddSchema,
};
