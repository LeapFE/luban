import { CheckboxQuestion, ChoiceOptions, DistinctQuestion } from "inquirer";

import { Creator } from "./creator";

import { PromptCompleteCallback } from "../definitions";

type ExtraChoiceOptions = Partial<{
  description: string;
  plugins: string[];
  link: string;
  checked: boolean;
}>;

class PromptModuleAPI {
  private creator: Creator;

  constructor(creator: Creator) {
    this.creator = creator;
  }

  /**
   * @deprecated
   */
  protected injectFeature(feature: ChoiceOptions & ExtraChoiceOptions): void {
    // TYPE CHECK
    ((this.creator.featurePrompt.choices as any) as Array<any>).push(feature);
  }

  public injectPrompt(prompt: DistinctQuestion): void {
    this.creator.injectedPrompts.push(prompt);
  }

  public injectOptionForPrompt(name: string, option: ChoiceOptions): void {
    const targetPrompt = this.creator.injectedPrompts.find((p: DistinctQuestion) => {
      return p.name === name;
    });
    if (!targetPrompt) {
      return;
    }

    // TYPE CHECK
    ((targetPrompt as CheckboxQuestion).choices as Array<any>).push(option);
  }

  public onPromptComplete(callback: PromptCompleteCallback): void {
    this.creator.promptCompletedCallbacks.push(callback);
  }
}

export { PromptModuleAPI };
