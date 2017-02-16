"use strict";

const http_ = require("http");
const jdenticon_ = require("jdenticon");
const sprintf_ = require("sprintf-js").sprintf;
const svg2png_ = require("svg2png");
const url_ = require("url");

const listenPort = 9801;
const cacheMaxAge = 365 * 86400;

http_.createServer((request, response) => {
  const _formatHttpDate = date => sprintf_(
    "%s, %02d %s %04d %02d:%02d:%02d GMT",
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getUTCDay()],
    date.getUTCDate(),
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getUTCMonth()],
    date.getUTCFullYear(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  const _responseSuccessful = (binary, contentType) => {
    const headers = {
      "Cache-Control": `public, no-transform, max-age=${cacheMaxAge}`,
      "Expires": _formatHttpDate(new Date(Date.now() + cacheMaxAge * 1000)),
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "X-XSS-Protection": "1",
      "X-Content-Type-Options": "nosniff",
    };
     response.writeHead(200, headers);
     response.write(binary, "binary");
     response.end();
  };
  const responseSvg = binary => {
    _responseSuccessful(binary, "image/svg+xml");
  };
  const responsePng = binary => {
    _responseSuccessful(binary, "image/png");
  };
  const responseError = code => {
    const codes = {
      "400": "Bad Request",
      "500": "Internal Server Error",
    };
    const headers = {
      "Content-Type": "text/plain",
    };
    response.writeHead(code, headers);
    response.write(codes[code]);
    response.end();
  };

  const path = url_.parse(request.url).pathname;
  console.log(`Request: ${path}`);
  const match = path.match(/^\/([0-9a-f]{32,})\.(svg|png)$/);
  if (!match) {
    responseError(400);
    return;
  }

  const svg = jdenticon_.toSvg(match[1], 500);
  switch (match[2]) {
    case 'svg':
      responseSvg(svg);
      return;

    case 'png':
      svg2png_(svg)
        .then(buffer => { responsePng(buffer) })
        .catch(e => {
          console.error(e);
          responseError(500);
        });
      return;
  }
  responseError(400);
}).listen(listenPort, "0.0.0.0");

console.log(`Server running at 0.0.0.0:${listenPort}`);
