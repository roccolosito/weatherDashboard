$(document).ready(function () {

    var apiKey = "85a681bb50b1efa62965db606c2a91cd";
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=" + apiKey;
    // var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?APPID=" + apiKey;
    // var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?APPID=" + apiKey;

    $('#search-button').click(function (e) {
        console.log('button clicked');
        event.preventDefault();
        var city = $("#search-value").val();
        // localStorage.setItem("lastCity", city);
        // $(".list-group").prepend($("<button>").addClass("list-group-item").text(city));
        // displayCityInfo(city);
    });

    // Function to retrieve and set current weather for city
    // function todaysWeather(city) {
        $.ajax({
            url: currentUrl,
            method: "GET"
        }).then(function (response) {
            // console.log(currentUrl);
            console.log(response.main.temp);

        })
    // }

    function tempConvertK2F(kelvin) {
        return ((kelvin - 273.15) * 9 / 5) + 32;
    }
})