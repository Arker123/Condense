import { createChatBotMessage } from "react-chatbot-kit";

const getConfig = (onClickClose, summary) => {
  const botName = "ClarifyBot";
  const config = {
    botName: botName,
    customComponents: {
      header: () => (
        <div className=" rounded-xl bg-[#1f4e81] text-slate-50"
          style={{
            padding: "5px",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
          }}
        >
         <button onClick={onClickClose} className="flex flex-row ml-3 gap-6"> <p className="mt-1">Conversation with ClarifyBot</p> <p className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#456c96] ">X</p></button>
        </div>
      ),
    },
    initialMessages: [
      createChatBotMessage(`Hi! I'm ${botName}`),
      createChatBotMessage(`Ask me anything about your video/audio.`, {
        delay: 1000,
      }),
    ],
    state: {
      summary: summary,
    },
  };
  return config;
};

export default getConfig;
