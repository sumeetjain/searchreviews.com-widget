function srCreateLink(elementID){
	// ################
	// INNER FUNCTIONS:
	// ################
	
	// Get a no-nonsense string of keywords
	function srGetKeywords(elementID){
		var rawString = document.getElementById(elementID).innerHTML.toLowerCase(); // This needs to be innerText()
		var cleanString = rawString.replace(/the/g, "");
		return cleanString;
	}
	
	// Show iframe window
	function srResultsWindow(keywords, UID){	
		// If the results have already been shown
		if (document.getElementById('searchReviewsWidget_' + UID)){
			document.getElementById('searchReviewsWidget_' + UID).style.display = 'block';
		}
		// Else the results are being shown for the first time
		else{
			// Create the container for the overlay
			var resultsWindow = document.createElement('div');
			resultsWindow.className = 'searchReviewsWidget';
			resultsWindow.id = 'searchReviewsWidget_' + UID;

			// Create the iframe that contains the results
			var resultsIframe = document.createElement('iframe');
			// resultsIframe.src = 'http://searchreviews.com/customsearch.jsp?reviews=' + keywords;
			resultsIframe.src = 'sr/results.html?' + keywords;
			resultsIframe.scrolling = 'no';
			resultsIframe.frameBorder = 0;

			// Create the Close Overlay link
			function closeResults(){
				resultsWindow.style.display = "none";
			}
			var resultsClose = document.createElement('a');
			resultsClose.className = 'searchReviewsCloseLink';
			resultsClose.innerHTML = "Close";
			resultsClose.onclick = closeResults;

			// Add the above elements to the page
			resultsWindow.appendChild(resultsClose);
			resultsWindow.appendChild(resultsIframe);
			document.getElementsByTagName('body')[0].appendChild(resultsWindow);
		}
	}
	
	// Create a link to the reviews overlay
	var resultsLink = document.createElement('a');
	resultsLink.className = 'searchReviewsLink';
	resultsLink.href = '#';
	resultsLink.innerHTML = 'Found ## reviews.';
	resultsLink.onclick = function(){
		srResultsWindow(srGetKeywords(elementID), elementID);
		return false;
	}
	
	document.getElementsByTagName('body')[0].appendChild(resultsLink);
}