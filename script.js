$(document).ready(function () {

    $('#search-button').click(function (e) {
        console.log('button clicked');
        event.preventDefault();
        var city = $("#search-value").val().trim();
        localStorage.setItem("lastCity", city);
        // $(".list-group").prepend($("<button>").addClass("list-group-item").text(city));
        todaysWeather(city);
        setNextFiveDaysForecast(city);
    });

    // Function to retrieve and set current weather for city
    function todaysWeather(city) {

        var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=85a681bb50b1efa62965db606c2a91cd";

        $.ajax({
            url: currentUrl,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            // Constructing HTML containing today's weather info 
            var cityName = $("<h4>").text(response.name);
            console.log(cityName);
            var todaysDate = moment().format('LL');
            var weatherImage = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            var currentTemp = $("<p>").text("Temperature: " + (tempConvertK2F(response.main.temp) + " °F"));
            var humidity = $("<p>").text("Humidity: " + (response.main.humidity));
            // var uvIndex = $("span").text(getUVIndex(response.value));
            var coord = '?lat=' + response.coord.lat + '&lon=' + response.coord.lon;

            // Empty the contents of the 'today' div, append the new weather data
            $("#today").empty();
            $("#today").append(cityName, todaysDate, weatherImage, currentTemp, humidity, getUVIndex(coord));

        })
    }

    function tempConvertK2F(kelvin) {
        return (((parseFloat(kelvin) - 273.15) * (9 / 5)) + 32).toFixed(1);
    }

    function setNextFiveDaysForecast(city){

        var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?APPID=" + city + "&appid=85a681bb50b1efa62965db606c2a91cd";
        $("#forecastTitle").text("5-Day Forecast:");
        $.ajax({
            url: fiveDayUrl,
            method: "GET"
        }).then(function(response){
            var num = 1;
            for(var i = 4; i < response.list.length; i+=8) {
                var dayWeather = response.list[i];
                makeForecastCard(dayWeather, num++);
            }
        });
    }

    function getUVIndex(location) {
        var uvUrl = "https://api.openweathermap.org/data/2.5/uvi" + location + "&appid=85a681bb50b1efa62965db606c2a91cd";
        // var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=85a681bb50b1efa62965db606c2a91cd" + lat + lon;
        // var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?q=" + lat + lon + "&appid=85a681bb50b1efa62965db606c2a91cd";
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            var uvIndex = parseFloat(response.value).toFixed(2);
            var p = $("<p>");
            var span = $("<span>");
            // span.css("background-color", color);
            // span.css("padding", "5px");
            span.text(uvIndex);
            p.append("UV Index: ").append(span);
            $("#today").append(p);
            if(3 >= uvIndex){
                span.addClass("favorable");
            } else if (6 >= uvIndex){
                span.addClass("moderate");
            } else {
                span.addClass("severe");
            }
        })
    }

    function makeForecastCard(dayWeather, cardNum){
        var header = dayWeather.dt_txt.slice(0, 10);
        var card = $("#card"+cardNum).empty();
        card.addClass("card text-white bg-primary mb-3").css("max-width: 18rem");
        var cardHeader = $("<div>").addClass("card-header").text(header);
        var cardBody = $("<div>").addClass("card-body");
        var cardBodyTitle = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+dayWeather.weather[0].icon+".png");
        var tmpF = kelvinToFarenheit(dayWeather.main.temp);
        var cardBodyTemp = $("<p>").addClass("card-text").text("Temp: " + tmpF + " °F");
        var cardBodyHumidity = $("<p>").addClass("card-text").text("Humidity: " + dayWeather.main.humidity + "%");
        card.append(cardHeader);
        card.append(cardBody);
        cardBody.append(cardBodyTitle).append(cardBodyTemp).append(cardBodyHumidity);
    }

})