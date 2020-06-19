$(document).ready(function () {

    $('#search-button').click(function (e) {
        // console.log('button clicked');
        event.preventDefault();
        var city = $("#search-value").val().trim();
        localStorage.setItem("lastCity", city);
        $(".list-group").prepend($("<button>").addClass("list-group-item").text(city));
        displayCityInfo(city);
    });

    $(document).on("click", ".list-group-item", function () {
        var city = $(this).text();
        localStorage.setItem("lastCity", city);
        displayCityInfo(city);
    });

    function displayCityInfo(city) {
        todaysWeather(city);
        setNextFiveDaysForecast(city);
    }

    // Function to retrieve and set current weather for city
    function todaysWeather(city) {

        var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=85a681bb50b1efa62965db606c2a91cd";

        $.ajax({
            url: currentUrl,
            method: "GET"
        }).then(function (response) {
            //Empty contents of 'today' div
            $("#today").empty();

            //Create and append card for today's current weather
            var todayCard = $('<div>').attr('class', 'card');
            $('#today').append(todayCard);
            var cityName = $("<h4>").attr('class', 'card-header').text(response.name);
            var todaysDate = moment().format('LL');
            var weatherImage = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png").css('display', 'inline');
            todayCard.append(cityName);
            cityName.append("<br>" + todaysDate, weatherImage);
            var cardBody = $('<div>').attr({ class: 'card-body', id: 'uv-value' });
            todayCard.append(cardBody);
            var currentTemp = $("<p>").attr('class', 'card-text').text("Temperature: " + (tempConvertK2F(response.main.temp) + " °F"));
            var humidity = $("<p>").attr('class', 'card-text').text("Humidity: " + (response.main.humidity));
            var coord = '?lat=' + response.coord.lat + '&lon=' + response.coord.lon;
            cardBody.append(currentTemp, humidity);

            //Call function to retrieve the UV index
            getUVIndex(coord);

        });
        //Call function to retrieve 5-Day forecast
        setNextFiveDaysForecast(city);
    };

    function tempConvertK2F(kelvin) {
        return (((parseFloat(kelvin) - 273.15) * (9 / 5)) + 32).toFixed(1);
    }

    function setNextFiveDaysForecast(city) {
        var fiveDayUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&appid=85a681bb50b1efa62965db606c2a91cd";
        $("#forecastTitle").text("5-Day Forecast:");
        $.ajax({
            url: fiveDayUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var num = 1;
            for (var i = 4; i < response.list.length; i += 8) {
                var dayWeather = response.list[i];
                makeForecastCard(dayWeather, num++);
            }
        });
    }

    function getUVIndex(location) {
        var uvUrl = "https://api.openweathermap.org/data/2.5/uvi" + location + "&appid=85a681bb50b1efa62965db606c2a91cd";
        $.ajax({
            url: uvUrl,
            method: "GET"
        }).then(function (response) {
            // console.log(response)
            var uvIndex = parseFloat(response.value).toFixed(2);
            var p = $("<p>");
            var span = $("<span>");
            span.text(uvIndex);
            p.append("UV Index: ").append(span);
            $("#uv-value").append(p);
            if (3 >= uvIndex) {
                span.addClass("favorable");
            } else if (6 >= uvIndex) {
                span.addClass("moderate");
            } else {
                span.addClass("severe");
            }
        });
    };

    function makeForecastCard(dayWeather, cardNum) {
        var header = dayWeather.dt_txt.slice(0, 10);
        var card = $("#card" + cardNum).empty();
        card.addClass("card text-white bg-primary mb-3").css("max-width: 18rem");
        var cardHeader = $("<div>").addClass("card-header").text(header);
        var cardBody = $("<div>").addClass("card-body");
        var cardBodyTitle = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dayWeather.weather[0].icon + ".png");
        var tmpF = tempConvertK2F(dayWeather.main.temp);
        var cardBodyTemp = $("<p>").addClass("card-text").text("Temp: " + tmpF + " °F");
        var cardBodyHumidity = $("<p>").addClass("card-text").text("Humidity: " + dayWeather.main.humidity + "%");
        card.append(cardHeader);
        card.append(cardBody);
        cardBody.append(cardBodyTitle).append(cardBodyTemp).append(cardBodyHumidity);
    }

    // Retrieve search history for city
    var lastCity = localStorage.getItem("lastCity");
    if (lastCity != undefined) {
        displayCityInfo(lastCity);
    }

})