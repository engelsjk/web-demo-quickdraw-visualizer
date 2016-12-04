const WEB_REQUEST = chrome.webRequest;
var x;

var decoder = new TextDecoder("utf-8");

function ab2str(buf) {
  return decoder.decode(new Uint8Array(buf));
}

WEB_REQUEST.onBeforeRequest.addListener(
  function(details) {
    if(details.method==="POST"){
      x = details;
      console.log(details);
      console.log(ab2str(details.requestBody.raw[0].bytes));
    }
  },
  {urls: ["https://inputtools.google.com/*"]},
  ["requestBody"]
);

WEB_REQUEST.onSendHeaders.addListener(
  function(details) {
    if(details.method==="POST"){
      console.log(details.requestHeaders);
    }
  },
  {urls: ["https://inputtools.google.com/*"]},
  ["requestHeaders"]
);

WEB_REQUEST.onHeadersReceived.addListener(
  function(details){
    if(details.method==="POST"){
      console.log(details);
    }
  },
  {urls: ["https://inputtools.google.com/*"]},
  ["responseHeaders"]
);