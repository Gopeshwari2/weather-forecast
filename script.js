const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const locationNameEl = document.getElementById('location-name');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() =>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

function getWeatherDataByCoords(latitude, longitude, locationName) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data, locationName);
        });
}

function fetchWeatherByLocation() {
    const location = document.getElementById('location-input').value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const { lat, lon } = data.coord;
            const locationName = data.name;
            getWeatherDataByCoords(lat, lon, locationName);
        })
        .catch(error => {
            alert('Location not found');
            console.error(error);
        });
}

function showWeatherData(data, locationName) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    locationNameEl.innerHTML = locationName;
    countryEl.innerHTML = `${data.lat}N ${data.lon}E`;

    currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    `;

    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="https://apps.ostewart.com/assets/img/weather-logo.png" height="100px" width="100px" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `;
        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="https://apps.ostewart.com/assets/img/weather-logo.png" height="100px" width="100px" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `;
        }
    });

    weatherForecastEl.innerHTML = otherDayForecast;
}


