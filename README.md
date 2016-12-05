# web-demo-quickdraw-visualizer

Google recently launched a web tool called Quick Draw which asks you to draw an object then tries to guess that object using AI.

<a href="https://quickdraw.withgoogle.com/">https://quickdraw.withgoogle.com/</a>

Curious to know how this web tool worked, I set out to investigate the client-server interactions which allow drawing and guessing. This investigation consists of four parts:

<ol>
<li>How Does Quick Draw Actually Work?</li>
<li>Can I Make a Chrome Extension that Visualizes More of the Quick Draw Data?</li>
<li>Can I Use the Google AI API from Python?</li>
<li>Can I Make My Own Web Tool Using the Google AI API?</li>
</ol>

<h1>Quick Draw</h1>
First, I set out to look at the network calls of the Quick Draw web tool using the Chrome DevTools. When starting the Quick Draw page, it first asks you to draw an object which it will then try to guess.

<img src="screenshots/screenshot_quickdraw-google-1.png" height="500px" width="auto">

As you draw, a lot of POST requests are sent to what appears to be an API endpoint at <i>inputtools.google.com</i>.

<img src="screenshots/screenshot_quickdraw-google-2.png" height="500px" width="auto">

(You can also see an OPTION request for each POST request, but I ignored those for this investigation assuming that I wouldn't be able to interpret their intent from the client side.)

The most important part of these POST requests is the data payload itself, which consists of a JSON string with two main components: (i) the drawing canvas width/height and (ii) an "ink" array that consists of three arrays of numbers.

<img src="screenshots/screenshot_quickdraw-google-3.png" height="500px" width="auto">

<b>IMPORTANT: This "ink" array is obviously the data behind canvas drawing in some format. It took a bit of trial-and-error, but I eventually figured out that the ink array includes values for X,Y as well as time in the following format:</b> 

<code>ink=[[x1, x2, ...],[y1, y2, ...],[t1, t1, ...]]</code>

<b>This realization will come in very handy later on!</b>

The response to each of these POST requests is some JSON data that includes (i) the results of the drawing guesses and (ii) what appears to be some details about the Google AI engine (e.g. call and compute latency).   

<img src="screenshots/screenshot_quickdraw-google-4.png" height="500px" width="auto">

<h1>Chrome Extension</h1>

After realizing that the Quick Draw web tool had more data behind than it was letting on (specifically 20 guesses and scores for each API call), I wanted to visualize that data and my first thought was a small Chrome Extension showing a plot of the guesses and scores.

Having played around with Chrome Extensions before (), I knew enough to be dangerous but not enough as I would soon find out. Not knowing anything about how to see HTTP request data in a Chrome Extension, I quickly found the <a href="https://developer.chrome.com/extensions/webRequest">chrome.webRequest API</a>. Since the webRequest API only runs in a Background Page, I whipped up a quick <code>manifest.json</code> with an empty <code>content.js</code> and a Background Page .js file. This Background Page only <code>console.log</code>s data from the different web request events, mostly to try and parse out request/response headers and body data. It only works on the Googe Quick Draw webtool and only grabs network events from the Google AI API URL. 

To see the <code>console.log</code>'d output of a Background Page, you need to Inspect View of the Background Page in the Chrome Extensions manager (<a href="chrome://extensions/">chrome://extensions/</a>). 

<img src="screenshots/screenshot_chrome-extension-quickdraw-requests-1.png" height="275px" width="auto">

This will bring up a separate console window and will start outputting web request data as you use the Quick Draw web tool.

<img src="screenshots/screenshot_chrome-extension-quickdraw-requests-2.png" height="500px" width="auto">

Unfortunately, I failed to realize that the chrome.webRequest API does not allow access to response body data, which is where the Google AI API guessing results are contained. This threw a wrench into my plan because without that data in the Chrome Extension background, I obviously wouldn't be able to visualize it the way I wanted.

<h1>Python</h1>

Realizing that I couldn't access the Google AI guessing results via a Chrome Extension, I was still curious to figure out a way to visualize the results more than what is shown on the Quick Draw web tool. Having played around with the HTTP request/response data, I wondered if that Google AI API would be accessible from something other than the Quick Draw web tool itself.

Using the handy Chrome DevTool feature of copying network requests as cURL strings, I made a simple Python script to try and get a response from the Google AI API using the Requests package.

I manually recreated the structure of the cURL string into the necessary Requests format. I copied the "ink" array of X-Y-Time data from a previous Quick Draw network call but made it a variable in the Python script in case I wanted to try out different drawing data. Then, I just sent the POST request with the data payload and...

It worked! 

<img src="screenshots/screenshot_python-test-quickdraw-api.png" height="400px" width="auto">

Now, maybe this shouldn't have come as a surprise to me but it was an exciting realization non-the-less.
