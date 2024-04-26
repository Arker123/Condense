import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./Chatbot.css";
import getConfig from "./config.js";
import MessageParser from "./MessageParser.js";
import ActionProvider from "./ActionProvider.js";
import React, { useState, useEffect, useRef } from "react";
import { TbMessageChatbot } from "react-icons/tb";
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
    <div className="chatbotStyle mb-5 rounded-3xl mr-3 ">
      {showBot ? (
        <div ref={chatbotRef}>
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
          className="collapsed h-[50px] text-[18px] text-slate-50 flex items-center justify-center rounded-3xl"
          style={{
            padding: "5px",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            width: "275px", 
          }}
        >
          <button onClick={onClickOpenBot}>
            {/* &nbsp;&nbsp;Conversation with ClarifyBot  */}
            Conversation with ClarifyBot 
            {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- */}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyChatBot;
