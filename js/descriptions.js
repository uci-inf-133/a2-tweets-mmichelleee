function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	allTweets = runkeeper_tweets.map(t => new Tweet(t.text, t.time));

    writtenTweets = allTweets.filter(t => t.written);
}


function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById('textFilter');
    const searchCount = document.getElementById('searchCount');
    const searchText = document.getElementById('searchText');
    const tableBody = document.getElementById('tweetTable');

    searchBox.addEventListener('input', function() {
        const query = searchBox.value.trim().toLowerCase();

        if (query === "") {
            tableBody.innerHTML = "";
            searchCount.textContent = "0";
            searchText.textContent = "";
            return;
        }

        const matches = writtenTweets.filter(t => t.writtenText.toLowerCase().includes(query));

        searchCount.textContent = matches.length;
        searchText.textContent = query;

        tableBody.innerHTML = "";
        matches.forEach((tweet, i) => {
            const urlMatch = tweet.text.match(/https?:\/\/\S+/);
            const activityURL = urlMatch ? urlMatch[0] : "#";
            const safeText = tweet.writtenText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            const row = `
                <tr>
                    <td>${i + 1}</td>
                    <td>${tweet.activityType}</td>
                    <td><a href="${activityURL}" target="_blank">${safeText}</a></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});