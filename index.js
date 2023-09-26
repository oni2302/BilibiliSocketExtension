const WebSocket = require('ws');
var ip = "icy-elastic-earth.glitch.me";
const wss = new WebSocket.Server({ port:8080 });
console.log('Socket is listening at: ws://icy-elastic-earth.glitch.me:8080');
const connections = {}; // Lưu trữ kết nối bằng ID hoặc tên người dùng

wss.on('connection', (ws) => {
  // Gán một ID hoặc tên người dùng cho kết nối 
  console.log('Client connected');
  let id;
  ws.on('message', (message) => {
    var request = JSON.parse(message.toString());
    if (request.action === 'addSocket') {
      connections[request.token] = ws;
      ws.send('{"action":"addSocket","socket":"' + ip + ':8080","token":"' + request.token + '"}');
      console.log(request.token);
    } else if (request.action === "fontSize") {
      var id = request.to;
      var content = '{"action":"control","request":"' + request.action + '","fontSize":"'+request.fontSize+'"}';
      connections[id].send(content);
    }
    else {
      var id = request.to;
      var content = '{"action":"control","request":"' + request.action + '"}';
      connections[id].send(content);
    }
  }); 

  ws.on('close', () => {
    console.log('Client disconnected ' + id);
    delete connections[id];
  });
});