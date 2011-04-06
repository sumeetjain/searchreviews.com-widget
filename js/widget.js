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

function srCreateLink(elementID){
	// ################
	// INNER FUNCTIONS:
	// ################
	
	// Get a no-nonsense string of keywords
	function srGetKeywords(elementID){
		if (document.all){
			var rawString = document.getElementById(elementID).innerText.toLowerCase();
		}
		else{
			var rawString = document.getElementById(elementID).textContent.toLowerCase();
		}
		var cleanString = rawString.replace(/the/g, "");
		return cleanString;
	}
	
	// Show iframe window
	function srResultsWindow(keywords, UID){	
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
	
	// Create a link to the reviews overlay
	var resultsLink = document.createElement('a');
	resultsLink.className = 'searchReviewsLink';
	resultsLink.href = '#';
	resultsLink.innerHTML = 'Found ## reviews.';
	resultsLink.onclick = function(){
		srResultsWindow(srGetKeywords(elementID), elementID);
		document.getElementById('searchReviewsWidgetContainer').style.display = "block";
		return false;
	}
	
	document.getElementsByTagName('body')[0].appendChild(resultsLink);
}