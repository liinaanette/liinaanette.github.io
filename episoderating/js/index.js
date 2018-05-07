var endpoint = "https://www.omdbapi.com/?apikey=ac2fa28d&t=";
let arr = [];
var title;
let rating;

var titleInput = document.getElementById("Title");
titleInput.addEventListener("keydown", function(e) {
	if (e.keyCode === 13) {
		//checks whether the pressed key is "Enter"
		GETRequest();
	}
});

$(document).ready(GETRequest);
function GETRequest() {
	arr = [];
// Gets title from input and searches it from imdb
	title = document.getElementById("Title").value;
	$.getJSON(endpoint + title, parseData);
}

function parseData(data) {
	// If type is not series, then cannot look for seasons. So don't allow it
	if (data.Type != 'series') {
		alert("Not a series");
		document.getElementById("Title").value = "";
		return;
	}
	rating = data.imdbRating;
	var totalSeasons = data.totalSeasons;
	console.log("total seasons:" + totalSeasons);
	for (var index = 1; index <= totalSeasons; index++) {
		arr[index - 1] = [];
		$.getJSON(endpoint + title + "&Season=" + index, addDataToArr);
	}
	timeout(draw);
	timeout(getTen);
	console.log(arr);
}

function addDataToArr(data) {
	var season = data.Season;
	var episode_nr = data.Episodes.length;
	for (let index = 0; index < episode_nr; index++) {
		arr[season - 1][index] = [
			data.Episodes[index].imdbRating,
			data.Episodes[index].Title,
			data.Episodes[index].imdbID
		];
	}
}

function timeout(functionToDo) {
	setTimeout(functionToDo, 1000);
}

function draw() {
	var colors = [
		"#f44336",
		"#03a9f4",
		"#e91e63",
		"#8bc34a",
		"#673ab7",
		"#ff5722",
		"#009688",
		"#cddc39",
		"#2196f3",
		"#4caf50"
	];
	var ratings = [];
	var titles = [];
	for (var i = 0; i < arr.length; i++) {
		ratings[i] = [];
		if (arr[i].length > titles.length) {
			for (var j = 0; j < arr[i].length; j++) {
				titles[j] = j + 1;
			}
		}
		for (var a = 0; a < arr[i].length; a++) {
			var rating = arr[i][a][0];
			var index = arr[i][a][1];
			ratings[i].push(parseFloat(rating));
		}
	}

	var dataSets = [];
	for (i = 0; i < ratings.length; i++) {
		dataSets[i] = {
			label: "Season " + (i + 1),
			data: ratings[i],
			borderWidth: 1,
			fill: false,
			borderColor: colors[i],
			backgroundColor: colors[i]
		};
	}

	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: titles,
			datasets: dataSets
		},
		options: {
			legend: {
				onHover: function(e) {
         			e.target.style.cursor = 'pointer';
      			},
				onClick: function(e, legendItem) {
					console.log("here lol");
					var index = legendItem.datasetIndex;
					var ci = this.chart;
					var alreadyHidden =
						ci.getDatasetMeta(index).hidden === null ? false
							: ci.getDatasetMeta(index).hidden;

					ci.data.datasets.forEach(function(e, i) {
						var meta = ci.getDatasetMeta(i);
						console.log(meta);

						if (i !== index) {
							if (!alreadyHidden) {
								meta.hidden = meta.hidden === null ? !meta.hidden : null;
							} else if (meta.hidden === null) {
								meta.hidden = true;
							}
						} else if (i === index) {
							meta.hidden = null;
						}
					});

					ci.update();
				}
			},
			scales: {
				xAxes: [
					{
						display: true,
						scaleLabel: {
							display: true,
							labelString: "Episode index"
						}
					}
				],
				yAxes: [
					{
						display: true,
						scaleLabel: {
							display: true,
							labelString: "Episode rating"
						}
					}
				]
			}
		}
	});
}

function getTen() {
	$("#seriesRatingTitle").html("Series rating: ");
	$("#seriesRating").html(rating);
	console.log(rating);
	var arrCopy = [];
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			arrCopy.push(arr[i][j]);
		}
	}
	console.log("Here is copy of arr: " + arrCopy);
	arrCopy.sort(function(a, b) {
		return b[0] - a[0];
	});

	var html = '<h1 id="topTenTitle">Top ten: </h1><ol>';
	var episodes = 10;
	if (arrCopy.length < 10) {
		episodes = arrCopy.length;
	}
	for (i = 0; i < episodes; i++) {
		html +=
			'<li><a target="_blank" href="https://imdb.com/title/' +
			arrCopy[i][2] +
			'">' +
			arrCopy[i][1] +
			": " +
			arrCopy[i][0] +
			"</a></li>";
	}
	html += "</ol>";

	$("#topTen").html(html);
}