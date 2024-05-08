self.window = self;
importScripts("./jsrsasign-all-min.js");
try {
  importScripts("./jsrsasign-all-min.js");
} catch (e) {
  console.error(e);
}

let user_signed_in = false;

const CLIENT_ID = encodeURIComponent(
  "448942832307-nqg04bmbbbcd98rg456e495ppcvcqlhl.apps.googleusercontent.com"
);
const RESPONSE_TYPE = encodeURIComponent("id_token");
const REDIRECT_URI = encodeURIComponent(
  "https://nmmhkkegccagdldgiimedpiccmgmieda.chromiumapp.org"
);
const STATE = encodeURIComponent("asdf");
const SCOPE = encodeURIComponent("openid email profile");
const PROMPT = encodeURIComponent("consent");

function create_oauth2_url() {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  );
  let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&nonce=${nonce}&prompt=${PROMPT}`;
  return url;
}

function is_user_signed_in() {
  return user_signed_in;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "login") {
    if (is_user_signed_in()) {
      console.log("User is already signed in");
    } else {
      chrome.identity.launchWebAuthFlow(
        {
          url: create_oauth2_url(),
          interactive: true,
        },
        function (redirect_url) {
          let id_token = redirect_url.substring(
            redirect_url.indexOf("id_token=") + 9
          );
          id_token = id_token.substring(0, id_token.indexOf("&"));
          const user_info = KJUR.jws.JWS.readSafeJSONString(
            b64utoutf8(id_token.split(".")[1])
          );

          if (
            (user_info.iss === "https://accounts.google.com" ||
              user_info.iss === "accounts.google.com") &&
            user_info.aud === CLIENT_ID
          ) {
            chrome.action.setPopup(
              { popup: "./popup-signed-in.html" },
              function () {
                user_signed_in = true;
                chrome.tabs.query(
                  { active: true, currentWindow: true },
                  function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                      message: "user_info",
                      data: user_info,
                    });
                  }
                );
                sendResponse("success");
              }
            );
          } else {
            console.log("Invalid credentials.");
          }
        }
      );

      return true;
    }
  } else if (request.message === "logout") {
    user_signed_in = false;
    chrome.action.setPopup({ popup: "./index.html" }, () => {
      sendResponse("success");
    });

    return true;
  } else if (request.message === "is_user_signed_in") {
    sendResponse(is_user_signed_in());
  }
});
