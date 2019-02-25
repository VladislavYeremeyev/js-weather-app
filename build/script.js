$(function() {
	var $slider = $('.slider-wrapper');
	var $menuItems = $('.days-menu-item');
	var $slides = $('.slide');
	var currentIndex = 0;

	function formatDate(date) {
		var monthNames = [
			"января", "февраля", "марта",
			"апреля", "мая", "июня", "июля",
			"августа", "сентября", "октября",
			"ноября", "декабря"
		];
	
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();
	
		return day + ' ' + monthNames[monthIndex];
	}

	//should be implemented with separate file with city's translations and selection by cityID
	function formatCity(city) {
		var result = '';
		switch(city) {
			case 'Kazan':
				result = 'Казань'
				break;
			default:
				break;
		}

		return result;
	}

	//same here
	function formatWeatherDescription(description) {
		var result = '';
		switch(description) {
			case 'Clouds':
				result = 'Преимущественно облачно'
				break;
			case 'Clear':
				result = 'Преимущественно ясно'
				break;
			case 'Rain':
				result = 'Небольшой дождь'
				break;
			default:
				break;
		}

		return result;
	}

	function placeData(data) {
		for (let i = 0; i < $slides.length; i++) {
			var date = formatDate(data.forecast[i].date);
			switch(i) {
				case(0):
					$slides.eq(i).find('.header__date').text(`Сегодня, ${date} ${data.forecast[i].date.getFullYear()}`);
					break;
				case(1):
					$slides.eq(i).find('.header__date').text(`Завтра, ${date} ${data.forecast[i].date.getFullYear()}`);
					break;
				case(2):
					$slides.eq(i).find('.header__date').text(`Послезавтра, ${date} ${data.forecast[i].date.getFullYear()}`);
					break;
				default:
					break;
			}
			$slides.eq(i).find('.current-weather__description').text(formatWeatherDescription(data.forecast[i].weather.main));
			$slides.eq(i).find('.current-weather__temperature').text(data.forecast[i].degree);
			$slides.eq(i).find('.current-weather__city').text(formatCity(data.city));
			$slides.eq(i).find('.current-weather__icon').find('img').attr("src", `icons/${data.forecast[i].weather.icon}.svg`);
			$menuItems.eq(i).find('.days-menu-item__date').text(date);
			$menuItems.eq(i).find('img').attr("src", `icons/${data.forecast[i].weather.icon}.svg`);
		}
	}

	function apiRequest() {
		var result = {};

		fetch('https://gist.githubusercontent.com/anonymous/feb1b31516f3e36a14b29657701f18d2/raw/eaa544aed7e3bdee37c6caa2a515f1d4c38fbd4f/weather.json')
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				result.city = data.city.name;
				result.forecast = data.list.map(elem => {
					return {
						date: new Date(elem.dt * 1000),
						weather: elem.weather[0],
						degree: Math.round((elem.deg - 32) * 5 / 9) //Fahrenheit to celsius
					}
				});

				placeData(result)
			})
			.catch(function(e) {
				console.log(e);
			});
	}

	apiRequest();

  $('.days-menu-item').click(function() {
		var newIndex = $('.days-menu-item').index(this);

		$menuItems.eq(currentIndex).removeClass('days-menu-item_selected');
		$(this).addClass('days-menu-item_selected');
		
		if (newIndex === 0) {
			$slider.css('transform', `translateX(0)`);
		} else {
			$slider.css('transform', `translateX(-${ 100 * (newIndex) }vw)`);
		}
		currentIndex = newIndex;
	});
});
