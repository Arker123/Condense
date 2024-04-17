import React from "react";
import axios from 'axios';
// const res = axios.post('/chatbot/generate',{
//   summary:"",
//   question:""
// })

// const response = res.data.response;

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    // this.state gives an array of all messages + videoID. Add logic here!
    console.log("Summary", this.state.summary.summary);
    console.log("Question", message);
    // Fetch the reply of the message here!
    const res = axios.post('/chatbot/generate',{
        summary:this.state.summary.summary,
        question:message
      })
    if (res.ok)
    { 
      const reply = res.data.response;
      this.actionProvider.messageHandler(reply);
    }
    else{
      const reply = res.data.response;
      const reply2 = "Sorry! I am unable to answer your query at the moment!"
      this.actionProvider.messageHandler(reply);
    }
  }
}

export default MessageParser;
