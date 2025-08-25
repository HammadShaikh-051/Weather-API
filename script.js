const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const weatherInfoSection = document.getElementById('weatherInfo');
const notFoundSection = document.getElementById('notFound');
const searchCitySection = document.getElementById('searchCity');

const countryTxt = document.getElementById('countryText');
const tempTxt = document.getElementById('tempText');
const conditionTxt = document.getElementById('conditionText');
const humidityValueTxt = document.getElementById('humidityValueText');
const windValueTxt = document.getElementById('windValueText');
const weatherSummaryImg = document.getElementById('weatherSummaryImg');
const currentDateTxt = document.getElementById('currentDateText');

const forecastItemsContainer = document.getElementById('forecastItemsContainer')

const apiKey = '14353af6917a97ba10df144477dbebd8';

searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

cityInput.addEventListener('keydown', (e)=>{
    if(e.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

async function getFetchData(endPoint, city){
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiURL);
    return response.json();
}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg'
    if(id<=321) return 'drizzle.svg'
    if(id<=531) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg';
}

function getCurrentDate(){
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city);
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection);
        return;
    }
    console.log(weatherData);

    const{
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed},
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s';

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `Img/weather/${getWeatherIcon(id)}`
    
    await updateForecastInfo(city);
    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city){
    const forecastDate = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todaydate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = '';
    forecastDate.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todaydate)){
            updateForecastItems(forecastWeather);
        }
    })
}

function updateForecastItems(weatherData){
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp},
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short',
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div id="forecastItem" class="min-w-20  bg-gray-500 flex flex-col gap-1.5 p-2.5 items-center rounded-xl transition-colors duration-300 ease-in-out hover:bg-gray-400">
            <h5 id="forecastItemDate">${dateResult}</h5>
            <img src="Img/weather/${getWeatherIcon(id)}" id="forecastItemImage" class="w-12 h-12">
            <h5 id="forecastItemTemp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')
    
    section.style.display = 'flex';
}