import React from "react";
class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  setChatBotMessage = (message) => {
    this.setState(state => ({ ...state, messages: [...state.messages, message]}))
  }

  messageHandler = (replyMessage) => {
    const message = this.createChatBotMessage(replyMessage);
    this.setChatBotMessage(message);
  }
}

export default ActionProvider;
