import React from "react";
import axios from 'axios';
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    // this.state gives an array of all messages + videoID. Add logic here!
    console.log(this.state);
    console.log(message);
    //Fetch the reply of the message here!
    const reply = "This is the bot's reply."
    this.actionProvider.messageHandler(reply);
  }
}

export default MessageParser;
