import React from "react";
import axios from "axios";

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  async parse(message) {
    // this.state gives an array of all messages + videoID. Add logic here!
    console.log("Summary", this.state.summary.summary.replaceAll('"', "'"));
    console.log("Question", message);
    // Fetch the reply of the message here!
    const res = await axios.post("http://localhost:5000/chatbot/generate", {
      summary: this.state.summary.summary.replaceAll('"', "'"),
      question: message,
    });
    const reply2 = "Sorry! I am unable to answer your query at the moment!";
    if (res.ok) {
      let reply = res.data.response;
      if (reply === "") this.actionProvider.messageHandler(reply2);
      else this.actionProvider.messageHandler(reply);
    } else {
      const reply = res.data.response;
      if (reply === "") this.actionProvider.messageHandler(reply2);
      this.actionProvider.messageHandler(reply);
    }
  }
}

export default MessageParser;
