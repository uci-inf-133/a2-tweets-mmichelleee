function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

    const tweetDates = tweet_array.map(t => t.time); // gathers the dates

    const earliest = new Date(Math.min(...tweetDates)); 
    const latest = new Date(Math.max(...tweetDates));

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; //turns the dates into strings
    const earliestFormatted = earliest.toLocaleDateString('en-US', options);
    const latestFormatted = latest.toLocaleDateString('en-US', options);

    document.getElementById('firstDate').innerText = earliestFormatted; // span
    document.getElementById('lastDate').innerText = latestFormatted; // span
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});