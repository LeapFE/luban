import { Creator } from "./creator";
import { ChoiceOptions, DistinctQuestion } from "inquirer";
import { PromptCompleteCallback } from "../definitions";
declare type ExtraChoiceOptions = Partial<{
  description: string;
  plugins: string[];
  link: string;
  checked: boolean;
}>;
declare class PromptModuleAPI {
  private creator;
  constructor(creator: Creator);
  protected injectFeature(feature: ChoiceOptions & ExtraChoiceOptions): void;
  injectPrompt(prompt: DistinctQuestion): void;
  injectOptionForPrompt(name: string, option: ChoiceOptions): void;
  onPromptComplete(callback: PromptCompleteCallback): void;
}
export { PromptModuleAPI };
