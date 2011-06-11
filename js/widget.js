window.sr_pid = 'E73VRpaZdYs=';

document.write('<link rel="stylesheet" href="css/widget.css" type="text/css" media="screen" title="SearchReviews.com" charset="utf-8">');

// Fix Flash
// http://stackoverflow.com/questions/1168494/how-do-i-programmatically-set-all-objects-to-have-the-wmode-set-to-opaque
function fix_flash() {
    // loop through every embed tag on the site
    var embeds = document.getElementsByTagName('embed');
    for(i=0; i<embeds.length; i++)  {
        embed = embeds[i];
        var new_embed;
        // everything but Firefox & Konqueror
        if(embed.outerHTML) {
            var html = embed.outerHTML;
            // replace an existing wmode parameter
            if(html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i))
                new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i,"wmode='opaque'");
            // add a new wmode parameter
            else 
                new_embed = html.replace(/<embed\s/i,"<embed wmode='opaque' ");
            // replace the old embed object with the fixed version
            embed.insertAdjacentHTML('beforeBegin',new_embed);
            embed.parentNode.removeChild(embed);
        } else {
            // cloneNode is buggy in some versions of Safari & Opera, but works fine in FF
            new_embed = embed.cloneNode(true);
            if(!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase()=='window')
                new_embed.setAttribute('wmode','opaque');
            embed.parentNode.replaceChild(new_embed,embed);
        }
    }
    // loop through every object tag on the site
    var elementToAppend = document.createElement('param');
    elementToAppend.setAttribute('name', 'wmode');
    elementToAppend.setAttribute('value', 'opaque');
    var objects = document.getElementsByTagName('object');
    for (var i = 0; i < objects.length; i++) {
        var newObject = objects[i].cloneNode(true);
        elementToAppend = elementToAppend.cloneNode(true);
        newObject.appendChild(elementToAppend);
        objects[i].parentNode.replaceChild(newObject, objects[i]);
    }
}          

// Window dimensions
window.viewWidth = 630;
window.viewHeight = 460;
if (document.body && document.body.offsetWidth){
	window.viewWidth = document.body.offsetWidth;
	window.viewHeight = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth){
	window.viewWidth = document.documentElement.offsetWidth;
	window.viewHeight = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight){
	window.viewWidth = window.innerWidth;
	window.viewHeight = window.innerHeight;
}

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

window.onload = function(){
	// Create the super-container
	if(!document.getElementById('searchReviewsWidgetContainer')){
		var resultsContainer = document.createElement('div');
		resultsContainer.id = 'searchReviewsWidgetContainer';
		resultsContainer.style.display = "none";
		
		if(resultsContainer.style.width = window.viewWidth / 1.2 + "px"){
			resultsContainer.style.marginLeft = (window.viewWidth / 1.2) / -2 + "px";
		}
		resultsContainer.style.height = window.viewHeight / 1.2 + "px";
		
		// Create a div for the eventual iframe
		var resultsSubcontainer = document.createElement('div');
		resultsSubcontainer.id = 'searchReviewsWidgetSubcontainer';
		resultsSubcontainer.style.height = window.viewHeight / 1.2 * 0.97 + "px"

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
		function srGetKeywords(link){
			if (link.rel){
				if (link.rel == null || document.getElementById(link.rel) == null){
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
						var rawString = document.getElementById(link.rel).innerText.toLowerCase();
					}
					else{
						var rawString = document.getElementById(link.rel).textContent.toLowerCase();
					}
				}
			}
			else{
				var rawString = link.getAttribute('keywords');
			}			

			var cleanString = rawString.replace(/reviews/g, "").replace(/review/g, "");
			return encodeURIComponent(cleanString);
		}

		// Show iframe window
		function srResultsWindow(link){
			// Get the query string from the link
			if (link.href.indexOf("?") > -1){
				var qString = link.href.substring(link.href.indexOf("?") + 1) + "&";
			}
			else{
				var qString = '';
			}
			
			// Create another container for the overlay
			var resultsWindow = document.createElement('div');

			// Create the iframe that contains the results
			var resultsIframe = document.createElement('iframe');
			resultsIframe.src = 'http://searchreviews.com/customsearch.jsp?' + qString + 'reviews=' + srGetKeywords(link) + '&pId=' + window.sr_pid + '&domain=' + window.location.hostname;
			// resultsIframe.src = 'sr/results.html';
			// resultsIframe.scrolling = 'no';
			resultsIframe.frameBorder = 0;

			// Add the above element to the overlay
			resultsWindow.appendChild(resultsIframe);
			document.getElementById('searchReviewsWidgetSubcontainer').innerHTML = resultsWindow.innerHTML;

			// Change the "Expand" link to go to the right deep link
			var expandResults = document.getElementById('searchReviewsExpandLink');
			expandResults.href = "http://searchreviews.com/search.jsp?reviews=" + srGetKeywords(link);
		}

		// Trigger the iframe before all else
		resultsLink.onclick = function(){
			srResultsWindow(resultsLink);
			document.getElementById('searchReviewsWidgetContainer').style.display = "block";
			return false;
		}
		
		// Get reviewCount and update the link
		try{
			var request = window.XDomainRequest ? new window.XDomainRequest() : new XMLHttpRequest();
			var url = 'http://searchreviews.com/api/badge?reviews=' + srGetKeywords(resultsLink) + '&time=' + new Date().getTime();
			
			function callbackCheck(){
				if (request.readyState == 4){
					if (request.status == 200){
						callback();
					}
					else{
						// alert("Error: request.readyState=" + request.readyState + ", request.status=" + request.status);
					}
				}
			}
			
			function callback(){
				srJSON = eval('(' + request.responseText + ')');
				if (srJSON.reviewCount > 0){
					var displayCount = srJSON.reviewCount > 100 ? "100+" : srJSON.reviewCount
					resultsLink.innerHTML = 'Found ' + displayCount + ' reviews.';
				}
				else{
					resultsLink.innerHTML = 'Search for reviews.';
					resultsLink.onclick = function(){
						window.location = "http://searchreviews.com";
					}
				}
			}

			if(window.XDomainRequest){
				request.onload = callback;
				request.open("GET", url, true);
			}
			else{
				request.open('GET', url, true);
				request.onreadystatechange = callbackCheck;
			}
			request.send();
		}
		catch (err){ // For browsers before IE8
			resultsLink.onclick = function(){
				srResultsWindow(resultsLink);
				document.getElementById('searchReviewsWidgetContainer').style.display = "block";
				return false;
			}
		}
	}

	// Find SearchReview Widget links and add widget-display functionality to them
	var allSearchReviewsLinks = getElementsByClassName('searchReviewsLink');

	for (var i = allSearchReviewsLinks.length - 1; i >= 0; --i){
		allSearchReviewsLinks[i].onclick = function(){
			return false;
		}
		
		if (document.all){
			allSearchReviewsLinks[i].setAttribute('keywords', allSearchReviewsLinks[i].innerText.toLowerCase());
			if (allSearchReviewsLinks[i].innerText.toLowerCase().indexOf("your keywords") > -1){
				if (!allSearchReviewsLinks[i].rel){
					allSearchReviewsLinks[i].setAttribute('rel', 'nonExistentElement1234');
				}
			}
		}
		else{
			allSearchReviewsLinks[i].setAttribute('keywords', allSearchReviewsLinks[i].textContent.toLowerCase());
			if (allSearchReviewsLinks[i].textContent.toLowerCase().indexOf("your keywords") > -1){
				if (allSearchReviewsLinks[i].rel == null || document.getElementById(allSearchReviewsLinks[i].rel) == null){
					allSearchReviewsLinks[i].setAttribute('rel', 'nonExistentElement1234');
				}
			}
		}
		
		srCreateLink(allSearchReviewsLinks[i]);
	}
	
	fix_flash();
}