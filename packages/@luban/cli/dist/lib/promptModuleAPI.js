"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromptModuleAPI {
    constructor(creator) {
        this.creator = creator;
    }
    injectFeature(feature) {
        this.creator.featurePrompt.choices.push(feature);
    }
    injectPrompt(prompt) {
        this.creator.injectedPrompts.push(prompt);
    }
    injectOptionForPrompt(name, option) {
        const targetPrompt = this.creator.injectedPrompts.find((p) => {
            return p.name === name;
        });
        if (!targetPrompt) {
            return;
        }
        targetPrompt.choices.push(option);
    }
    onPromptComplete(callback) {
        this.creator.promptCompletedCallbacks.push(callback);
    }
}
exports.PromptModuleAPI = PromptModuleAPI;
//# sourceMappingURL=promptModuleAPI.js.map