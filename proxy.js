const http = require('http');
const net = require('net');

const PORT = 8080;

// Handle HTTP
const server = http.createServer((req, res) => {
  const options = {
    hostname: req.headers.host,
    port: 80,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
  proxyReq.on('error', () => res.end());
});

// Handle HTTPS
server.on('connect', (req, clientSocket, head) => {
  const [hostname, port] = req.url.split(':');
  
  const serverSocket = net.connect(port || 443, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', () => clientSocket.end());
  clientSocket.on('error', () => serverSocket.end());
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy active on 0.0.0.0:${PORT}`);
});

// Auto-kill on network failure to allow clean restart
process.on('uncaughtException', (err) => {
  console.log(`Network shift detected (${err.code}). Forcing reboot...`);
  process.exit(1); 
});