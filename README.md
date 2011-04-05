# How it works

## Third-party developer experience
- If someone wants to show SR content on their own website, they come to SR.com to get the widget code:
- They enter their publisher ID, the ID of a page element to find search keywords from, and optionally select some color related options.
- They are then presented with a code snippet, which they copy and paste onto their page.

## The code snippet
This describes how the code snippet interacts with the third-party page.

### 1. Get the keywords for the query
- JS in the snippet finds the DOM element with the provided ID and removes a preset of meaningless words from the element content string. The cleaned string is stored for later use.
- A UID is also stored for later use.

### 2. Get the number of reviews for that query
- Send the cleaned string to a basic search action on SR.com via AJAX.
- Interpret the response to store the number of reviews for later use.

### 3. Display a link to the reviews
- If there are reviews, write a link onto the page that contains the number of reviews and an SR graphic.

### 4. Show a display with the search results
- The previously created link contains a click-trigger to write a `div` onto the page with ID of a format which includes the previously stored UID. The `div` is set to `display: none`.
- Then an `iframe` is inserted into the `div`. The `iframe` source is a search results page for the given query.
- Next, the `div` is given `display: block`.

### 4. The user closes the search results display
- A link inside the search results window contains a trigger to add `display: none` to the `div` containing the `iframe`.
- The next time the link to show the search results is clicked, it checks for the presence of a `div` with ID of a format which includes the previously stored UID. If such a `div` exists, it merely adds `display: block` - instead of repeating the process of creating the `div` and inserting an `iframe`.

If there are no reviews found, the page should degrade gracefully.