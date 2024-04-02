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

async function main() {
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

  #transcript, #notes{
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }
  #notes{
    display:none;
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

  .notes-time-card{
    font-size: 10px;
    color: blue;
    padding: 5px;
    padding-left: 20px;
    height: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
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
  }

  .divider{
    border: 1px solid lightgray;
    opacity: 0.5;
  }

  #t-button, #notes-button{
    background-color: transparent;
    color: rgb(169, 32, 30);
    border: none;
    outline: none;
    font-size: 12px;
    padding: 15px;    
  }

  #notes-entry-box{
    width: 100%;
    height: 60px;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 8px;
    box-sizing: border-box;
  }
  #notes-entry{
    margin-top: auto;
  }
  #notes-card-area{
    widht:100%;
    height:350px;
  }

  #notes-entry-button {
    position:relative;
    width: 50px;
    left: 312px;
    top:-30px;
    background-color: blue;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    
  }
  
  `);

  const container = add_element("div", "id", "ext-container", "");

  const t_icon = add_element(
    "div",
    "id",
    "t-icon",
    `<svg data-v-8ec02cea="" width="17.59" height="20" viewBox="0 0 176 200" xmlns="http://www.w3.org/2000/svg" class="nav-top" xmlns:xlink="http://www.w3.org/1999/xlink" filter="none"><g data-v-8ec02cea=""><path data-v-8ec02cea="" d="M140.914 0H35.0863C25.9618 0.0101648 17.2139 3.63956 10.7622 10.0918C4.31045 16.5441 0.681772 25.2923 0.672363 34.4168V165.583C0.682546 174.707 4.31146 183.455 10.763 189.907C17.2146 196.359 25.962 199.989 35.0862 200H140.914C150.038 199.989 158.786 196.359 165.237 189.907C171.689 183.455 175.318 174.707 175.328 165.583V34.4168C175.319 25.2923 171.69 16.5441 165.238 10.0918C158.786 3.63955 150.039 0.0101544 140.914 0ZM43.9545 41.0451H134.126V63.8299H43.9545V41.0451ZM134.126 161.612H43.9545C42.7773 161.612 41.6483 161.144 40.8159 160.312C39.9835 159.48 39.5159 158.351 39.5159 157.174C39.5159 155.996 39.9835 154.867 40.8159 154.035C41.6483 153.203 42.7773 152.735 43.9545 152.735H134.126C135.303 152.735 136.432 153.203 137.265 154.035C138.097 154.867 138.565 155.996 138.565 157.174C138.565 158.351 138.097 159.48 137.265 160.312C136.432 161.144 135.303 161.612 134.126 161.612ZM134.126 138.827H43.9545C43.3716 138.827 42.7944 138.713 42.2559 138.489C41.7174 138.266 41.2281 137.939 40.8159 137.527C40.4038 137.115 40.0768 136.626 39.8538 136.087C39.6307 135.549 39.5159 134.972 39.5159 134.389C39.5159 133.806 39.6307 133.229 39.8538 132.69C40.0768 132.152 40.4038 131.662 40.8159 131.25C41.2281 130.838 41.7174 130.511 42.2559 130.288C42.7944 130.065 43.3716 129.95 43.9545 129.95H134.126C135.303 129.95 136.432 130.418 137.265 131.25C138.097 132.083 138.565 133.212 138.565 134.389C138.565 135.566 138.097 136.695 137.265 137.527C136.432 138.36 135.303 138.827 134.126 138.827Z" fill="rgb(169, 32, 30)" stroke="none"></path></g></svg>`
  );

  const notes_icon = add_element(
    "div",
    "id",
    "notes-icon",
    `<svg data-v-8ec02cea="" width="20" height="20" viewBox="0 0 200 200" fill="#101010" xmlns="http://www.w3.org/2000/svg" class="nav-top"><g data-v-8ec02cea="" clip-path="url(#clip0_900_152)"><path data-v-8ec02cea="" d="M192.492 65.698L176.126 49.3324C172.274 45.4802 166.3 45.1875 162.81 48.6778L75.7107 135.802C74.4204 137.09 73.4038 138.106 70.4265 158.462C70.1833 160.13 70.3008 161.83 70.7711 163.449C71.2414 165.067 72.0535 166.565 73.1526 167.843C74.2517 169.12 75.6121 170.147 77.142 170.854C78.6719 171.56 80.3357 171.93 82.0209 171.939C82.7044 171.939 83.3866 171.881 84.0603 171.766C103.778 168.379 104.832 167.334 106.031 166.126L193.146 79.0138C196.636 75.533 196.341 69.5533 192.492 65.698ZM99.8972 158.906C98.7579 159.284 94.8963 160.322 82.4648 162.456C82.1027 162.517 81.7312 162.492 81.3807 162.383C81.0301 162.273 80.7104 162.083 80.4475 161.826C80.1846 161.57 79.986 161.255 79.8679 160.907C79.7497 160.559 79.7154 160.189 79.7676 159.825C81.6307 147.107 82.6158 143.069 82.9683 141.886L169.108 55.7466C169.237 55.8164 169.356 55.9044 169.46 56.0078L185.826 72.3734C185.93 72.4772 186.018 72.596 186.087 72.7258L99.8972 158.906Z" fill="rgba(33,36,39,0.8)"></path> <path data-v-8ec02cea="" d="M164.447 121.329C163.62 121.329 162.802 121.492 162.038 121.808C161.275 122.124 160.581 122.588 159.996 123.173C159.412 123.757 158.948 124.451 158.632 125.215C158.315 125.978 158.153 126.797 158.153 127.623V165.51C158.153 177.586 147.21 187.411 133.762 187.411H41.3968C27.9487 187.411 17.0058 177.586 17.0058 165.51V34.4938C17.0059 22.4146 27.9488 12.5891 41.3968 12.5891H133.768C145.86 12.5891 156.245 20.7058 157.926 31.4724C158.047 32.2943 158.331 33.084 158.759 33.7959C159.187 34.5079 159.752 35.128 160.421 35.6205C161.09 36.113 161.85 36.4682 162.657 36.6656C163.465 36.8629 164.303 36.8986 165.124 36.7704C165.944 36.6422 166.732 36.3528 167.44 35.9189C168.149 35.4849 168.764 34.9149 169.252 34.2419C169.739 33.5689 170.088 32.806 170.279 31.9974C170.47 31.1888 170.498 30.3504 170.364 29.5306C169.086 21.3478 164.652 13.8322 157.879 8.38428C151.028 2.93164 142.524 -0.0253648 133.768 0.000163921H41.3968C21.006 0.000163921 4.41699 15.4751 4.41699 34.4938V165.51C4.41699 184.528 21.006 200 41.3969 200H133.768C154.159 200 170.748 184.528 170.748 165.51V127.623C170.748 126.796 170.585 125.977 170.268 125.213C169.951 124.449 169.487 123.755 168.902 123.17C168.317 122.586 167.622 122.122 166.858 121.806C166.093 121.49 165.274 121.328 164.447 121.329Z" fill="rgba(33,36,39,0.8)"></path> <path data-v-8ec02cea="" d="M96.2466 47.2969H44.4337C43.1817 47.2969 41.9809 47.7942 41.0956 48.6796C40.2103 49.5649 39.7129 50.7657 39.7129 52.0177C39.7129 53.2698 40.2103 54.4705 41.0956 55.3559C41.9809 56.2412 43.1817 56.7386 44.4337 56.7386H96.2464C97.4985 56.7386 98.6992 56.2412 99.5846 55.3559C100.47 54.4705 100.967 53.2698 100.967 52.0177C100.967 50.7657 100.47 49.5649 99.5846 48.6796C98.6992 47.7942 97.4987 47.2969 96.2466 47.2969ZM96.2466 71.1025H44.4337C43.1817 71.1025 41.9809 71.5999 41.0956 72.4852C40.2103 73.3706 39.7129 74.5713 39.7129 75.8234C39.7129 77.0754 40.2103 78.2762 41.0956 79.1615C41.9809 80.0468 43.1817 80.5442 44.4337 80.5442H96.2464C97.4985 80.5442 98.6992 80.0468 99.5846 79.1615C100.47 78.2762 100.967 77.0754 100.967 75.8234C100.967 74.5713 100.47 73.3706 99.5846 72.4852C98.6992 71.5999 97.4987 71.1025 96.2466 71.1025Z" fill="rgba(33,36,39,0.8)"></path></g> <defs data-v-8ec02cea=""><clipPath data-v-8ec02cea="" id="clip0_900_152"><rect data-v-8ec02cea="" width="200" height="200" fill="white"></rect></clipPath></defs></svg>`
  );

  const navbar = add_element("div", "id", "navbar", "");
  const t_button = add_element("button", "id", "t-button", "");
  t_button.appendChild(t_icon);
  t_button.innerHTML += "Transcript";
  navbar.appendChild(t_button);
  const notes_button = add_element("button", "id", "notes-button", "");
  notes_button.appendChild(notes_icon);
  notes_button.innerHTML += "Notes";
  navbar.appendChild(notes_button);
  container.appendChild(navbar);


  const transcript = add_element("div", "id", "transcript", "");
  const notes = add_element("div", "id", "notes", "");
  const t_navbar = add_element("div", "id", "t-navbar", ``);
  const notes_card_area  = add_element("div", "id", "notes-card-area", ``);
  const notes_entry = add_element("div", "id", "notes-entry", `
    <textarea id="notes-entry-box" placeholder="Enter your notes here..."></textarea>
  `);

  const notes_entry_button = add_element("button", "id", "notes-entry-button",`Enter`);
  notes_entry.appendChild(notes_entry_button);

  //rgb(169, 32, 30) -> icon colour

  const t_body = add_element("div", "id", "t-body", "");

  t_button.classList.add("active");

  t_button.addEventListener("click", () => {
    t_button.classList.add("active");
    notes_button.classList.remove("active");
    transcript.style.display = "block";
    notes.style.display = "none";
  });

  notes_button.addEventListener("click", () => {
    t_button.classList.remove("active");
    notes_button.classList.add("active");
    transcript.style.display = "none";
    notes.style.display = "block";
  });

  const notesDict = {};

  notes_entry_button.addEventListener("click", () => {
    const notesText = document.getElementById("notes-entry-box").value.trim();
    if (notesText) {
      var htmlVideoPlayer = document.getElementsByTagName("video")[0];
      var timestramp = convertSeconds(htmlVideoPlayer.currentTime);
      notesDict[timestramp] = notesText;
      const notesCard = add_element(
        "div",
        "class",
        "notes-card",
        `<div class="notes-time-card">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="13px" height="13px" viewBox="0 0 13 13" version="1.1">
            <g id="surface1">
            <path style=" stroke:none;fill-rule:evenodd;fill:blue;fill-opacity:1;" d="M 6 0 C 9.3125 0 12 2.6875 12 6 C 12 9.3125 9.3125 12 6 12 C 2.6875 12 0 9.3125 0 6 C 0 2.6875 2.6875 0 6 0 Z M 6 0.5 C 9.035156 0.5 11.5 2.964844 11.5 6 C 11.5 9.035156 9.035156 11.5 6 11.5 C 2.964844 11.5 0.5 9.035156 0.5 6 C 0.5 2.964844 2.964844 0.5 6 0.5 Z M 6 6 L 9 6 L 9 6.5 L 5.5 6.5 L 5.5 2 L 6 2 Z M 6 6 "/>
            </g>
          </svg>
          
          ${timestramp}
         </div>
        <div class="notes-text-card">${notesText}</div>
        `
      );
      document.getElementById("notes-card-area").appendChild(notesCard);
      document.getElementById("notes-entry-box").value = "";
    }
  });


  let transcripts = [
    {
      start: 0,
      text: "demon 1 arguably the best player in valerant right now his former team Evil Genius has won VCT 2023 and largely because of him since at that event he also won the MVP award the haters respect mying name I'm the best in this game which is why I'm going to be training like demon one every single day for the next seven days to see how high I can climb there's one problem though I've heard from some of my friends that episode 8's rank reset has been brutal to say the least my immortal friend was",
    },

    {
      start: 26,
      text: "placed diamond and my diamond friend was placed gold and I PE Gold too last episode so there's no tell how low I'm going to get placed but honestly I think I belong in plat so we're going to see if demon 1's a routine can give me that extra boost that I'm going to need if I want to hit plat by the end of this video so what is this same routine well it's three very simple steps the first one being his a Labs playlist that you can see here he did specify though that the last three were we just for fun so",
    },
    {
      start: 47,
      text: "we'll be focusing on the first two because I would say these two helped me the most we'll also be comparing our scores from day one and day seven to see how much we actually improved but anyways the next step is about 20 minutes in the range focusing on flicking and micro adjusting with multiple weapons and then the last and probably the worst step before finally queuing comp is about 5 to 10 death matches day one it's been about 6 months since I've even touched aim lab so I was a little worried how well I would do on",
    },
    {
      start: 71,
      text: "these practice courses but to my surprise I almost got a new high score on straf track first try okay I actually felt like that was really good that was one of my best attempts on the other hand headshot stard took a little getting used to but I don't really stress over my lackluster attempt since I still have the entire week to bump that score up then it was time for the range where I literally just clicked heads for 20 minutes straight and then I proceeded to my mini mini death matches the warm-up is finally done as you can",
    },
    {
      start: 96,
      text: "see we got three placement matches left I did two of them they didn't go too well today we can get that done get our placement and then we'll decide where to go from there game one started pretty rough though we started out 0 and5 and I was bottom fragging too I was honestly just really nervous considering I hadn't played comp in about 3 months even though I know I really shouldn't be like the only difference between this and unrated is that there's a rank attached to it so I focused up and actually",
    },
    {
      start: 118,
      text: "started getting some kills for the team oh no one enem wow he suppressed me on start oh my God I was putting my team on my back as much as I possibly could this was just an unwinable game and our first Team MVP loss unfortunately it wasn't our last either another team MVP lost you know you love to see it with only one placement match left this next game could not have gone any worse we got absolutely bodied 1 to 13 let's see the rank please be gold please be gold please be gold I'm am so sad so oh my God",
    },
  ];

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
    t_body.appendChild(card);
  });

  transcript.appendChild(t_navbar);
  transcript.appendChild(t_body);
  notes.appendChild(notes_card_area);
  notes.appendChild(notes_entry);
  container.appendChild(transcript);
  container.appendChild(notes);


  const ele = document.getElementById("secondary-inner");
  const parent = document.getElementById("secondary");
  parent.insertBefore(container, ele);
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