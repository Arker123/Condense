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

let userInfo = null;

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // 2. A page requested user data, respond with a copy of `user`
//   if (message === "get-user-data") {
//     console.log(userInfo);
//     sendResponse(userInfo);
//   }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (request.message === "login") {
  //   if (is_user_signed_in()) {
  //     console.log("User is already signed in");
  //   } else {
  //     chrome.identity.launchWebAuthFlow(
  //       {
  //         url: create_oauth2_url(),
  //         interactive: true,
  //       },
  //       function (redirect_url) {
  //         let id_token = redirect_url.substring(
  //           redirect_url.indexOf("id_token=") + 9
  //         );
  //         id_token = id_token.substring(0, id_token.indexOf("&"));
  //         const user_info = KJUR.jws.JWS.readSafeJSONString(
  //           b64utoutf8(id_token.split(".")[1])
  //         );
  //         userInfo = user_info;
  //         // console.log("User info: ", user_info);
  //         // chrome.tabs.query(
  //         //   { active: true, currentWindow: true },
  //         //   function (tabs) {
  //         //     var activeTabs = tabs[0];
  //         //     chrome.tabs.sendMessage(activeTabs.id, { userInfo: user_info });
  //         //   }
  //         // );
  //         // chrome.runtime.sendMessage({userInfo: user_info})
  //         // chrome.storage.local.set(
  //         //   { user: JSON.stringify(user_info) },
  //         //   function () {
  //         //     if (chrome.runtime.lastError) {
  //         //       console.error(
  //         //         "Error setting " +
  //         //           key +
  //         //           " to " +
  //         //           JSON.stringify(data) +
  //         //           ": " +
  //         //           chrome.runtime.lastError.message
  //         //       );
  //         //     }
  //         //   }
  //         // );
  //         // localStorage.setItem("user", JSON.stringify(user_info));
  //         if (
  //           (user_info.iss === "https://accounts.google.com" ||
  //             user_info.iss === "accounts.google.com") &&
  //           user_info.aud === CLIENT_ID
  //         ) {
  //           chrome.action.setPopup(
  //             { popup: "./popup-signed-in.html" },
  //             function () {
  //               user_signed_in = true;
  //               sendResponse("success");
  //             }
  //           );
  //         } else {
  //           console.log("Invalid credentials.");
  //         }
  //       }
  //     );

  //     return true;
  //   }
  // }
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
          console.log(user_info);

          if (
            (user_info.iss === "https://accounts.google.com" ||
              user_info.iss === "accounts.google.com") &&
            user_info.aud === CLIENT_ID
          ) {
            // Storing user information
            chrome.storage.local.set(
              { userEmail: user_info.email, userName: user_info.name },
              function () {
                console.log("User email and name saved in local storage");
              }
            );

            // Setting user signed-in state
            chrome.action.setPopup(
              { popup: "./popup-signed-in.html" },
              function () {
                user_signed_in = true;
                sendResponse("success");
              }
            );
          } else {
            console.log("Invalid credentials.");
          }
        }
      );
      return true; // Keeps the message channel open for asynchronous response
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
