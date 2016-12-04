# web-demo-quickdraw-visualizer

Google recently launched a web tool called Quick Draw which asks you to draw an object then tries to guess that object using AI.

<a href="https://quickdraw.withgoogle.com/">https://quickdraw.withgoogle.com/</a>

Curious to know how this web tool worked, I set out to investigate the client-server interactions which allow drawing and guessing. This investigation consists of four parts:

<ol>
<li>How Does Quick Draw Actually Work?</li>
<li>Can I Make a Chrome Extension that Visualizes More of the Quick Draw Data?<li>
<li>Can I Use the Google AI API Behind Quick Draw As a Standalone Service?<li>
<li>Can I Make My Own Web Tool Using the Google AI API?</li>
</ol>

<h1>Quick Draw</h1>
First, I set out to look at the network calls of the Quick Draw web tool using the Chrome DevTools. When starting the Quick Draw page, it first asks you to draw an object which it will then try to guess.

<img src="screenshots/screenshot_quickdraw-google-1.png" height="500px">

As you draw, a lot of POST requests are sent to what appears to be an API endpoint at <i>inputtools.google.com</i>.

<img src="screenshots/screenshot_quickdraw-google-2.png" height="500px">

The most important part of these POST requests is the data payload itself, which consists of a JSON string with two main components: (i) the drawing canvas width/height and (ii) an "ink" array that consists of three arrays of numbers.

<img src="screenshots/screenshot_quickdraw-google-3.png" height="500px">

And the response to each of these POST requests is some JSON data that includes (i) the results of the drawing guesses and (ii) what appears to be some details about the Google AI engine (e.g. call and compute latency).   

<img src="screenshots/screenshot_quickdraw-google-4.png" height="500px">

<h1>Chrome Extension</h1>

After realizing that the Quick Draw web tool had more data behind than it was letting on (specifically 20 guesses and scores for each API call), I wanted to visualize that data and my first thought was a small Chrome extension consisting of maybe a line chart.
