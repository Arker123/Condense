const add_css = (css) =>
  (document.head.appendChild(document.createElement("style")).innerHTML = css);

function convertSeconds(sec) {
  const seconds = Math.floor(sec);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Add leading zero if necessary
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function add_element(tag, attr_tag, attr_name, value) {
  const element = document.createElement(tag);
  element.setAttribute(attr_tag, attr_name);
  element.innerHTML = value;

  return element;
}

let container;

async function main() {
  if (container) {
    console.log(container);
    container.remove();
  }
  // if (!window.location.href.match(/.*youtube.com\/watch\/.*/)) return;

  add_css(`
  #ext-container {
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 8px;
    height: 500px;
    width: 100%;
    background-color: #edf4fb;
  }

  #transcript{
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 440px;
  }
  #notes, #ai-chat, #summary{
    display: flex;
    flex-direction: column;
    display:none;
    height: 440px;
  }
  #summary{
    justify-content: center;
    align-items: center;
  }


  #t-body{
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .time-card{
    font-size: 14px;
    color: blue;
    padding: 14px;
    padding-left: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

  }

  .notes-time-card {
    font-size: 14px;
    color: blue;
    padding: 5px;
    padding: 10px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .text-card{
    font-size: 14px;
    padding: 15px;
    line-height: 1.7;
  }

  .notes-text-card {
    font-size: 14px;
    padding: 15px;
    line-height: 1.7;
    background-color: #ffffff;
    border-radius: 5px;
    margin:5px;
  }

  .card{
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .notes-card{
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom:10px;
  }

  .divider{
    border: 1px solid lightgray;
    opacity: 0.5;
  }
  .question-card{
    font-size:14px;
    min-height: 20px;
    padding: 5px;
    border-radius: 5px;
    background:rgb(169, 32, 30);
    color:white;
    margin-bottom: 10px;
    align-self: flex-end;
    width:70%;
  }
  .answer-card{
    font-size:14px;
    height: 20px;
    padding: 5px;
    border-radius: 5px;
    background:white;
    margin-bottom: 10px;
    align-self: flex-start;
    width:70%;
  }
  #t-button, #notes-button, #ai-chat-button, #summary-button, #save-button{
    background-color: transparent;
    color: rgb(169, 32, 30);
    border: none;
    outline: none;
    font-size: 12px;
    padding: 15px;    
    cursor: pointer;
  }

  #notes-entry-box, #ai-chat-entry-box{
    width: 100%;
    height: 60px;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 8px;
    box-sizing: border-box;
  }
  #notes-entry, #ai-chat-entry{
    margin-top:auto;
  }
  #notes-card-area, #ai-chat-card-area{
    widht:100%;
    height:370px;
    overflow-y: auto;
    display:flex;
    flex-direction: column;

  }

  #notes-entry-button, #ai-chat-entry-button {
    position:relative;
    width: 50px;
    left: 312px;
    top:-30px;
    background-color: rgb(169, 32, 30);
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }

  #summary-area, #ai-chat-area{
    background-color: white;
    width: 90%;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    height: 100%;
    padding: 15px;
    overflow-y: auto;
    border-radius: 5px;

  }
  
  #get-summary-button{
    background-color: blue;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }

  .my-component-right {
    display: flex;
    align-items: center;
    color: #828282;
    position: relative;
    flex-direction: row;
  }

  .icon-copy, .icon-edit, .icon-delete {
      font-size: 20px;
      margin-left: 12px;
      cursor: pointer;
  }

    .edit-text-area {
      width :100%;
      border-radius:5px;
    }
    #navbar{
      margin-bottom:5px;
    }

  #save-button{
    border-radius: 5px;
    background-color: rgba(152, 32, 30,0.9);
    margin: 10px;
    padding: 10px;
    position: relative;
    left: 20px;
    color: white;
    cursor: pointer
  }

  #save-button:hover{
    background-color: rgba(180, 32, 30,1);
    scale: 1.02;
  }
    
  }
  
  `);

  container = add_element("div", "id", "ext-container", "");

  const t_icon = add_element(
    "div",
    "id",
    "t-icon",
    `<svg data-v-57b574a0="" width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="nav-top" fill="none"><g data-v-57b574a0="" clip-path="url(#clip0_900_165)"><path data-v-57b574a0="" d="M152.914 0H47.0863C37.9618 0.0101648 29.2139 3.63956 22.7622 10.0918C16.3104 16.5441 12.6818 25.2923 12.6724 34.4168V165.583C12.6825 174.707 16.3115 183.455 22.763 189.907C29.2146 196.359 37.962 199.989 47.0862 200H152.914C162.038 199.989 170.786 196.359 177.237 189.907C183.689 183.455 187.318 174.707 187.328 165.583V34.4168C187.319 25.2923 183.69 16.5441 177.238 10.0918C170.786 3.63955 162.039 0.0101544 152.914 0ZM175.492 165.583C175.486 171.57 173.105 177.309 168.872 181.542C164.639 185.775 158.9 188.157 152.914 188.164H47.0863C41.1 188.157 35.3609 185.775 31.1282 181.542C26.8955 177.309 24.5148 171.57 24.5086 165.583V34.4168C24.5149 28.4305 26.8955 22.6911 31.1282 18.4579C35.3609 14.2246 41.1 11.8433 47.0863 11.8363H152.914C158.901 11.8433 164.64 14.2247 168.872 18.4579C173.105 22.6912 175.486 28.4306 175.492 34.4169L175.492 165.583Z" fill="rgba(33,36,39,0.8)"></path> <path data-v-57b574a0="" d="M146.126 129.936H55.9542C55.3713 129.936 54.7942 130.051 54.2556 130.274C53.7171 130.497 53.2278 130.824 52.8157 131.236C52.4035 131.648 52.0766 132.138 51.8535 132.676C51.6304 133.215 51.5156 133.792 51.5156 134.375C51.5156 134.958 51.6304 135.535 51.8535 136.073C52.0766 136.612 52.4035 137.101 52.8157 137.513C53.2278 137.925 53.7171 138.252 54.2556 138.475C54.7942 138.699 55.3713 138.813 55.9542 138.813H146.126C147.303 138.813 148.432 138.346 149.264 137.513C150.097 136.681 150.564 135.552 150.564 134.375C150.564 133.198 150.097 132.069 149.264 131.236C148.432 130.404 147.303 129.936 146.126 129.936ZM146.126 152.736H55.9542C55.3713 152.736 54.7942 152.851 54.2556 153.074C53.7171 153.297 53.2278 153.624 52.8157 154.036C52.4035 154.448 52.0766 154.937 51.8535 155.476C51.6304 156.014 51.5156 156.591 51.5156 157.174C51.5156 157.757 51.6304 158.334 51.8535 158.873C52.0766 159.411 52.4035 159.901 52.8157 160.313C53.2278 160.725 53.7171 161.052 54.2556 161.275C54.7942 161.498 55.3713 161.613 55.9542 161.613H146.126C147.303 161.613 148.432 161.145 149.264 160.313C150.097 159.481 150.564 158.352 150.564 157.174C150.564 155.997 150.097 154.868 149.264 154.036C148.432 153.203 147.303 152.736 146.126 152.736ZM146.126 36.6074H55.9542C54.777 36.6074 53.6481 37.0751 52.8157 37.9075C51.9833 38.7399 51.5156 39.8688 51.5156 41.046V63.8308C51.5156 65.008 51.9833 66.1369 52.8157 66.9693C53.6481 67.8017 54.777 68.2694 55.9542 68.2694H146.126C147.303 68.2694 148.432 67.8017 149.264 66.9693C150.097 66.1369 150.564 65.008 150.564 63.8308V41.046C150.564 39.8688 150.097 38.7399 149.264 37.9075C148.432 37.0751 147.303 36.6074 146.126 36.6074ZM141.687 59.407H60.3929V45.4994H141.687L141.687 59.407Z" fill="rgba(33,36,39,0.8)"></path></g> <defs data-v-57b574a0=""><clipPath data-v-57b574a0="" id="clip0_900_165"><rect data-v-57b574a0="" width="200" height="200" fill="white"></rect></clipPath></defs></svg>`
  );

  const notes_icon = add_element(
    "div",
    "id",
    "notes-icon",
    `<svg data-v-8ec02cea="" width="20" height="20" viewBox="0 0 200 200" fill="#101010" xmlns="http://www.w3.org/2000/svg" class="nav-top"><g data-v-8ec02cea="" clip-path="url(#clip0_900_152)"><path data-v-8ec02cea="" d="M192.492 65.698L176.126 49.3324C172.274 45.4802 166.3 45.1875 162.81 48.6778L75.7107 135.802C74.4204 137.09 73.4038 138.106 70.4265 158.462C70.1833 160.13 70.3008 161.83 70.7711 163.449C71.2414 165.067 72.0535 166.565 73.1526 167.843C74.2517 169.12 75.6121 170.147 77.142 170.854C78.6719 171.56 80.3357 171.93 82.0209 171.939C82.7044 171.939 83.3866 171.881 84.0603 171.766C103.778 168.379 104.832 167.334 106.031 166.126L193.146 79.0138C196.636 75.533 196.341 69.5533 192.492 65.698ZM99.8972 158.906C98.7579 159.284 94.8963 160.322 82.4648 162.456C82.1027 162.517 81.7312 162.492 81.3807 162.383C81.0301 162.273 80.7104 162.083 80.4475 161.826C80.1846 161.57 79.986 161.255 79.8679 160.907C79.7497 160.559 79.7154 160.189 79.7676 159.825C81.6307 147.107 82.6158 143.069 82.9683 141.886L169.108 55.7466C169.237 55.8164 169.356 55.9044 169.46 56.0078L185.826 72.3734C185.93 72.4772 186.018 72.596 186.087 72.7258L99.8972 158.906Z" fill="rgba(33,36,39,0.8)"></path> <path data-v-8ec02cea="" d="M164.447 121.329C163.62 121.329 162.802 121.492 162.038 121.808C161.275 122.124 160.581 122.588 159.996 123.173C159.412 123.757 158.948 124.451 158.632 125.215C158.315 125.978 158.153 126.797 158.153 127.623V165.51C158.153 177.586 147.21 187.411 133.762 187.411H41.3968C27.9487 187.411 17.0058 177.586 17.0058 165.51V34.4938C17.0059 22.4146 27.9488 12.5891 41.3968 12.5891H133.768C145.86 12.5891 156.245 20.7058 157.926 31.4724C158.047 32.2943 158.331 33.084 158.759 33.7959C159.187 34.5079 159.752 35.128 160.421 35.6205C161.09 36.113 161.85 36.4682 162.657 36.6656C163.465 36.8629 164.303 36.8986 165.124 36.7704C165.944 36.6422 166.732 36.3528 167.44 35.9189C168.149 35.4849 168.764 34.9149 169.252 34.2419C169.739 33.5689 170.088 32.806 170.279 31.9974C170.47 31.1888 170.498 30.3504 170.364 29.5306C169.086 21.3478 164.652 13.8322 157.879 8.38428C151.028 2.93164 142.524 -0.0253648 133.768 0.000163921H41.3968C21.006 0.000163921 4.41699 15.4751 4.41699 34.4938V165.51C4.41699 184.528 21.006 200 41.3969 200H133.768C154.159 200 170.748 184.528 170.748 165.51V127.623C170.748 126.796 170.585 125.977 170.268 125.213C169.951 124.449 169.487 123.755 168.902 123.17C168.317 122.586 167.622 122.122 166.858 121.806C166.093 121.49 165.274 121.328 164.447 121.329Z" fill="rgba(33,36,39,0.8)"></path> <path data-v-8ec02cea="" d="M96.2466 47.2969H44.4337C43.1817 47.2969 41.9809 47.7942 41.0956 48.6796C40.2103 49.5649 39.7129 50.7657 39.7129 52.0177C39.7129 53.2698 40.2103 54.4705 41.0956 55.3559C41.9809 56.2412 43.1817 56.7386 44.4337 56.7386H96.2464C97.4985 56.7386 98.6992 56.2412 99.5846 55.3559C100.47 54.4705 100.967 53.2698 100.967 52.0177C100.967 50.7657 100.47 49.5649 99.5846 48.6796C98.6992 47.7942 97.4987 47.2969 96.2466 47.2969ZM96.2466 71.1025H44.4337C43.1817 71.1025 41.9809 71.5999 41.0956 72.4852C40.2103 73.3706 39.7129 74.5713 39.7129 75.8234C39.7129 77.0754 40.2103 78.2762 41.0956 79.1615C41.9809 80.0468 43.1817 80.5442 44.4337 80.5442H96.2464C97.4985 80.5442 98.6992 80.0468 99.5846 79.1615C100.47 78.2762 100.967 77.0754 100.967 75.8234C100.967 74.5713 100.47 73.3706 99.5846 72.4852C98.6992 71.5999 97.4987 71.1025 96.2466 71.1025Z" fill="rgba(33,36,39,0.8)"></path></g> <defs data-v-8ec02cea=""><clipPath data-v-8ec02cea="" id="clip0_900_152"><rect data-v-8ec02cea="" width="200" height="200" fill="white"></rect></clipPath></defs></svg>`
  );

  const ai_chat_icon = add_element(
    "div",
    "id",
    "ai-chat-icon",
    `<svg data-v-57b574a0="" width="20" height="20" viewBox="0 0 213 178" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-top"><path data-v-57b574a0="" d="M23.5 7H132.5" stroke="rgba(33,36,39,0.8)" stroke-width="12" stroke-linecap="round"></path> <path data-v-57b574a0="" d="M132.5 6.9994C139 6.99881 146.6 9.0994 147 21.4994V36.5M55.5002 106L33.0002 129C29.3335 132.5 22.0002 136.6 22.0002 125C22.0002 113.4 22.0002 107.5 22.0002 106C17.0002 104.833 6.90016 100.3 6.50016 91.5C6.10016 82.7 6.33349 41.1663 6.50016 21.4994C6.54677 15.9994 10 6 27 6.9994" stroke="rgba(33,36,39,0.8)" stroke-width="12" stroke-linecap="round"></path> <path data-v-57b574a0="" d="M191.721 53H86.7209C74.721 53 69.2559 60 69.2209 64C69.0542 83 68.8209 123.7 69.2209 134.5C69.6209 145.3 81.0542 148.333 86.7209 148.5H160.221C165.388 154.333 177.221 166.8 183.221 170C189.221 173.2 191.388 168.667 191.721 166V142.5C202.521 142.5 205.888 134.167 206.221 130V64C206.221 55.6 196.554 53.1667 191.721 53Z" stroke="rgba(33,36,39,0.8)" stroke-width="12" stroke-linecap="round"></path></svg>`
  );

  const summary_icon = add_element(
    "div",
    "id",
    "summary-icon",
    `<svg
      data-v-38979994=""
      width="20"
      height="20"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="nav-top"
      fill="none"
    >
      <g data-v-38979994="" clip-path="url(#clip0_900_158)"><path data-v-38979994="" d="M168.577 0H31.4232C23.0921 0.00915044 15.1048 3.32274 9.21376 9.21376C3.32274 15.1048 0.00915044 23.0921 0 31.4232L0 168.577C0.00915044 176.908 3.32274 184.895 9.21376 190.786C15.1048 196.677 23.0921 199.991 31.4232 200H168.577C176.908 199.991 184.895 196.677 190.786 190.786C196.677 184.895 199.991 176.908 200 168.577V31.4232C199.991 23.0921 196.677 15.1048 190.786 9.21376C184.895 3.32274 176.908 0.00915044 168.577 0ZM187.431 168.577C187.425 173.575 185.437 178.368 181.902 181.902C178.368 185.437 173.575 187.425 168.577 187.431H31.4232C26.4246 187.425 21.6324 185.437 18.0979 181.902C14.5634 178.368 12.5751 173.575 12.5693 168.577V31.4232C12.5751 26.4246 14.5634 21.6324 18.0979 18.0979C21.6324 14.5634 26.4246 12.5751 31.4232 12.5693H168.577C173.575 12.5751 178.367 14.5634 181.902 18.0979C185.436 21.6324 187.425 26.4246 187.431 31.4232L187.431 168.577Z" fill="rgba(33,36,39,0.8)"></path> 
      <path data-v-38979994="" d="M151.746 94.5432H81.2672C80.0171 94.5432 78.8182 95.0398 77.9342 95.9237C77.0503 96.8077 76.5537 98.0066 76.5537 99.2567C76.5537 100.507 77.0503 101.706 77.9342 102.59C78.8182 103.474 80.0171 103.97 81.2672 103.97H151.746C152.997 103.97 154.195 103.474 155.079 102.59C155.963 101.706 156.46 100.507 156.46 99.2567C156.46 98.0066 155.963 96.8077 155.079 95.9237C154.195 95.0398 152.997 94.5432 151.746 94.5432ZM151.746 55.6191H81.2672C80.0171 55.6191 78.8182 56.1157 77.9342 56.9997C77.0503 57.8836 76.5537 59.0825 76.5537 60.3326C76.5537 61.5827 77.0503 62.7816 77.9342 63.6656C78.8182 64.5495 80.0171 65.0461 81.2672 65.0461H151.746C152.997 65.0461 154.195 64.5495 155.079 63.6656C155.963 62.7816 156.46 61.5827 156.46 60.3326C156.46 59.0825 155.963 57.8836 155.079 56.9997C154.195 56.1157 152.997 55.6191 151.746 55.6191ZM151.746 132.352H81.2672C80.0171 132.352 78.8182 132.848 77.9342 133.732C77.0503 134.616 76.5537 135.815 76.5537 137.065C76.5537 138.315 77.0503 139.514 77.9342 140.398C78.8182 141.282 80.0171 141.779 81.2672 141.779H151.746C152.997 141.779 154.195 141.282 155.079 140.398C155.963 139.514 156.46 138.315 156.46 137.065C156.46 135.815 155.963 134.616 155.079 133.732C154.195 132.848 152.997 132.352 151.746 132.352ZM47.4494 94.5432H46.2648C45.0147 94.5432 43.8158 95.0398 42.9318 95.9237C42.0479 96.8077 41.5513 98.0066 41.5513 99.2567C41.5513 100.507 42.0479 101.706 42.9318 102.59C43.8158 103.474 45.0147 103.97 46.2648 103.97H47.4494C48.6995 103.97 49.8984 103.474 50.7824 102.59C51.6663 101.706 52.1629 100.507 52.1629 99.2567C52.1629 98.0066 51.6663 96.8077 50.7824 95.9237C49.8984 95.0398 48.6995 94.5432 47.4494 94.5432ZM47.4494 55.6191H46.2648C45.0147 55.6191 43.8158 56.1157 42.9318 56.9997C42.0479 57.8836 41.5513 59.0825 41.5513 60.3326C41.5513 61.5827 42.0479 62.7816 42.9318 63.6656C43.8158 64.5495 45.0147 65.0461 46.2648 65.0461H47.4494C48.6995 65.0461 49.8984 64.5495 50.7824 63.6656C51.6663 62.7816 52.1629 61.5827 52.1629 60.3326C52.1629 59.0825 51.6663 57.8836 50.7824 56.9997C49.8984 56.1157 48.6995 55.6191 47.4494 55.6191ZM47.4494 132.352H46.2648C45.0147 132.352 43.8158 132.848 42.9318 133.732C42.0479 134.616 41.5513 135.815 41.5513 137.065C41.5513 138.315 42.0479 139.514 42.9318 140.398C43.8158 141.282 45.0147 141.779 46.2648 141.779H47.4494C48.6995 141.779 49.8984 141.282 50.7824 140.398C51.6663 139.514 52.1629 138.315 52.1629 137.065C52.1629 135.815 51.6663 134.616 50.7824 133.732C49.8984 132.848 48.6995 132.352 47.4494 132.352Z" fill="rgba(33,36,39,0.8)">
      </path>
      </g>
      <defs data-v-38979994="">
        <clipPath data-v-38979994="" id="clip0_900_158">
          <rect data-v-38979994="" width="200" height="200" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>`
  );

  const navbar = add_element("div", "id", "navbar", "");
  const t_button = add_element("button", "id", "t-button", "");
  t_button.appendChild(t_icon);
  t_button.innerHTML += "Transcript";
  navbar.appendChild(t_button);
  const summary_button = add_element("button", "id", "summary-button", "");
  summary_button.appendChild(summary_icon);
  summary_button.innerHTML += "Summary";
  navbar.appendChild(summary_button);
  const notes_button = add_element("button", "id", "notes-button", "");
  notes_button.appendChild(notes_icon);
  notes_button.innerHTML += "Notes";
  navbar.appendChild(notes_button);
  ai_chat_button = add_element("button", "id", "ai-chat-button", "");
  ai_chat_button.appendChild(ai_chat_icon);
  ai_chat_button.innerHTML += "AI Chat";

  navbar.appendChild(ai_chat_button);

  save_button = add_element("button", "id", "save-button", "");

  const save_icon = add_element(
    "div",
    "id",
    "save-icon",
    `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#ffffff"></path> </g></svg>`
  );

  save_button.appendChild(save_icon);
  // save_button.innerHTML += "Save";

  navbar.appendChild(save_button);
  container.appendChild(navbar);

  const transcript = add_element("div", "id", "transcript", "");
  const notes = add_element("div", "id", "notes", "");
  const summary = add_element("div", "id", "summary", "");
  const summary_area = add_element("div", "id", "summary-area", "");
  summary.appendChild(summary_area);
  const t_navbar = add_element("div", "id", "t-navbar", ``);
  const ai_chat = add_element("div", "id", "ai-chat", "");
  const notes_entry = add_element(
    "div",
    "id",
    "notes-entry",
    `
  <textarea id="notes-entry-box" placeholder="Enter your notes here..."></textarea>
  `
  );
  const notes_entry_button = add_element(
    "button",
    "id",
    "notes-entry-button",
    `Enter`
  );
  notes_entry.appendChild(notes_entry_button);
  const notes_card_area = add_element("div", "id", "notes-card-area", ``);

  const ai_chat_entry = add_element(
    "div",
    "id",
    "ai-chat-entry",
    `
    <textarea id="ai-chat-entry-box" placeholder="Enter your Question here..."></textarea>
  `
  );
  const ai_chat_entry_button = add_element(
    "button",
    "id",
    "ai-chat-entry-button",
    `Enter`
  );
  ai_chat_entry.appendChild(ai_chat_entry_button);
  const ai_chat_card_area = add_element("div", "id", "ai-chat-card-area", ``);

  //rgb(169, 32, 30) -> icon colour

  t_button.classList.add("active");
  t_button.style.borderBottom = "2px solid rgb(169, 32, 30)";

  t_button.addEventListener("click", () => {
    t_button.classList.add("active");
    notes_button.classList.remove("active");
    ai_chat_button.classList.remove("active");
    summary_button.classList.remove("active");
    summary.style.display = "none";
    transcript.style.display = "flex";
    notes.style.display = "none";
    ai_chat.style.display = "none";
    t_button.style.borderBottom = "2px solid rgb(169, 32, 30)";
    notes_button.style.borderBottom = "none";
    summary_button.style.borderBottom ="none";
    ai_chat_button.style.borderBottom ="none";
  });

  notes_button.addEventListener("click", () => {
    t_button.classList.remove("active");
    notes_button.classList.add("active");
    ai_chat_button.classList.remove("active");
    summary_button.classList.remove("active");
    summary.style.display = "none";
    transcript.style.display = "none";
    notes.style.display = "flex";
    ai_chat.style.display = "none";
    t_button.style.borderBottom = "none";
    notes_button.style.borderBottom = "2px solid rgb(169, 32, 30)";
    summary_button.style.borderBottom ="none";
    ai_chat_button.style.borderBottom ="none";
  });

  ai_chat_button.addEventListener("click", () => {
    t_button.classList.remove("active");
    notes_button.classList.remove("active");
    ai_chat_button.classList.add("active");
    summary_button.classList.remove("active");
    summary.style.display = "none";
    transcript.style.display = "none";
    notes.style.display = "none";
    ai_chat.style.display = "flex";
    t_button.style.borderBottom = "none";
    notes_button.style.borderBottom = "none";
    summary_button.style.borderBottom ="none";
    ai_chat_button.style.borderBottom ="2px solid rgb(169, 32, 30)";
  });

  let summary_text = null;

  summary_button.addEventListener("click", async () => {
    t_button.classList.remove("active");
    notes_button.classList.remove("active");
    ai_chat_button.classList.remove("active");
    summary_button.classList.add("active");
    summary.style.display = "flex";
    transcript.style.display = "none";
    notes.style.display = "none";
    ai_chat.style.display = "none";
    t_button.style.borderBottom = "none";
    notes_button.style.borderBottom = "none";
    summary_button.style.borderBottom ="2px solid rgb(169, 32, 30)";
    ai_chat_button.style.borderBottom ="none";


    let videoUrl = window.location.href;
    console.log("Video URL:", videoUrl);
    try {
      const response = await fetch("http://localhost:5000/summaries/generate", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: getVideoId(videoUrl),
        }),
      });

      const json = await response.json();

      console.log(json);

      let summary_dict = await JSON.parse(json.summary);
      summary_text = summary_dict.summary;
      console.log(summary_text);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
    if (summary_text) {
      summary_area.style.display = "block";
      var words = summary_text.split(" ");
      var index = 0;
      var intervalId = setInterval(function () {
        summary_area.innerHTML += words[index] + " ";
        index++;
        if (index == words.length) {
          clearInterval(intervalId);
        }
      }, 50);
    }

  });

  const getVideoId = (url) => {
    const videoIdRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);
    const videoId = match ? match[1] : null;
    console.log("Video ID:", videoId);
    return videoId;
  };

const Fetchuser = async (userId) => {
  try {
    const response = await fetch("http://localhost:5000/user/", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId
      }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching user:", error);
    return  null;
  }
}

  const notesDict = {};
  const userId = "66165f6e494b692f52ee5250";

  notes_entry_button.addEventListener("click", () => {
    const notesText = document.getElementById("notes-entry-box").value.trim();
    if (notesText) {
      var htmlVideoPlayer = document.getElementsByTagName("video")[0];
      var timestramp = convertSeconds(htmlVideoPlayer.currentTime);
      notesDict[timestramp] = notesText;
      getNotes();

      document.getElementById("notes-entry-box").value = "";
    }
  });

  save_button.onclick = async function () {
    const videoId = getVideoId(window.location.href);
    if (summary_text) {
      try {
        const response = await fetch("http://localhost:5000/summaries/save", {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summaryBody: summary_text,
            videoId: videoId,
            userId: userId,
          }),
        });
      } catch (error) {
        console.error("Error saving summary:", error);
      }
    }
    let allNotes = Object.values(notesDict).join("\n");
    console.log(allNotes);
    if(allNotes){
      note = {title: "Untitled", body : allNotes};
      const res = await Fetchuser(userId);
      const user = res.user;
      const notes = user.notes;
      console.log(notes);
      const reqNote = notes.find((item) => item.videoId === videoId);
      if (!reqNote) {
        try {
          const response = await fetch("http://localhost:5000/note/create", {
            method: "POST",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId, 
              videoId: videoId, 
              note: note
            }),
          });
          console.log("notes created successfully ");
        } catch (error) {
          console.error("Error creating notes :", error);
        }
      } 
      else {
        try {
          const response = await fetch("http://localhost:5000/note/modify", {
            method: "POST",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId, 
              videoId: videoId, 
              note: note
            }),
          });
          console.log("notes modified successfully ");
        } catch (error) {
          console.error("Error modifying notes :", error);
        }
      }
    }
    alert("Summary and Notes saved successfully");
  };

  ai_chat_entry_button.addEventListener("click", async () => {
    const AiQues = document.getElementById("ai-chat-entry-box").value.trim();
    let answer = null;
    if (AiQues) {
      const question_card = add_element("div", "class", "question-card", ``);
      question_card.style.display = "block";
      question_card.innerHTML += AiQues;
      ai_chat_card_area.appendChild(question_card);
      document.getElementById("ai-chat-entry-box").value = "";

      try {
        const response = await fetch("http://localhost:5000/chatbot/generate", {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: summary_text,
            question: AiQues,
          }),
        });

        const json = await response.json();

        console.log(json);

        answer = await json.response;
        console.log(answer);
      } catch (error) {
        console.error("Error fetching ai-chat response:", error);
      }
      const answer_card = add_element("div", "class", "answer-card", "");
      if (answer) {
        answer_card.innerHTML += answer;
      } else {
        answer_card.innerHTML += "Could not generate a response ";
      }
      ai_chat_card_area.appendChild(answer_card);
    }
  });

  function getNotes() {
    notes_card_area.innerHTML = "";
    for (const [key, value] of Object.entries(notesDict)) {
      const notes_time_card = add_element(
        "div",
        "class",
        "notes-time-card",
        `
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13px" height="13px" viewBox="0 0 13 13" version="1.1">
          <g id="surface1">
          <path style=" stroke:none;fill-rule:evenodd;fill:blue;fill-opacity:1;" d="M 6 0 C 9.3125 0 12 2.6875 12 6 C 12 9.3125 9.3125 12 6 12 C 2.6875 12 0 9.3125 0 6 C 0 2.6875 2.6875 0 6 0 Z M 6 0.5 C 9.035156 0.5 11.5 2.964844 11.5 6 C 11.5 9.035156 9.035156 11.5 6 11.5 C 2.964844 11.5 0.5 9.035156 0.5 6 C 0.5 2.964844 2.964844 0.5 6 0.5 Z M 6 6 L 9 6 L 9 6.5 L 5.5 6.5 L 5.5 2 L 6 2 Z M 6 6 "/>
          </g>
        </svg>
        ${key}
      </div>
      `
      );
      const notes_text_card = add_element(
        "div",
        "class",
        "notes-text-card",
        value
      );
      const my_component_right = add_element(
        "div",
        "class",
        "my-component-right",
        ""
      );
      const copy_icon = add_element(
        "div",
        "class",
        "icon-copy",
        `<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#080341"></path> </g></svg>`
      );
      const edit_icon = add_element("div", "class", "icon-edit", 
      `<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Edit_Pencil_01"> <path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>`
    );
      const delete_icon = add_element(
        "div",
        "class",
        "icon-delete",
        `<svg width="16px" height="16px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></g></svg>`
      );
      my_component_right.appendChild(copy_icon);
      my_component_right.appendChild(edit_icon);
      my_component_right.appendChild(delete_icon);
      notes_time_card.appendChild(my_component_right);
      const notesCard = add_element("div", "class", "notes-card", "");
      notesCard.appendChild(notes_time_card);
      notesCard.appendChild(notes_text_card);
      notes_card_area.appendChild(notesCard);
      copy_icon.setAttribute("data-item-index", key);
      delete_icon.setAttribute("data-item-index", key);
      edit_icon.setAttribute("data-item-index", key);
      notesCard.setAttribute("data-item-index", key);
      notes_text_card.setAttribute("data-item-index", key);

      copy_icon.onclick = function () {
        var timestramp = this.getAttribute("data-item-index");
        var notesText = notesDict[timestramp];
        console.log(notesText);
        navigator.clipboard.writeText(notesText).then(() => {
          alert("Copied to clipboard");
        });
      };

      delete_icon.onclick = function () {
        var timestamp = this.getAttribute("data-item-index");
        delete notesDict[timestamp];
        getNotes();
      };

      edit_icon.onclick = function () {
        var timestamp = this.getAttribute("data-item-index");
        console.log(timestamp);
        const notes_text_card = notes_card_area.querySelector(
          `.notes-text-card[data-item-index="${timestamp}"]`
        );
        console.log(notes_text_card);
        const textarea = add_element("textarea", "class", "edit-text-area", "");

        textarea.value = notesDict[timestamp];
        textarea.classList.add("notes-text-area");
        notes_text_card.replaceWith(textarea);

        textarea.focus();

        textarea.addEventListener("keydown", function (event) {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            notesDict[timestamp] = textarea.value.trim();
            getNotes();
          }
        });

        textarea.addEventListener("blur", function () {
          notesDict[timestamp] = textarea.value.trim();
          getNotes();
        });
      };
    }
  }
  const t_body = add_element("div", "id", "t-body", "Loading...");

  const get_transcript = async () => {
    const temp_t_body = add_element("div", "id", "t-body", "");

    const data = await fetch("http://localhost:5000/transcript/", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: window.location.href,
      }),
    });
    const json = await data.json();
    console.log(json);
    let res = [];
    if (json?.transcript) res = await JSON.parse(json.transcript);
    let transcripts = [];
    const countWords = (str) => str.split(" ").length;
    let totalWords = 0;
    let currStart = -1;
    let currText = "";
    res.forEach((transcript) => {
      if (currStart == -1) currStart = transcript.start;
      currText += transcript.text + " ";
      let words = countWords(transcript.text);
      totalWords += words;
      if (totalWords > 40) {
        totalWords = 0;
        transcripts.push({ start: currStart, text: currText });
        currText = "";
        currStart = -1;
      }
    });

    if (currText != "") {
      transcripts.push({ start: currStart, text: currText });
    }

    transcripts.forEach((transcript) => {
      console.log(typeof transcript.text);
      let card = add_element("div", "class", "card", "");
      let time_card = add_element(
        "div",
        "class",
        "time-card",
        `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13px" height="13px" viewBox="0 0 13 13" version="1.1">
        <g id="surface1">
        <path style=" stroke:none;fill-rule:evenodd;fill:blue;fill-opacity:1;" d="M 6 0 C 9.3125 0 12 2.6875 12 6 C 12 9.3125 9.3125 12 6 12 C 2.6875 12 0 9.3125 0 6 C 0 2.6875 2.6875 0 6 0 Z M 6 0.5 C 9.035156 0.5 11.5 2.964844 11.5 6 C 11.5 9.035156 9.035156 11.5 6 11.5 C 2.964844 11.5 0.5 9.035156 0.5 6 C 0.5 2.964844 2.964844 0.5 6 0.5 Z M 6 6 L 9 6 L 9 6.5 L 5.5 6.5 L 5.5 2 L 6 2 Z M 6 6 "/>
        </g>
      </svg>
      
      ${convertSeconds(transcript.start)}
      `
      );
      let text_card = add_element(
        "div",
        "class",
        "text-card",
        `<div>${transcript.text}</div>`
      );
      card.appendChild(time_card);
      card.appendChild(add_element("hr", "class", "divider", ""));
      card.appendChild(text_card);
      temp_t_body.appendChild(card);
    });

    t_body.replaceWith(temp_t_body);
  };

  transcript.appendChild(t_navbar);
  transcript.appendChild(t_body);
  notes.appendChild(notes_card_area);
  notes.appendChild(notes_entry);
  ai_chat.appendChild(ai_chat_card_area);
  ai_chat.appendChild(ai_chat_entry);
  container.appendChild(transcript);
  container.appendChild(summary);
  container.appendChild(notes);
  container.appendChild(ai_chat);
  console.log("now");
  const ele = document.getElementById("secondary-inner");
  const parent = document.getElementById("secondary");
  parent.insertBefore(container, ele);

  await get_transcript();
}

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.id === "columns") {
            console.log("done");
            main();
          }
        });
      }
    }
  }
});

const targetNode = document.body;
const config = { childList: true, subtree: true };
observer.observe(targetNode, config);

const observeUrlChange = () => {
  let oldHref = document.location.href;
  const observer = new MutationObserver((mutations) => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      main();
    }
  });
  observer.observe(targetNode, { childList: true, subtree: true });
};

window.onload = observeUrlChange;
