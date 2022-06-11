var colors = [
	"#6bb8fe",
	"#c5a8ff",
	"#befee8"
];

document.body.style.backgroundImage = "linear-gradient(#bcdfff, " + colors[Math.floor(Math.random() * colors.length)] + ")";

function updateTime() {
	date = Date().split(" ")
	if (document.getElementById("time-weekday").innerHTML.slice(0, 3) != date[0]) {
		document.getElementById("time-weekday").innerHTML = {"Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday"}[date[0]];
	};
	if (document.getElementById("time-month").innerHTML.slice(0, 3) != date[1]) {
		document.getElementById("time-month").innerHTML = {"Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April", "May": "May", "Jun": "June", "Jul": "July", "Aug": "August", "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"}[date[1]];
	};
	if (document.getElementById("time-day").innerHTML != date[2]) {
		document.getElementById("time-day").innerHTML = date[2];
	};
	if (document.getElementById("time-year").innerHTML != date[3]) {
		document.getElementById("time-year").innerHTML = date[3];
	};
	if (document.getElementById("time-hour-minute").innerHTML != date[4].split(":")[0] + ":" + date[4].split(":")[1]) {
		document.getElementById("time-hour-minute").innerHTML = date[4].split(":")[0] + ":" + date[4].split(":")[1];
	};
	if (document.getElementById("time-second").innerHTML != date[4].split(":")[2]) {
		document.getElementById("time-second").innerHTML = date[4].split(":")[2];
	};
};


updateTime();
setInterval(updateTime, 1000);

function updateWeather() {
	let request = new XMLHttpRequest();
	request.open("GET", "https://api.openweathermap.org/data/2.5/weather?units=metric");  // Add token and coordinate query strings
	request.send();
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			response = JSON.parse(request.responseText);
			document.getElementById("weather-temperature").innerHTML = response["main"]["temp"].toFixed(2);
			document.getElementById("weather-temperature").dataset.metric = response["main"]["temp"].toFixed(2);
			document.getElementById("weather-temperature").dataset.imperial = ((parseFloat(response["main"]["temp"]) * 1.8) + 32).toFixed(2);
			document.getElementById("weather-temperature-min").innerHTML = response["main"]["temp_min"].toFixed(2);
			document.getElementById("weather-temperature-min").dataset.metric = response["main"]["temp_min"].toFixed(2);
			document.getElementById("weather-temperature-min").dataset.imperial = ((parseFloat(response["main"]["temp_min"]) * 1.8) + 32).toFixed(2);
			document.getElementById("weather-temperature-max").innerHTML = response["main"]["temp_max"].toFixed(2);
			document.getElementById("weather-temperature-max").dataset.metric = response["main"]["temp_max"].toFixed(2);
			document.getElementById("weather-temperature-max").dataset.imperial = ((parseFloat(response["main"]["temp_max"]) * 1.8) + 32).toFixed(2);
			document.getElementById("weather-humidity").innerHTML = response["main"]["humidity"];
			document.getElementById("weather-wind-speed").innerHTML = response["wind"]["speed"];
			document.getElementById("weather-wind-speed").dataset.metric = response["wind"]["speed"];
			document.getElementById("weather-wind-speed").dataset.imperial = parseFloat(response["wind"]["speed"]) * 2.237;
			document.getElementById("weather-icon").style.backgroundImage = `url(https://openweathermap.org/img/wn/${response["weather"][0]["icon"]}@2x.png)`
		};
	};
};

updateWeather();
setInterval(updateWeather, 600000);

function addNote(text) {
	let element = document.createElement("div");
	element.classList.add("note");
	let text_element = document.createElement("p");
	text_element.innerHTML = text;
	element.appendChild(text_element)
	let remove_button = document.createElement("button");
	remove_button.onclick = function() {
		browser.storage.local.get("notes").then(function(result) {
			let notes = [], found = false;
			for (let x of result["notes"]) {
				if (found) {
					notes.push(x);
					continue;
				};
				if (x == this.parentNode.getElementsByTagName("p")[0].innerHTML) {
					continue;
				};
				notes.push(x);
			};
			browser.storage.local.set({"notes": notes}).then(function() {
				this.parentNode.remove();
				if (!document.getElementById("notes-entries").children.length) {
					document.getElementById("notes-empty").style.display = "block";
				};
			}.bind(this));
		}.bind(this));
	};
	element.appendChild(remove_button);
	document.getElementById("notes-entries").appendChild(element);
};

browser.storage.local.get("notes").then(function(result) {
	if (!Object.entries(result).length) {
		browser.storage.local.set({"notes": ""})
		document.getElementById("notes-empty").style.display = "block";
	} else {
		for (let x of result["notes"]) {
			addNote(x);
		};
		if (!document.getElementById("notes-entries").children.length) {
			document.getElementById("notes-empty").style.display = "block";
		};
	};
});

document.getElementById("notes-input").onkeydown = function(event) {
	if (event.key == "Enter") {
		document.getElementById("notes-empty").style.display = "none";
		browser.storage.local.get("notes").then(function(result) {
			let notes = result["notes"];
			notes.push(document.getElementById("notes-input").value);
			addNote(document.getElementById("notes-input").value)
			browser.storage.local.set({"notes": notes}).then(function() {
				document.getElementById("notes-input").value = "";
			});
		});
	};
};

function toggleTemperatureUnit() {
	if (document.getElementById("weather-temperature-unit").innerHTML == "°C") {
		document.getElementById("weather-temperature").innerHTML = document.getElementById("weather-temperature").dataset.imperial;
		document.getElementById("weather-temperature-min").innerHTML = document.getElementById("weather-temperature-min").dataset.imperial;
		document.getElementById("weather-temperature-max").innerHTML = document.getElementById("weather-temperature-max").dataset.imperial;
		document.getElementById("weather-temperature-min-unit").innerHTML = "°F";
		document.getElementById("weather-temperature-max-unit").innerHTML = "°F";
		document.getElementById("weather-wind-speed").innerHTML = document.getElementById("weather-wind-speed").dataset.imperial;
		document.getElementById("weather-wind-speed-unit").innerHTML = "mph";
		document.getElementById("weather-temperature-unit").innerHTML = "°F";
	} else {
		document.getElementById("weather-temperature").innerHTML = document.getElementById("weather-temperature").dataset.metric;
		document.getElementById("weather-temperature-min").innerHTML = document.getElementById("weather-temperature-min").dataset.metric;
		document.getElementById("weather-temperature-max").innerHTML = document.getElementById("weather-temperature-max").dataset.metric;
		document.getElementById("weather-temperature-min-unit").innerHTML = "°C";
		document.getElementById("weather-temperature-max-unit").innerHTML = "°C";
		document.getElementById("weather-wind-speed").innerHTML = document.getElementById("weather-wind-speed").dataset.metric;
		document.getElementById("weather-wind-speed-unit").innerHTML = "meter/s";
		document.getElementById("weather-temperature-unit").innerHTML = "°C";
	};
};

document.getElementById("weather-temperature-unit").onclick = toggleTemperatureUnit;
document.getElementById("weather-wind-speed-unit").onclick = toggleTemperatureUnit;

if (Date().substring(0, 3) == "Sat") {  // Test date-dependent elements
  let element = document.createElement("button");
  element.dataset.url = "https://google.com";
  element.dataset.name = "Test";
  element.classList.add("site");
  document.getElementById("sites").appendChild(element);
}

for (x of document.getElementsByClassName("site")) {
	x.style.backgroundImage = `url(https://s2.googleusercontent.com/s2/favicons?domain_url=${x.dataset.url})`;
	x.addEventListener("mouseover", function() {
		let title = document.createElement("p");
		title.classList.add("title");
		title.style.width = this.offsetWidth + "px";
		title.innerHTML = this.dataset.name;
		title.style.marginLeft = `-${(this.offsetWidth / 2) + (title.offsetWidth / 2)}px`;
		this.appendChild(title);
	});
	x.addEventListener("mouseout", function() {
		try {
			this.removeChild(this.firstChild);
		} catch { };
	});
	x.addEventListener("click", function() {
		document.location = this.dataset.url;
	});
	x.addEventListener("focus", function() {
		let title = document.createElement("p");
		title.classList.add("title");
		title.style.width = this.offsetWidth + "px";
		title.innerHTML = this.dataset.name;
		title.style.marginLeft = `-${(this.offsetWidth / 2) + (title.offsetWidth / 2)}px`;
		this.appendChild(title);
	});
	x.addEventListener("focusout", function() {
		try {
			this.removeChild(this.firstChild);
		} catch { };
	});
};
