
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// config
//var config = require('@/../../config.json');

const server_addr_env_dev = window.location.protocol + "//" + window.location.hostname + ":" + 4000;
const server_addr_env_prod = window.location.href;

const SERVER_ADDRESS = process.env.NODE_ENV == 'production' ? server_addr_env_prod : server_addr_env_dev;

const state = {
  SERVER_ADDRESS: SERVER_ADDRESS,
  loading: false,
  user: undefined,
  user_message: '',
};

var store = new Vuex.Store({
  state: state
});

export default store;

// handle every thing and return only the data of the response in resolve
store.dispatchAsync = function (url, data) {
  data = JSON.stringify(data);
  url = SERVER_ADDRESS + url;

  // hide user_message
  $('#user_message').fadeOut(100);

  return new Promise((resolve, reject) => {
    state.loading = true;// show loader
    $.ajax({
      url: url,
      dataType: "json",
      type: "POST",
      data: JSON.parse(data),
      complete: (rs) => {
        state.loading = false;// hide loader
      }
    }).done(resp => {
      console.log('`AjaxResp`\n\turl: %s, \n\tdata: %o, \n\tresp: %o', url, data, resp);
      resolve(resp);

    }).fail(err => {
      console.error(err);
    });
  })
};

store.initStore = function () {
  console.log('initStore');

};
