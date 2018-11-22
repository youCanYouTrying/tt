var url = 'ws://192.168.1.143:2121';

function connect(user, func) {

  wx.connectSocket({
    url: url + '?username=' + user.nickName
  });

  wx.onSocketMessage(func);
}


function send(msg) {
  wx.sendSocketMessage({ data: msg });
}
module.exports = {
  connect: connect,
  send: send
}