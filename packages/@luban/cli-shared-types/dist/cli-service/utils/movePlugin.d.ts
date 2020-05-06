import { Compiler } from "webpack";
declare class MovePlugin {
    private from;
    private to;
    constructor(from: string, to: string);
    apply(compiler: Compiler): void;
}
export { MovePlugin };
