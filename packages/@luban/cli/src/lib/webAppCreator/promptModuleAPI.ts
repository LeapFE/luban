import { DistinctQuestion } from "inquirer";

import { Creator } from ".";

import { PromptCompleteCallback, FinalAnswers } from "../../definitions";

class PromptModuleAPI {
  private creator: Creator;

  constructor(creator: Creator) {
    this.creator = creator;
  }

  public injectPrompt(prompt: DistinctQuestion<FinalAnswers>): void {
    this.creator.injectedPrompts.push(prompt);
  }

  public onPromptComplete(callback: PromptCompleteCallback<FinalAnswers>): void {
    this.creator.promptCompletedCallbacks.push(callback);
  }
}

export { PromptModuleAPI };
