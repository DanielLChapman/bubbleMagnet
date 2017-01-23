View the info page here : https://daniellchapman.github.io/bubbleMagnet/bubbleIndex.html

This goes over most of the functionality, but on the basic level, I really enjoyed this codepen by Jack Rugle (link: http://codepen.io/jackrugile/pen/DozAd). I wanted to recreate it to learn how it was built, to get a better understanding of canvas, and as a possible addition to my portfolio. Ultimately I decided it didnt fit with how I wanted my portfolio to feel, but I already had re-created it, improved it slightly, and turned it into a JS file that can be used with most html pages. So I decided to put it on github. 

The user just simply has to download the bubbleCanvas.js file, and include it in their html source along with jQuery. 

Then they simply start the script with "startBubbling('body', true);"

'body' is replaced with whichever div you want the bubbles to appear in. For example, a div with the class 'center-box' will be called with: 
startBubbling('.center-box', true);. Similarly with IDs, startBubbling('#center-box', true);

The true variable simply tells the program to include the magnet controls, if you dont want to use those, then simply change true to false. 

You can edit the CSS of the magnet controls with the class .magnetControls. 
The canvas can fit inside any div with a width and height. It also resizes automatically. If you want full screen bubbling, simply leave the 'body' signifyer and add the css for canvas:

canvas { background: [add your color option]; display: block; left: 0; position: absolute; top: 0; }

Thats pretty much it, if you want to experiment with the bubble magnets, view the info page and scroll to the bottom, or click on any bordered area. 