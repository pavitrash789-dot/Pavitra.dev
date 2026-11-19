import http from "node:http";

const server = http.createServer((req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: 3001,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxyReq.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Waiting for Next.js on port 3001 to respond...");
  });
  req.pipe(proxyReq, { end: true });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Port bridge running: http://localhost:3000 -> http://localhost:3001");
});
