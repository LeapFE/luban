"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
exports.createSchema = function (callback) {
    return callback(joi_1.default);
};
exports.validate = async function (value, schema, options, callback) {
    try {
        await schema.validateAsync(value, options);
    }
    catch (error) {
        if (typeof callback === "function") {
            callback(error.message);
        }
        process.exit(1);
    }
};
exports.validateSync = function (value, schema) {
    const result = schema.validate(value);
    if (result.error) {
        throw result.error;
    }
};
