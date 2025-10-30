class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const textLower = this.text.toLowerCase();

        if (textLower.startsWith("just completed") || textLower.startsWith("just posted")) {
            return "completed_event";
        } else if (textLower.startsWith("watch my run")) {
            return "live_event";
        } else if (textLower.includes("achieved") || textLower.includes("set a goal") || textLower.includes("goal completed")) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source !== "completed_event") {
            return false;
        }

        let t = this.text;

        t = t.replace(/just completed .*? with @runkeeper\. check it out! /i, '');
        t = t.replace(/https?:\/\/\S+/g, '');
        t = t.replace(/#\w+/g, '');
        t = t.trim();
        return t.length > 0;

    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let t = this.text;
        t = t.replace(/just completed .*? with @runkeeper\. check it out! /i, '');
        t = t.replace(/https?:\/\/\S+/g, '');
        t = t.replace(/#\w+/g, '');
        return t.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let textLower = this.text.toLowerCase();
        const activities = ["run", "walk", "bike", "hike", "swim", "yoga", "elliptical", "ski"];
        for (const activity of activities) {
            if (textLower.includes(` ${activity} `) || textLower.includes(` ${activity} with `)) {
                return activity;
            }
        }
        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const match = this.text.match(/([\d\.]+)\s*(km|mi)/i);
        if (!match) {
            return 0;
        }
        let value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        if (unit == 'km') {
            value *= 0.621371;
        }
        return value;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    const urlMatch = this.text.match(/https?:\/\/\S+/);
    const activityURL = urlMatch ? urlMatch[0] : "#";

    const safeText = this.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `
        <tr>
            <td>${rowNumber}</td>
            <td>${safeText}</td>
            <td>${this.source}</td>
            <td>${this.activityType}</td>
            <td>${this.distance.toFixed(2)} mi</td>
            <td><a href="${activityURL}" target="_blank">View Activity</a></td>
        </tr>
    `;
    }
}