$(document).ready(fullweather());

function fullweather() {
	var metric = metricOrImperial();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showCurrentWeather);
	}

	function showCurrentWeather(position) {
		var currEndpoint =
			"https://api.openweathermap.org/data/2.5/weather?APPID=10e93b5c764dc718f64707765afe9003&lat=" +
			position.coords.latitude +
			"&lon=" +
			position.coords.longitude +
			"&units=" +
			metric;
		$.get(currEndpoint, function(data) {
			var x = document.getElementById("weather");
			var html = "";
			var sunrise = data.sys.sunrise;
			var sunset = data.sys.sunset;
			var day = dayOrNight(sunrise, sunset);
			var icon = animatedGetSVGUrl(data.weather[0].main.toLowerCase(), day);
			console.log(data.weather[0].main);

			html += '<img id="icon" src="' + icon + '"</img>';
			html += '<h1 class="display-4">' + data.main.temp;
			if (metric === "metric") {
				html += "°C, " + data.weather[0].description + "</h1>";
			} else {
				html += "°F, " + data.weather[0].description + "</h1>";
			}
			html += '<p id="location">' + data.name + ", " + data.sys.country + "</p>";

			$("#weather").html(html);
		});

		var forecastEndpoint =
			"https://api.openweathermap.org/data/2.5/forecast?APPID=10e93b5c764dc718f64707765afe9003&lat=" +
			position.coords.latitude +
			"&lon=" +
			position.coords.longitude +
			"&units=" +
			metric;
		console.log(forecastEndpoint);
		$.get(forecastEndpoint, function(data) {
			$("#today").html("<h1>Today</h1>");
			$("#tomorrow").html("<h1>Tomorrow</h1>");
			$("#other").html("<h1>Day after tomorrow</h1>");
			var all = data.list;
			for (var i = 0; i < all.length; i++) {
				var html = "";
				var fcDate = new Date(all[i].dt_txt);
				var today = new Date();
				if (fcDate.getDate() - today.getDate() <= 2) {
					console.log(fcDate.getDate());
					var image = staticGetSVGUrl(
						all[i].weather[0].main.toLowerCase(),
						dayOrNightTime(fcDate.getHours())
					);
					html += '<div class="row text-center"><p class="col-2"  style="margin-top: 3%">'+fcDate.getHours()+":"+fcDate.getMinutes()+"0 "+'</p><img class="col-1" id="icon" src="' + image + '"</img>';
					if (metric === 'metric') {
						html +=
						'<p class="col-md-6" style="margin-top: 3%">' + all[i].main.temp + "°C, " + all[i].weather[0].description + "</p></div>";
					} else {
						html +=
						'<p class="col-md-6" style="margin-top: 3%">' + all[i].main.temp + "°F, " +all[i].weather[0].description +  "</p></div>";
					}
					
					switch (fcDate.getDate() - today.getDate()) {
						case 0:
							$("#today").append(html);
							break;
						case 1:
							$("#tomorrow").append(html);
							break;
						case 2:
							$("#other").append(html);
					}
				}
			}
		});
	}

	function animatedGetSVGUrl(weathercondition, day) {
		var url = "https://www.dropbox.com/s/";
		var conditions_day = {
			"clear sky": "ouu61t3tlxmim5y/day.svg?raw=1",
			"few clouds": "waosq51u6glet8p/cloudy-day-1.svg?raw=1",
			"scattered clouds": "cqiw8txh3yin7n5/cloudy-day-3.svg?raw=1",
			"broken clouds": "iwiln5ls2fa9qjh/cloudy.svg?raw=1",
			"shower rain": "xar2acq2p6ytghn/rainy-7.svg?raw=1",
			rain: "qpwasv6me2syn1x/rainy-3.svg?raw=1",
			thunderstorm: "xrzsfefxcgi6t0s/thunder.svg?raw=1",
			snow: "rnuou22id1umral/snowy-6.svg?raw=1",
			clouds: "cqiw8txh3yin7n5/cloudy-day-3.svg?raw=1",
			clear: "ouu61t3tlxmim5y/day.svg?raw=1"
		};
		var conditions_night = {
			"clear sky": "fflq8bdrxi5d7ue/night.svg?raw=1",
			"few clouds": "rwpbp02d5t8pj1j/cloudy-night-1.svg?raw=1",
			"scattered clouds": "10krabl8eli132b/cloudy-night-3.svg?raw=1",
			"broken clouds": "iwiln5ls2fa9qjh/cloudy.svg?raw=1",
			"shower rain": "xar2acq2p6ytghn/rainy-7.svg?raw=1",
			rain: "gksgun2eeclkpu7/rainy-4.svg?raw=1",
			thunderstorm: "xrzsfefxcgi6t0s/thunder.svg?raw=1",
			snow: "rnuou22id1umral/snowy-6.svg?raw=1",
			clouds: "10krabl8eli132b/cloudy-night-3.svg?raw=1",
			clear: "fflq8bdrxi5d7ue/night.svg?raw=1"
		};

		if (day) {
			url += conditions_day[weathercondition];
		} else {
			url += conditions_night[weathercondition];
		}
		return url;
	}

	function staticGetSVGUrl(weathercondition, day) {
		var url = "https://www.dropbox.com/s/";
		var conditions_day = {
			"clear sky": "dir9mhcpy0rg0se/day.svg?raw=1",
			"few clouds": "xebud2kr4jv2lk1/cloudy-day-1.svg?raw=1",
			"scattered clouds": "qn5pln1m8ewrp02/cloudy-day-2.svg?raw=1",
			"broken clouds": "l4im6q8dw21lbdu/cloudy.svg?raw=1",
			"shower rain": "bbbwnbwxj6wxo8l/rainy-7.svg?raw=1",
			rain: "kdaffftsja1hlyg/rainy-3.svg?raw=1",
			thunderstorm: "xiuwd84ol4kzqi2/thunder.svg?raw=1",
			snow: "o9hjt8pfny5xeft/snowy-6.svg?raw=1",
			clouds: "l4im6q8dw21lbdu/cloudy.svg?raw=1",
			clear: "dir9mhcpy0rg0se/day.svg?raw=1"
		};
		var conditions_night = {
			"clear sky": "erxbu2dbzpgkv21/night.svg?raw=1",
			"few clouds": "wrk01vrvojndwxc/cloudy-night-1.svg?raw=1",
			"scattered clouds": "xrc5ibhq3d5zd8k/cloudy-night-3.svg?raw=1",
			"broken clouds": "l4im6q8dw21lbdu/cloudy.svg?raw=1",
			"shower rain": "bbbwnbwxj6wxo8l/rainy-7.svg?raw=1",
			rain: "kdaffftsja1hlyg/rainy-3.svg?raw=1",
			thunderstorm: "xiuwd84ol4kzqi2/thunder.svg?raw=1",
			snow: "o9hjt8pfny5xeft/snowy-6.svg?raw=1",
			clouds: "xrc5ibhq3d5zd8k/cloudy-night-3.svg?raw=1",
			clear: "erxbu2dbzpgkv21/night.svg?raw=1"
		};

		if (day) {
			url += conditions_day[weathercondition];
		} else {
			url += conditions_night[weathercondition];
		}
		return url;
	}

	function dayOrNight(sunrise, sunset) {
		var currDate = new Date();
		var currTime = currDate.getTime();

		if (new Date(currTime) < new Date(sunset)) {
			console.log(sunrise, sunset, currTime);
			return true;
		}

		return false;
	}

	function dayOrNightTime(time) {
		if ([21, 0, 3].includes(time)) {
			return false;
		} else {
			return true;
		}
	}

	function metricOrImperial() {
		var checkBox = document.getElementById("toggly");
		if (checkBox.checked) {
			return "metric";
		} else {
			return "imperial";
		}
	}
}