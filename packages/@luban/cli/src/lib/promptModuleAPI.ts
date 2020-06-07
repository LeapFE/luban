import { DistinctQuestion } from "inquirer";

import { Creator } from "./creator";

import { PromptCompleteCallback } from "../definitions";

class PromptModuleAPI {
  private creator: Creator;

  constructor(creator: Creator) {
    this.creator = creator;
  }

  public injectPrompt(prompt: DistinctQuestion): void {
    this.creator.injectedPrompts.push(prompt);
  }

  public onPromptComplete(callback: PromptCompleteCallback): void {
    this.creator.promptCompletedCallbacks.push(callback);
  }
}

export { PromptModuleAPI };
