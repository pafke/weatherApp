window.onload = function() {
	"use strict";
	var cityInput = document.getElementById('city'),
		autocomplete = document.getElementById('autocomplete'),
		weatherToday = document.getElementById('weather-today'),
		forecastContainer = document.getElementById('forecast'),
		weatherLocation = document.getElementById('location');

	//Autcomplete script is executed on keyup
	cityInput.onkeyup = function() {
		var cityValue = this.value;
		//Only run autocomplete request when more than 2 characters are typed
		if(cityValue.length > 2) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'http://api.apixu.com/v1/search.json?key=97102d191d9748a09f7192148171104   &q='+cityValue);
			xhr.onload = function() {
			    if (xhr.status === 200) {
			    	var cities = JSON.parse(xhr.responseText);

			    	//Reset previous list
			    	autocomplete.innerHTML = '';

			    	//Append the cities to the HTML
			    	for (var i = 0; i < cities.length; i++) {
			    		autocomplete.innerHTML += '<li class="city-item" data-lat="'+cities[i].lat+'" data-lon="'+cities[i].lon+'">'+cities[i].country+', '+cities[i].name+'</li>';
			    	}

			    	//Attach a click event to the newly generated list of cities
			    	var autocompleteItems = document.getElementsByClassName('city-item');
					for (var i = 0; i < autocompleteItems.length; i++) {
						autocompleteItems[i].onclick = function() {
							showWeatherElements();
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

	function resetAllInput() {
		autocomplete.innerHTML = '';
		cityInput.value = '';
		forecastContainer.innerHTML = '';
	}

	function getWeather(lat, long) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://api.apixu.com/v1/forecast.json?key=97102d191d9748a09f7192148171104   &days=5&q='+lat+','+long);
		xhr.onload = function() {
		    if (xhr.status === 200) {
		    	resetAllInput();
		    	var weather = JSON.parse(xhr.responseText);

		    	var location = weather.location.country+', '+weather.location.name;
		    	weatherLocation.innerHTML = location;
		    	var weatherIcon = weather.current.condition.icon;

		    	//Set the icon for todays weather forecast
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

				//Generate the HTML for the forecast for the next 4 days (start i at 1 to skip today)
		    	var forecast = weather.forecast.forecastday;
		    	for (var i = 1; i < forecast.length; i++) {
		    		var forecastWeatherIcon = forecast[i].day.condition.icon;
		    		forecastContainer.innerHTML += '<li><img src="http:'+forecastWeatherIcon+'"><h4>'+weekday[today+i]+'</h4></li>'
		    	}
		    }
		    else {
		    	console.log(xhr.status);
		    }
		};
		xhr.send();
	}

	function showWeatherElements() {
		//Show the HTML elements that contain the weather
		var hiddenFields = document.getElementsByClassName('weather-overview');
  		for (var i = 0; i < hiddenFields.length; i++) {
  			hiddenFields[i].style.display = 'block';
  		}
	}

	//Request acces to geoLocation via the browser, if this fails or is not accepted, provide an input field for the location
	function getGeoLocation() {
		var geoSuccess = function(position) {
			//Execute the getWeather function
			console.log('Succes');
			showWeatherElements();
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			getWeather(lat, lon);
		};
	  	var geoError = function(error) {
			//Provide an input field with autocomplete to get the location
	  		console.log('Fail');
			console.log(error);
	  		//Show hidden fields
	  		var hiddenFields = document.getElementsByClassName('location-input');
	  		for (var i = 0; i < hiddenFields.length; i++) {
	  			hiddenFields[i].style.display = 'block';
	  		}
		};
	  	navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	};

	getGeoLocation();
	//Refresh function every 10 minutes in case user keeps browserwindow open (or in case of display functionality)
	setInterval(getGeoLocation, 600000);
}