function convertToSrt() {
	// Retrieve the JSON string from the first textarea
	let inputText = document.getElementById("input").value;

	// Parse the JSON string to a JavaScript object
	let subtitles = JSON.parse(inputText);

	// Initialize the output string with the SRT file header
	let outputText = "";

	// Loop through each subtitle event and format it as an SRT entry
	for (let i = 0; i < subtitles.events.length; i++) {
		let event = subtitles.events[i];

		// Ignore events without tStartMs or segs properties
		if (!event.tStartMs || !event.dDurationMs) {
			continue;
		}

		let startTime = new Date(event.tStartMs).toISOString().substr(11, 12);
		let endTime = new Date(event.tStartMs + event.dDurationMs).toISOString().substr(11, 12);
		let text = event.segs[0].utf8.replace(/\r\n|\r|\n/g, "\n");
		outputText += (i+1) + "\n" + startTime + " --> " + endTime + "\n" + text + "\n\n";
	}

	// Set the output string as the value of the second textarea
	document.getElementById("output").value = outputText;
	// Store the output string in a global variable for downloadSrt() to use
	window.srtContent = outputText;
}


		function downloadSrt() {
			// Create a new Blob object with the SRT content as its data
			let blob = new Blob([window.srtContent], {type: "text/srt"});

			// Create a new URL object for the Blob object
			let url = window.URL.createObjectURL(blob);

			// Create a new anchor element with the download attribute set to the filename "subtitle.srt"
			let a = document.createElement("a");
			a.href = url;
			a.download = "subtitle.srt";

			// Click the anchor element to initiate the download
			document.body.appendChild(a);
			a.click();

			// Remove the anchor element and URL object from the DOM
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}