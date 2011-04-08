document.write('<link rel="stylesheet" href="css/widget.css" type="text/css" media="screen" title="SearchReviews.com" charset="utf-8">');

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
	resultsClose.onclick = closeResults;

	// Add the above elements to the page
	resultsContainer.appendChild(resultsClose);
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
		
		var cleanString = rawString.replace(/the/g, "");
		return cleanString;
	}
	
	// Show iframe window
	function srResultsWindow(keywords){	
		// Create another container for the overlay
		var resultsWindow = document.createElement('div');

		// Create the iframe that contains the results
		var resultsIframe = document.createElement('iframe');
		// resultsIframe.src = 'http://searchreviews.com/customsearch.jsp?reviews=' + keywords;
		resultsIframe.src = 'sr/results.html?' + keywords;
		resultsIframe.scrolling = 'no';
		resultsIframe.frameBorder = 0;

		// Add the above element to the overlay
		resultsWindow.appendChild(resultsIframe);
		document.getElementById('searchReviewsWidgetSubcontainer').innerHTML = resultsWindow.innerHTML;
	}
	
	// Update the link to show the reviews overlay
	resultsLink.innerHTML = 'Found ## reviews.';
	resultsLink.onclick = function(){
		srResultsWindow(srGetKeywords(resultsLink.rel));
		document.getElementById('searchReviewsWidgetContainer').style.display = "block";
		return false;
	}
}

// Find SearchReview Widget links and add widget-display functionality to them
var allSearchReviewsLinks = getElementsByClassName('searchReviewsLink');

for (var i = allSearchReviewsLinks.length - 1; i >= 0; --i){
	srCreateLink(allSearchReviewsLinks[i]);
}
