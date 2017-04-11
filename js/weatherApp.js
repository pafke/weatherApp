window.onload = function() {

	//Return list of cities
	var cityInput = document.getElementById('city');

	var autocomplete = document.getElementById('autocomplete');

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
							autocomplete.innerHTML = '';
							cityInput.value = '';
							var lat = this.getAttribute("data-lat");
							var lon = this.getAttribute("data-lon");
							getWeather(lat, lon);
						}
					}

			    }
			    else {
			    	console.log(xhr.status);
			    }
			};
			xhr.send();
		}
	}

	function getWeather(lat, long) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://api.apixu.com/v1/current.json?key=d6aa19a05ffa47aea5f190826171004&q='+lat+','+long);
		xhr.onload = function() {
		    if (xhr.status === 200) {
		    	var weather = JSON.parse(xhr.responseText);
		    	console.log(weather);
		    	var weatherIcon = weather.current.condition.icon;
		    	console.log(weatherIcon);
		    	var imageContainer = document.getElementById('weather-icon');
		    	imageContainer.innerHTML ='<img src="http:'+weather.current.condition.icon+'">';
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
	  		//Input veld tonen

			console.log('Fail');
			console.log(error);
			switch(error.code) {
				case error.TIMEOUT:
				// The user didn't accept the callout
				console.log('User did not accept callout');
				break;
			}
		};
	  	navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	};

	function startTimer() {
		//Refresh function every 10 minutes in case user keeps browserwindow open
		setInterval(getGeoLocation, 600000);
	}

	//getGeoLocation();

}