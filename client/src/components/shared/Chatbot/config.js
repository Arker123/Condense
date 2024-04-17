import { createChatBotMessage } from "react-chatbot-kit";

const getConfig = (onClickClose, videoID) => {
  const botName = "ClarifyBot";
  const config = {
    botName: botName,
    customComponents: {
      header: () => (
        <div className="bg-slate-300"
          style={{
            padding: "5px",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
          }}
        >
         <button onClick={onClickClose}> &nbsp;&nbsp;Conversation with ClarifyBot &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X</button>
        </div>
      ),
    },
    initialMessages: [
      createChatBotMessage(`Hi! I'm ${botName}`),
      createChatBotMessage(`Ask me anything about your video/audio ${videoID}.`, {
        delay: 1000,
      }),
    ],
    state: {
      videoId: videoID,
    },
  };
  return config;
};

export default getConfig;
