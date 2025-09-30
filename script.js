

const API_KEY = "168771779c71f3d64106d8a88376808a";
const yourWeather = document.querySelector("[yourWeather]");
const searchWeather = document.querySelector("[searchWeather]");
const accessLocation = document.querySelector("[accessLocation]");
const loadingPage = document.querySelector("[loadingPage]");
const searchResult = document.querySelector("[searchResult]");
const searchBar = document.querySelector("[searchBar]")

const errorPage = document.querySelector("[errorPage]");
const errorMessage = document.querySelector("[errorMessage]");
const yourLocation = document.querySelector("[yourLocation]");
const cityName = document.querySelector("[cityName]");
const cards = document.querySelector("[Cards]");

let currentTab = yourWeather ;
currentTab.classList.add("currentTab");
getfromSession()


function setTab(tab)
{
 if(tab !=currentTab)
    {
      currentTab.classList.remove("currentTab");
      currentTab = tab;
      currentTab.classList.add("currentTab");
    
// jab tab Switch hoga tab ye search add hoga 
if(!searchBar.classList.contains("active"))
{
 searchBar.classList.add("active");
 yourWeather.classList.remove("active");
 accessLocation.classList.remove("active");
 searchResult.classList.remove("active");
  cards.classList.remove("active");

}
else
{
    yourWeather.classList.add("active");
    cards.classList.add("active");
    searchBar.classList.remove("active");
    getfromSession();
}
}
}
yourWeather.addEventListener("click" , () =>{
    setTab(yourWeather);
})
searchWeather.addEventListener("click" , () =>{
    setTab(searchWeather);
})
function getfromSession()
{
    accessLocation.classList.add("active");
    const localcoordinates = sessionStorage.getItem("userCoordinates");

    if(!localcoordinates)
    {
        accessLocation.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcoordinates);
        cards.classList.add("active");
        fetchWeatherInfo(coordinates);
    }
    
    
}
async function fetchWeatherInfo(coordinates)
{
 const {lat , lon} = coordinates;
 accessLocation.classList.remove("active");

 loadingPage.classList.add("active");
 
try
{
const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
const data = await response.json();
loadingPage.classList.remove("active");
searchResult.classList.add("active");
 cards.classList.add("active");
renderInfo(data);

}
catch(er)
{
    console.log("error pakda gaya");
loadingPage.classList.remove("active");
errorPage.classList.add("active");
let newMsg = document.createElement('p');
newMsg.innerText = `Something Went wrong \n This occured by ${er}`;
errorMessage.appendChild(newMsg);


// errorMessage.innerText = `Something Went wrong \n This occured by ${er}`;
}

}
function renderInfo(weatherInfo)
{
    let cityName = document.querySelector("[cityName]");
    let countryFlag = document.querySelector("[countryFlag]");
    let weatherDesc = document.querySelector("[weatherDesc]");
    let weatherIcon = document.querySelector("[weatherIcon]");
    let temp = document.querySelector("[temp]");
    let windspeed = document.querySelector("[windspeed]");
    let humidity = document.querySelector("[humidity]");
    let cloudiness = document.querySelector("[cloudiness]");

    cityName.innerText = weatherInfo?.name;
     countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}
const grantAccessButton = document.querySelector("[grantAccess]");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        grantAccessButton.style.display = 'none';
    }
}

function showPosition(position) {
    const userCoordinates = { 
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    console.log(userCoordinates.lat );
    console.log(userCoordinates.lon);
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[searchInput]");
const searchForm = document.querySelector("[searchForm]");

searchForm.addEventListener('submit', (e) =>
{
 const city = searchInput.value;
 e.preventDefault();
if(searchInput.value === ""){ 
    return;
}
fetchSearchInput(city);
console.log(" 1 searched " + searchInput.value);
searchInput.value = ""
});

async function fetchSearchInput(city)
{
    loadingPage.classList.remove("active");
    errorPage.classList.remove("active");
    accessLocation.classList.remove("active");
    loadingPage.classList.add("active");
      

    try{
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

         const data = await response.json();
         loadingPage.classList.remove("active");
         if (data.cod === "404") {
            errorPage.classList.add("active");
        } else {
            searchResult.classList.add("active");
             cards.classList.add("active");
            renderInfo(data);
        }
    }
    catch(er){
        console.log("error pakda gaya");
        loadingPage.classList.remove("active");
        errorPage.classList.add("active");
        let newMsg = document.createElement('p');
        newMsg.innerText = `Something Went wrong \n This occured by ${er}`;
        errorMessage.appendChild(newMsg);
    }
}
