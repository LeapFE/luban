import { DistinctQuestion } from "inquirer";

import { LibCreator } from "./index";

import { CreateLibPromptCompleteCallback, CreateLibFinalAnswers } from "../../definitions";

class LibPromptModuleAPI {
  private creator: LibCreator;

  constructor(creator: LibCreator) {
    this.creator = creator;
  }

  public injectPrompt(prompt: DistinctQuestion<CreateLibFinalAnswers>): void {
    this.creator.injectedPrompts.push(prompt);
  }

  public onPromptComplete(callback: CreateLibPromptCompleteCallback): void {
    this.creator.promptCompletedCallbacks.push(callback);
  }
}

export { LibPromptModuleAPI };
