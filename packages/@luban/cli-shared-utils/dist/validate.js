"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
exports.createSchema = function (callback) {
    return callback(joi_1.default);
};
exports.validate = function (value, schema, options, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(value, options);
        }
        catch (error) {
            if (typeof callback === "function") {
                callback(error.message);
            }
            process.exit(1);
        }
    });
};
exports.validateSync = function (value, schema) {
    const result = schema.validate(value);
    if (result.error) {
        throw result.error;
    }
};
