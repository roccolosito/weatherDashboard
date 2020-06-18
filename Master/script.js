$(document).ready(function () {

    // var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?APPID=" + apiKey;
    // var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?APPID=" + apiKey;

    // Function to retrieve and set current weather for city
    function todaysWeather(city) {

        var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=85a681bb50b1efa62965db606c2a91cd";
        $.ajax({
            url: currentUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // Constructing HTML containing today's weather info 
            var cityName = $("<h4>").text(response.name);
            var todaysDate = moment().format('LL');
            var weatherImage = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png");
            var currentTemp = $("<p>").text(tempConvertK2F(response.main.temp) + " °F");
            var humidity = $("<p>").text(response.main.humidity);

            // Empty the contents of the 'today' div, append the new weather data
            $("#today").empty();
            $("#today").append(cityName, todaysDate, weatherImage, currentTemp, humidity);

        })
    }

    $('#search-button').click(function (e) {
        console.log('button clicked');
        event.preventDefault();
        var city = $("#search-value").val().trim();
        localStorage.setItem("lastCity", city);
        // $(".list-group").prepend($("<button>").addClass("list-group-item").text(city));
        todaysWeather(city);
    });


    function tempConvertK2F(kelvin) {
        return (((parseFloat(kelvin) - 273.15) * (9/5)) + 32).toFixed(1);
    }
})