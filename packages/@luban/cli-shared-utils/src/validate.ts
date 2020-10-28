import JOI, { ObjectSchema, AsyncValidationOptions } from "@hapi/joi";

export const createSchema = function(callback: (joi: typeof JOI) => ObjectSchema): ObjectSchema {
  return callback(JOI);
};

export const validate = async function(
  value: unknown,
  schema: ObjectSchema,
  options: AsyncValidationOptions,
  callback?: (msg: string) => void,
): Promise<void> {
  try {
    await schema.validateAsync(value, options);
  } catch (error) {
    if (typeof callback === "function") {
      callback(error.message);
    }

    process.exit(1);
  }
};

export const validateSync = function(value: unknown, schema: ObjectSchema): void {
  const result = schema.validate(value);
  if (result.error) {
    throw result.error;
  }
};
