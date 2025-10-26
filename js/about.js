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


	// tweet dates
    const tweetDates = tweet_array.map(t => t.time); // gathers the dates

    const earliest = new Date(Math.min(...tweetDates)); 
    const latest = new Date(Math.max(...tweetDates));

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; //turns the dates into strings
    const earliestFormatted = earliest.toLocaleDateString('en-US', options);
    const latestFormatted = latest.toLocaleDateString('en-US', options);

    document.getElementById('firstDate').innerText = earliestFormatted; // span
    document.getElementById('lastDate').innerText = latestFormatted; // span

	// tweet categories
	const tweetCounter = {
		completed_event: 0,
		live_event: 0,
		achievement: 0,
		miscellaneous: 0
	}

	tweet_array.forEach(t => {
		tweetCounter[t.source]++;
	});


	tweet_array = runkeeper_tweets.map(function(tweet) {
    return new Tweet(tweet.text, tweet.created_at);
	});

	console.log("Loaded tweets:", tweet_array.length);
	console.log("First tweet example:", tweet_array[111]);
	console.log("second tweet example:", tweet_array[112]);
	console.log("third tweet example:", tweet_array[3534]);
	console.log("fourth tweet example:", tweet_array[220]);

	const total = tweet_array.length;

	const completedPct = (tweetCounter.completed_event / total) * 100;
	const livePct = (tweetCounter.live_event / total) * 100;
	const achievementPct = (tweetCounter.achievement / total) * 100;
	const miscPct = (tweetCounter.miscellaneous / total) * 100;

	const formatPct = p => math.format(p, { notation: 'fixed', precision: 2 });

	// span
	document.querySelectorAll('.completedEvents')[0].innerText = tweetCounter.completed_event;
	document.querySelector('.liveEvents').innerText = tweetCounter.live_event;
	document.querySelector('.achievements').innerText = tweetCounter.achievement;
	document.querySelector('.miscellaneous').innerText = tweetCounter.miscellaneous;

	document.querySelector('.completedEventsPct').innerText = formatPct(completedPct) + '%';
	document.querySelector('.liveEventsPct').innerText = formatPct(livePct) + '%';
	document.querySelector('.achievementsPct').innerText = formatPct(achievementPct) + '%';
	document.querySelector('.miscellaneousPct').innerText = formatPct(miscPct) + '%';

	// user written tweets
	const userWritten = tweet_array.filter(t => t.written);
	const pctWritten = (userWritten.length / tweet_array.filter(t => t.source === 'completed_event').length) * 100;
	document.querySelectorAll('.completedEvents')[1].innerText = tweetCounter.completed_event;
	document.querySelector('.written').innerText = userWritten.length;
	document.querySelector('.writtenPct').innerText = pctWritten.toFixed(2) + '%';

}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});