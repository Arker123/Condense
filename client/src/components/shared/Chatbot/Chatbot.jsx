import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./Chatbot.css";
import getConfig from "./config.js";
import MessageParser from "./MessageParser.js";
import ActionProvider from "./ActionProvider.js";
import React, { useState, useEffect, useRef } from "react";

const MyChatBot = (summary) => {
  const [showBot, toggleShow] = useState(false);
  const chatbotRef = useRef(null);

  function useClickOutsideChatBot(ref, onClickOutside) {
    useEffect(() => {
      if (!showBot) return;
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside();
        }
      }
      // Bind
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // dispose
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, onClickOutside]);
  }

  useClickOutsideChatBot(chatbotRef, () => {
    toggleShow(false);
  });

  const onClickCloseBot = () => {
    console.log("Close button clicked!");
    toggleShow(false);
  };

  const onClickOpenBot = () => {
    console.log("Open button clicked!");
    toggleShow(true);
  };

  const saveMessages = (messages, HTMLString) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem("chat_messages"));
    return messages;
  };

  return (
    <div className="chatbotStyle">
      {showBot ? (
        <div ref={chatbotRef} data-testid="chatbot-open">
          <Chatbot
            config={getConfig(onClickCloseBot, summary)}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            messageHistory={loadMessages()}
            saveMessages={saveMessages}
            runInitialMessagesWithHistory
          />
        </div>
      ) : (
        // Don't Show Bot
        <div
          className="collapsed"
          data-testid="chatbot-close"
          style={{
            padding: "5px",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            width: "275px", 
          }}
        >
          <button onClick={onClickOpenBot} data-testid="open-chatbot-button">
            &nbsp;&nbsp;Conversation with ClarifyBot
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-
          </button>
        </div>
      )}
    </div>
  );
};

export default MyChatBot;
