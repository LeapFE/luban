import JOI from "@hapi/joi";
export declare const createSchema: (callback: (joi: JOI.Root) => JOI.ObjectSchema<any>) => JOI.ObjectSchema<any>;
export declare const validate: (value: Record<any, any>, schema: JOI.ObjectSchema<any>, options: JOI.AsyncValidationOptions, callback?: ((msg: string) => void) | undefined) => Promise<void>;
export declare const validateSync: (value: Record<any, any>, schema: JOI.ObjectSchema<any>) => void;
