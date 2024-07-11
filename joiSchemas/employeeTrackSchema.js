const Joi = require("joi");

const employeeTrackProjectSchema = Joi.object({
  projectId: Joi.string().required(),
  employeeId: Joi.string().required(),
  joined: Joi.date().required(),
  exit: Joi.date().allow(null).optional(),
});

module.exports = {
  employeeTrackProjectSchema,
};
