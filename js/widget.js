document.write('<link rel="stylesheet" href="http://sumeetjain.com/searchreviews.com-widget/css/widget.css" type="text/css" media="screen" title="SearchReviews.com" charset="utf-8">');

(function(){

    var DomReady = window.DomReady = {};

	// Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery. 

    var userAgent = navigator.userAgent.toLowerCase();

    // Figure out what browser is being used
    var browser = {
    	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
    	safari: /webkit/.test(userAgent),
    	opera: /opera/.test(userAgent),
    	msie: (/msie/.test(userAgent)) && (!/opera/.test( userAgent )),
    	mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
    };    

	var readyBound = false;	
	var isReady = false;
	var readyList = [];

	// Handle when the DOM is ready
	function domReady() {
		// Make sure that the DOM is not already loaded
		if(!isReady) {
			// Remember that the DOM is ready
			isReady = true;
        
	        if(readyList) {
	            for(var fn = 0; fn < readyList.length; fn++) {
	                readyList[fn].call(window, []);
	            }
            
	            readyList = [];
	        }
		}
	};

	// From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
	function addLoadEvent(func) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
	    window.onload = func;
	  } else {
	    window.onload = function() {
	      if (oldonload) {
	        oldonload();
	      }
	      func();
	    }
	  }
	};

	// does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
	function bindReady() {
		if(readyBound) {
		    return;
	    }
	
		readyBound = true;

		// Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
		if (document.addEventListener && !browser.opera) {
			// Use the handy event callback
			document.addEventListener("DOMContentLoaded", domReady, false);
		}

		// If IE is used and is not in a frame
		// Continually check to see if the document is ready
		if (browser.msie && window == top) (function(){
			if (isReady) return;
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch(error) {
				setTimeout(arguments.callee, 0);
				return;
			}
			// and execute any waiting functions
		    domReady();
		})();

		if(browser.opera) {
			document.addEventListener( "DOMContentLoaded", function () {
				if (isReady) return;
				for (var i = 0; i < document.styleSheets.length; i++)
					if (document.styleSheets[i].disabled) {
						setTimeout( arguments.callee, 0 );
						return;
					}
				// and execute any waiting functions
	            domReady();
			}, false);
		}

		if(browser.safari) {
		    var numStyles;
			(function(){
				if (isReady) return;
				if (document.readyState != "loaded" && document.readyState != "complete") {
					setTimeout( arguments.callee, 0 );
					return;
				}
				if (numStyles === undefined) {
	                var links = document.getElementsByTagName("link");
	                for (var i=0; i < links.length; i++) {
	                	if(links[i].getAttribute('rel') == 'stylesheet') {
	                	    numStyles++;
	                	}
	                }
	                var styles = document.getElementsByTagName("style");
	                numStyles += styles.length;
				}
				if (document.styleSheets.length != numStyles) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			
				// and execute any waiting functions
				domReady();
			})();
		}

		// A fallback to window.onload, that will always work
	    addLoadEvent(domReady);
	};

	// This is the public function that people can use to hook up ready.
	DomReady.ready = function(fn, args) {
		// Attach the listeners
		bindReady();
    
		// If the DOM is already ready
		if (isReady) {
			// Execute the function immediately
			fn.call(window, []);
	    } else {
			// Add the function to the wait list
	        readyList.push( function() { return fn.call(window, []); } );
	    }
	};
    
	bindReady();
	
})();

DomReady.ready(function() {
	window.readyToGo = true;
});

// Developed by Robert Nyman, http://www.robertnyman.com
// Code/licensing: http://code.google.com/p/getelementsbyclassname/
var getElementsByClassName = function (className, tag, elm){
	if (document.getElementsByClassName) {
		getElementsByClassName = function (className, tag, elm) {
			elm = elm || document;
			var elements = elm.getElementsByClassName(className),
				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
				returnElements = [],
				current;
			for(var i=0, il=elements.length; i<il; i+=1){
				current = elements[i];
				if(!nodeName || nodeName.test(current.nodeName)) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	else if (document.evaluate) {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for(var j=0, jl=classes.length; j<jl; j+=1){
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
			}
			try	{
				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
			}
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return returnElements;
		};
	}
	else {
		getElementsByClassName = function (className, tag, elm) {
			tag = tag || "*";
			elm = elm || document;
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
				current,
				returnElements = [],
				match;
			for(var k=0, kl=classes.length; k<kl; k+=1){
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
			}
			for(var l=0, ll=elements.length; l<ll; l+=1){
				current = elements[l];
				match = false;
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	return getElementsByClassName(className, tag, elm);
};

if(window.readyToGo){
	// Create the super-container
	if(!document.getElementById('searchReviewsWidgetContainer')){
		var resultsContainer = document.createElement('div');
		resultsContainer.id = 'searchReviewsWidgetContainer';
		resultsContainer.style.display = "none";

		// Create a div for the eventual iframe
		var resultsSubcontainer = document.createElement('div');
		resultsSubcontainer.id = 'searchReviewsWidgetSubcontainer';

		// Create the Close Overlay link
		function closeResults(){
			document.getElementById('searchReviewsWidgetContainer').style.display = "none";
		}
		var resultsClose = document.createElement('a');
		resultsClose.id = 'searchReviewsCloseLink';
		resultsClose.innerHTML = "Close";
		resultsClose.title = "Click to close this window."
		resultsClose.onclick = closeResults;

		// Create the Expand link
		function expandResultsWindow(){
			window.location = "http://searchreviews.com";
		}
		var expandResults = document.createElement('a');
		expandResults.id = 'searchReviewsExpandLink';
		expandResults.innerHTML = "Click to expand this window.";
		expandResults.title = "Expand this window."
		expandResults.href = 'http://searchreviews.com';
		expandResults.target = '_blank';

		// Create a div to contain the Expand/Close links
		var linksContainer = document.createElement('div');
		linksContainer.id = 'searchReviewsLinksContainer';

		// Add the above elements to the page
		linksContainer.appendChild(resultsClose);
		linksContainer.appendChild(expandResults);
		resultsContainer.appendChild(linksContainer);
		resultsContainer.appendChild(resultsSubcontainer);
		document.getElementsByTagName('body')[0].appendChild(resultsContainer);
	}

	function srCreateLink(resultsLink){

		// Get a no-nonsense string of keywords
		function srGetKeywords(elementID){
			// If there's no elementID provided, or if it's not found...
			if (elementID == null || document.getElementById(elementID) == null){
				// Try using the <h1>
				if (document.getElementsByTagName('h1')[0]){
					if (document.all){
						var rawString = document.getElementsByTagName('h1')[0].innerText.toLowerCase();
					}
					else{
						var rawString = document.getElementsByTagName('h1')[0].textContent.toLowerCase();
					}
				}
				// Or try the <meta name="description" />
				else{
						var metaTags = document.getElementsByTagName('meta');
						for(var i = metaTags.length - 1; i >= 0; --i){

							if(metaTags[i].name == 'description'){
								var rawString = metaTags[i].content;
							}
						}
				}
			}
			// Hopefully there's an elementID, though:
			else{
				if (document.all){
					var rawString = document.getElementById(elementID).innerText.toLowerCase();
				}
				else{
					var rawString = document.getElementById(elementID).textContent.toLowerCase();
				}
			}

			var cleanString = rawString.replace(/the/g, "").replace(/and/g, "").replace(/to/g, "").replace(/how/g, "").replace(/if/g, "").replace(/review/g, "");

			if (typeof console == "undefined") {
			    window.console = {
			        log: function () {}
			    };
			}
			console.log("Keywords: " + cleanString); // Remove for production

			return cleanString;
		}

		// Show iframe window
		function srResultsWindow(keywords){	
			// Create another container for the overlay
			var resultsWindow = document.createElement('div');

			// Create the iframe that contains the results
			var resultsIframe = document.createElement('iframe');
			resultsIframe.src = 'http://searchreviews.com/customsearch.jsp?reviews=' + keywords;
			// resultsIframe.src = 'sr/results.html?' + keywords;
			resultsIframe.scrolling = 'no';
			resultsIframe.frameBorder = 0;

			// Add the above element to the overlay
			resultsWindow.appendChild(resultsIframe);
			document.getElementById('searchReviewsWidgetSubcontainer').innerHTML = resultsWindow.innerHTML;

			// Change the "Expand" link to go to the right deep link
			var expandResults = document.getElementById('searchReviewsExpandLink');
			expandResults.href = "http://searchreviews.com/search.jsp?reviews=" + keywords;
		}

		// Get reviewCount and update the link
		var request = window.XDomainRequest ? new window.XDomainRequest() : new XMLHttpRequest();
		var url = 'http://searchreviews.com/api/badge?reviews=' + srGetKeywords(resultsLink.rel) + '&time=' + new Date().getTime();

		if(window.XDomainRequest){
			request.onload = callback;
			request.open("GET", url, true);
		}
		else{
			request.open('GET', url, true);
			request.onreadystatechange = callbackCheck;
		}
		request.send();

		function callbackCheck(){
			if (request.readyState == 4){
				if (request.status == 200){
					callback();
				}
				else{
					alert("Error: request.readyState=" + request.readyState + ", request.status=" + request.status);
				}
			}
		}

		function callback(){
			srJSON = eval('(' + request.responseText + ')');
			if (srJSON.reviewCount > 0){
				resultsLink.innerHTML = 'Found ' + srJSON.reviewCount + ' reviews.';
				resultsLink.onclick = function(){
					srResultsWindow(srGetKeywords(resultsLink.rel));
					document.getElementById('searchReviewsWidgetContainer').style.display = "block";
					return false;
				}
			}
			else{
				resultsLink.innerHTML = 'Search for reviews.';
				resultsLink.onclick = function(){
					window.location = "http://searchreviews.com";
				}
			}
		}
	}

	// Find SearchReview Widget links and add widget-display functionality to them
	var allSearchReviewsLinks = getElementsByClassName('searchReviewsLink');

	for (var i = allSearchReviewsLinks.length - 1; i >= 0; --i){
		allSearchReviewsLinks[i].onclick = function(){
			return false;
		}
		srCreateLink(allSearchReviewsLinks[i]);
	}
}