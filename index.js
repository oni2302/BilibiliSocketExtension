const WebSocket = require('ws');
const http = require('http');
const os = require('os');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server');
});
var ip = "";
const wss = new WebSocket.Server({ server });

const connections = {}; // Lưu trữ kết nối bằng ID hoặc tên người dùng

wss.on('connection', (ws, request) => {
  // Gán một ID hoặc tên người dùng cho kết nối 
  console.log('Client connected');
  let id;
  ws.on('message', (message) => {
    var request = JSON.parse(message.toString());
    if (request.action === 'addSocket') {
      connections[request.token] = ws;
      ws.send('{"action":"addSocket","socket":"' + getLocalIPAddress() + ':8080","token":"' + request.token + '"}');
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
    // Xóa kết nối đã đóng khỏi danh sách connections
    delete connections[id];
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
function getLocalIPAddress() {
  const networkInterfaces = os.networkInterfaces();
  // Assuming you want the first non-internal IPv4 address
  for (const interfaceName in networkInterfaces) {
    const interface = networkInterfaces[interfaceName];
    for (const item of interface) {
      if (item.family === 'IPv4' && !item.internal) {
        return item.address;
      }
    }
  }
  return '127.0.0.1'; // Default to localhost if no valid IP found
}