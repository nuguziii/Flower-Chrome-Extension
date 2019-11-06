/* global chrome */
import axios from "axios";
import memoAPI from "./MemoAPI";
import atob from "atob";
import "./chrome-extension-async";

async function sendRequest(token, url, method, data = "", queryString = {}) {
  const request = {
    url: url,
    method: method,
    headers: {
      Authorization: token
    },
    data: data,

    params: queryString
  };

  let response = await axios(request);
  return response;
}

const FlowerAPI = {
  getTags: async (token=undefined, node=undefined) => {

    node = 
        {
          title : "Part 2. Introduction to Ensemble Learning : Boosting",
          url : "https://subinium.github.io/introduction-to-ensemble-2-boosting/"
        };
    
    token = "";

    let url = "https://ep9jktepxl.execute-api.ap-northeast-2.amazonaws.com/beata/";
    let method = "post";
    let data = node;
    let response = await sendRequest(token, url, method, JSON.stringify(data));

    console.log(response);

    //return response;
  },

  getRecommendedTags: async () => {
    let url = "https://nhe02otv71.execute-api.ap-northeast-2.amazonaws.com/beta/";
    let method = "post";
    let data = "hello";

    const request = {
      url: url,
      method: method,
      headers:{"Content-Type":"application/json"},
      data: JSON.stringify(data)
    };
  
    let response = await axios(request);

    console.log(response);

    return response;
  },

  getMemos: async requestUrl => {
    if (await FlowerAPI.checkLoginStatus()) {
      const info = await FlowerAPI.getUserInfo();

      let result = await memoAPI.getMemos(info.token, requestUrl);
      return result;
    }
  },

  postMemos: async memoList => {
    if (await FlowerAPI.checkLoginStatus()) {
      const info = await FlowerAPI.getUserInfo();
      let result = await memoAPI.postMemos(info.token, memoList);
      return result;
    }
  },

  deleteMemos: async memoId => {
    if (await FlowerAPI.checkLoginStatus()) {
      const info = await FlowerAPI.getUserInfo();

      let result = await memoAPI.deleteMemos(info.token, memoId);
      return result;
    }
  },

  getUserInfo: async () => {
    const info = await chrome.storage.local.get(["token", "email"]);
    return info;
  },

  checkLoginStatus: async () => {
    const info = await FlowerAPI.getUserInfo();
    const con1 = await FlowerAPI.getLoginState(info.token);

    if (con1) {
      return await FlowerAPI.checkTokenValid(info.token);
    }
    return false;
  },

  getLoginState: async token => {
    if (token === undefined || token === "") {
      return false;
    } else {
      return true;
    }
  },

  checkTokenValid: async token => {
    let infoToken = token.split(".")[1];
    let infoString = atob(infoToken);
    let info = JSON.parse(infoString);
    let expireTime = info["exp"];
    let now = new Date().getTime();

    return parseInt(now / 1000) < expireTime === true;
  },

  updateLogoutState: async () => {
    await chrome.storage.local.set(
      { token: "", id: "", email: "" },
      function() {
        alert("logout");
      }
    );
  }
};
export default FlowerAPI;
