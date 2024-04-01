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
    height: 400px;
    width: 100%;
    background-color: #edf4fb;
  }

  #transcript{
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
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
  
  .text-card{
    font-size: 14px;
    padding: 15px;
    line-height: 1.7;
  }

  .card{
    background-color: white;
    border-radius: 5px;
  }

  .divider{
    border: 1px solid lightgray;
    opacity: 0.5;
  }

  #t-button{
    background-color: transparent;
    color: rgb(169, 32, 30);
    border: none;
    outline: none;
    font-size: 12px;
    padding: 15px;    
  }



  
  `);

  const container = add_element("div", "id", "ext-container", "");

  const t_icon = add_element(
    "div",
    "id",
    "t-icon",
    `<svg data-v-8ec02cea="" width="17.59" height="20" viewBox="0 0 176 200" xmlns="http://www.w3.org/2000/svg" class="nav-top" xmlns:xlink="http://www.w3.org/1999/xlink" filter="none"><g data-v-8ec02cea=""><path data-v-8ec02cea="" d="M140.914 0H35.0863C25.9618 0.0101648 17.2139 3.63956 10.7622 10.0918C4.31045 16.5441 0.681772 25.2923 0.672363 34.4168V165.583C0.682546 174.707 4.31146 183.455 10.763 189.907C17.2146 196.359 25.962 199.989 35.0862 200H140.914C150.038 199.989 158.786 196.359 165.237 189.907C171.689 183.455 175.318 174.707 175.328 165.583V34.4168C175.319 25.2923 171.69 16.5441 165.238 10.0918C158.786 3.63955 150.039 0.0101544 140.914 0ZM43.9545 41.0451H134.126V63.8299H43.9545V41.0451ZM134.126 161.612H43.9545C42.7773 161.612 41.6483 161.144 40.8159 160.312C39.9835 159.48 39.5159 158.351 39.5159 157.174C39.5159 155.996 39.9835 154.867 40.8159 154.035C41.6483 153.203 42.7773 152.735 43.9545 152.735H134.126C135.303 152.735 136.432 153.203 137.265 154.035C138.097 154.867 138.565 155.996 138.565 157.174C138.565 158.351 138.097 159.48 137.265 160.312C136.432 161.144 135.303 161.612 134.126 161.612ZM134.126 138.827H43.9545C43.3716 138.827 42.7944 138.713 42.2559 138.489C41.7174 138.266 41.2281 137.939 40.8159 137.527C40.4038 137.115 40.0768 136.626 39.8538 136.087C39.6307 135.549 39.5159 134.972 39.5159 134.389C39.5159 133.806 39.6307 133.229 39.8538 132.69C40.0768 132.152 40.4038 131.662 40.8159 131.25C41.2281 130.838 41.7174 130.511 42.2559 130.288C42.7944 130.065 43.3716 129.95 43.9545 129.95H134.126C135.303 129.95 136.432 130.418 137.265 131.25C138.097 132.083 138.565 133.212 138.565 134.389C138.565 135.566 138.097 136.695 137.265 137.527C136.432 138.36 135.303 138.827 134.126 138.827Z" fill="rgb(169, 32, 30)" stroke="none"></path></g></svg>`
  );

  const navbar = add_element("div", "id", "navbar", "");
  const t_button = add_element("button", "id", "t-button", "");
  t_button.appendChild(t_icon);
  t_button.innerHTML += "Transcript";
  container.appendChild(navbar);
  navbar.appendChild(t_button);

  const transcript = add_element("div", "id", "transcript", "");

  const t_navbar = add_element("div", "id", "t-navbar", ``);

  //rgb(169, 32, 30) -> icon colour

  const t_body = add_element("div", "id", "t-body", "");


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
  container.appendChild(transcript);

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
