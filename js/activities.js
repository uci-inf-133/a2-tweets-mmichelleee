function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	writtenTweets = tweet_array.filter(t => t.source === 'written');


	const completedTweets = tweet_array.filter(t => t.source === 'completed_event');

	const activityCounts = {};
	completedTweets.forEach(t => {
		const activity = t.activityType;
        if (!activityCounts[activity]) activityCounts[activity] = 0;
        activityCounts[activity]++;
    });

	const activityData = Object.entries(activityCounts).map(([activity, count]) => ({ activity, count }));


    const top3 = Object.entries(activityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([activity]) => activity);

	const top3Data = completedTweets
		.filter(t => top3.includes(t.activityType))
		.map(t => ({
			activity: t.activityType,
			distance: t.distance,
			weekday: t.time.toLocaleDateString('en-US', { weekday: 'long' })
		}));

    const mean = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const aggregatedData = [];
    top3.forEach(act => {
        days.forEach(day => {
            const filtered = top3Data.filter(d => d.activity === act && d.weekday === day);
            aggregatedData.push({
                activity: act,
                weekday: day,
                distance: mean(filtered.map(d => d.distance))
            });
        });
    });



	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
    const activityCountSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "Number of Tweets per activity type",
        data: { values: activityData },
        mark: "bar",
        encoding: {
            x: { field: "activity", type: "ordinal", title: "Activity Type", sort: "-y" },
            y: { field: "count", type: "quantitative", title: "Number of Tweets" }
        }
    };
    vegaEmbed('#activityVis', activityCountSpec, { actions: false });


	const spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		description: "Distance by day of week for top 3 activities",
		data: { name: "tweets" }, 
		mark: { type: "point", tooltip: true },
		encoding: {
			x: { field: "weekday", type: "ordinal", title: "Day of Week" },
			y: { field: "distance", type: "quantitative", title: "Distance (mi)" },
			color: { field: "activity", type: "nominal", title: "Activity Type" }
		}
	};

	const viewPromise = vegaEmbed('#top3Vis', spec, { actions: false });

	viewPromise.then(res => {
		res.view.change('tweets', vega.changeset().insert(top3Data)).run();

		let aggregated = false;
		const btn = document.getElementById('aggregate');
		btn.addEventListener('click', async () => {
			const view = (await viewPromise).view;
			let data, markType;

			if (!aggregated) {
				data = aggregatedData;
				markType = "line";
				btn.innerText = "Show Individual Data";
			} else {
				data = top3Data;
				markType = "point";
				btn.innerText = "Show Aggregate Data";
			}

			view.change('tweets', vega.changeset().remove(() => true).insert(data)).run();
			view.signal('markType', markType);
			aggregated = !aggregated;
		});
	});

    const longest = completedTweets.reduce((a, b) => (a.distance > b.distance ? a : b));
    const shortest = completedTweets.reduce((a, b) => (a.distance < b.distance ? a : b));

    const weekdayDistances = completedTweets.filter(t => t.time.getDay() >= 1 && t.time.getDay() <= 5)
                                            .map(t => t.distance);
    const weekendDistances = completedTweets.filter(t => t.time.getDay() === 0 || t.time.getDay() === 6)
                                            .map(t => t.distance);

	const avgWeekday = mean(weekdayDistances);
	const avgWeekend = mean(weekendDistances);

    document.getElementById('longestActivity').innerText = longest.activityType;
    document.getElementById('shortestActivity').innerText = shortest.activityType;
    document.getElementById('avgWeekday').innerText = avgWeekday.toFixed(2);
    document.getElementById('avgWeekend').innerText = avgWeekend.toFixed(2);

    top3.forEach((act, i) => {
        const elem = document.getElementById(`topActivity${i + 1}`);
        if (elem) elem.innerText = act;
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});