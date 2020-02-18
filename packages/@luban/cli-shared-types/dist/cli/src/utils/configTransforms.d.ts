export declare const mergeArrayWithDedupe: (a: any, b: any) => any[];
export declare const transformTypes: {
    js: {
        read: ({ filename, context }: {
            filename: string;
            context: string;
        }) => any;
        write: ({ value, existing, source, }: {
            value: any;
            existing: any[];
            source: any;
        }) => string;
    };
    json: {
        read: ({ source }: {
            source: any;
        }) => any;
        write: ({ value, existing }: {
            value: any;
            existing: any[];
        }) => string;
    };
    yaml: {
        read: ({ source }: {
            source: any;
        }) => any;
        write: ({ value, existing }: {
            value: any;
            existing: any[];
        }) => string;
    };
    lines: {
        read: ({ source }: {
            source: string;
        }) => string[];
        write: ({ value, existing }: {
            value?: string[] | undefined;
            existing?: string[] | undefined;
        }) => string;
    };
};
