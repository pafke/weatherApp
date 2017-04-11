window.onload = function() {

	var cityInput = document.getElementById('city'),
		autocomplete = document.getElementById('autocomplete'),
		weatherToday = document.getElementById('weather-today'),
		forecastContainer = document.getElementById('forecast'),
		weatherLocation = document.getElementById('location');

	function resetAllInput() {
		autocomplete.innerHTML = '';
		cityInput.value = '';
		forecastContainer.innerHTML = '';
	}

	cityInput.onkeyup = function() {
		var cityValue = this.value;
		if(cityValue.length > 2) {

			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://api.apixu.com/v1/search.json?key=d6aa19a05ffa47aea5f190826171004&q='+cityValue);
			xhr.onload = function() {
			    if (xhr.status === 200) {
			    	var cities = JSON.parse(xhr.responseText);
			    	autocomplete.innerHTML = '';
			    	for (var i = 0; i < cities.length; i++) {
			    		autocomplete.innerHTML += '<li class="city-item" data-lat="'+cities[i].lat+'" data-lon="'+cities[i].lon+'">'+cities[i].country+', '+cities[i].name+'</li>';
			    	}

			    	var autocompleteItems = document.getElementsByClassName('city-item');

					for (var i = 0; i < autocompleteItems.length; i++) {
						autocompleteItems[i].onclick = function() {
							resetAllInput();
							var lat = this.getAttribute("data-lat");
							var lon = this.getAttribute("data-lon");
							getWeather(lat, lon);
						}
					}
			    }
			    else {
			    	console.log("Different xhr.status:");
			    	console.log(xhr.status);
			    }
			};
			xhr.send();
		}
	}

	function getWeather(lat, long) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://api.apixu.com/v1/forecast.json?key=d6aa19a05ffa47aea5f190826171004&days=5&q='+lat+','+long);
		xhr.onload = function() {
		    if (xhr.status === 200) {
		    	resetAllInput();
		    	var weather = JSON.parse(xhr.responseText);

		    	var location = weather.location.country+', '+weather.location.name
		    	weatherLocation.innerHTML = location;
		    	console.log(weather);
		    	var weatherIcon = weather.current.condition.icon;
		    	weatherToday.innerHTML ='<img src="http:'+weather.current.condition.icon+'">';

		    	var d = new Date();
				var today = d.getDay();

				var weekday = new Array(7);
					weekday[0] =  "Sunday";
					weekday[1] = "Monday";
					weekday[2] = "Tuesday";
					weekday[3] = "Wednesday";
					weekday[4] = "Thursday";
					weekday[5] = "Friday";
					weekday[6] = "Saturday";

		    	var forecast = weather.forecast.forecastday;
		    	for (var i = 1; i < forecast.length; i++) {
		    		var forecastWeatherIcon = forecast[i].day.condition.icon;
		    		forecastContainer.innerHTML += '<li><h4>'+weekday[today+i]+'</h4><img src="http:'+forecastWeatherIcon+'"></li>'
		    	}
		    }
		    else {
		    	console.log(xhr.status);
		    }
		};
		xhr.send();
	}

	function getGeoLocation() {
		var geoSuccess = function(position) {
			console.log('Succes');
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			getWeather(lat, lon);
			startTimer();
		};
	  	var geoError = function(error) {
	  		console.log('Fail');
			console.log(error);
	  		//Show hidden fields
	  		var hiddenFields = document.getElementsByClassName('hide');
	  		for (var i = 0; i < hiddenFields.length; i++) {
	  			hiddenFields[i].style.display = 'block';
	  		}
		};
	  	navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	};

	function startTimer() {
		//Refresh function every 10 minutes in case user keeps browserwindow open
		setInterval(getGeoLocation, 600000);
	}

	getGeoLocation();

}