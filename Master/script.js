$(document).ready(function () {

    // var apiKey = "85a681bb50b1efa62965db606c2a91cd";
    // var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=85a681bb50b1efa62965db606c2a91cd";
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
            // Constructing HTML containing the today's weather info 
            var cityName = $("<h3>").text(response.name);

            // Empty the contents of the 'today' div, append the new weather data
            $("#today").empty();
            $("#today").append(cityName);

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
        return ((kelvin - 273.15) * 9 / 5) + 32;
    }
})