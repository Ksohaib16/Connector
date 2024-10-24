const joi = require("joi");

module.exports.userSchema = joi.object({

        username: joi.string().min(3).max(255).required(),
        email:  joi.string().email().required(),
        password: joi.string().min(6).max(255).required(),

});

module.exports.loginSchema = joi.object({ 
        email: joi.string().min(3).max(255).required(),
        password: joi.string().min(6).max(255).required(),
});

