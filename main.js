'use strict';

bootcards.init( {
  offCanvasBackdrop : true,
  offCanvasHideOnMainClick : true,
  enableTabletPortraitMode : true,
  disableRubberBanding : true,
  disableBreakoutSelector : 'a.no-break-out'
});


$(document).ready(init);

function init() {
  $('#locateInputPosition').click(inputClicked);
  $('#locateCurrentPosition').click(currentLocationClicked);
  $(".panel").addClass("hidden");
}

var results;

function inputClicked() {
  var input = $('.cityStateInput').val().split(",");
  var UrlCityInput = input[0].replace(/ /g, "_");
  var state = input[1];

  ajaxCalls(state, UrlCityInput);

}

function ajaxCalls(state, UrlCityInput){
  var input = $.ajax("http://api.wunderground.com/api/16b28f8ea83c7f4b/conditions/q/" + state + "/" + UrlCityInput + ".json", {
    timeout: 100000
  })
  input.success(function(data) {
    var inputRadar = $.get("http://api.wunderground.com/api/16b28f8ea83c7f4b/animatedradar/q/" + state + "/" + UrlCityInput + ".json?width=400&height=3500&newmaps=1", {
    })
    inputRadar.success(function(data){
      console.log('radar data: ', data);
      generateRadar(data);
    })
    inputRadar.fail(function(error){
      console.log('error: ', error);
    });
    console.log(data);
    generateCurrentInfo(data);
    var inputForecast = $.get("http://api.wunderground.com/api/16b28f8ea83c7f4b/forecast/q/" + state + "/" + UrlCityInput +".json", {
    })
    inputForecast.success(function(data){
      console.log('Forecast data: ', data);
      generateForecast(data);
    })
    inputForecast.fail(function(error){
      console.log('error: ', error);
    });
  });
  input.fail(function(error) {
    console.log('error:', error);
  });
}

function currentLocationClicked(){
  var autoIP = $.get("http://api.wunderground.com/api/16b28f8ea83c7f4b/geolookup/q/autoip.json", {
  })
  autoIP.success(function(data){
    console.log("success:", data);
    var state = data.location.state;
    var UrlCityInput = data.location.city;
    ajaxCalls(state, UrlCityInput);

  })
  autoIP.fail(function(error){
    console.log("error:", error);
  })

}

function generateCurrentInfo(data){

  var cityState = data.current_observation.display_location.full;
  var tempF = data.current_observation.temp_f
  var weatherImage = data.current_observation.icon_url

  $('#cityStateName').hide().text(cityState).fadeIn();
  $('#current').hide().text(tempF + "°f").fadeIn();

}

function generateRadar(data){

  $('#radar').empty();
  var radarUrl = data.radar.image_url;
  var $img = $('<img>');
  console.log(radarUrl);
  if(!radarUrl){
      $img.attr('src', 'http://img.scoop.it/pvC3_kl-w9T_7ZPtTF8TkIXXXL4j3HpexhjNOf_P3YmryPKwJ94QGRtDb3Sbc6KY').addClass("radarImg").hide().appendTo('#radar').fadeIn(400, "swing");
  }
  $img.attr('src', radarUrl).addClass("radarImg").hide().appendTo('#radar').fadeIn(400, "swing");
}

function generateForecast(data){

  var $image = $("<img>");

  var day = data.forecast.simpleforecast.forecastday;
  $('#dayOne').text(day[0].date.weekday);
  $('#dayTwo').text(day[1].date.weekday);
  $('#dayThree').text(day[2].date.weekday);
  $('#dayFour').text(day[3].date.weekday);

  $('#highOne').text(day[0].high.fahrenheit + "°f");
  $('#highTwo').text(day[1].high.fahrenheit + "°f");
  $('#highThree').text(day[2].high.fahrenheit + "°f");
  $('#highFour').text(day[3].high.fahrenheit + "°f");

  $('#lowOne').text(day[0].low.fahrenheit + "°f");
  $('#lowTwo').text(day[1].low.fahrenheit + "°f");
  $('#lowThree').text(day[2].low.fahrenheit + "°f");
  $('#lowFour').text(day[3].low.fahrenheit + "°f");

  $('#weatherIconOne').attr('src', day[0].icon_url);
  $('#weatherIconTwo').attr('src', day[1].icon_url);
  $('#weatherIconThree').attr('src', day[2].icon_url);
  $('#weatherIconFour').attr('src', day[3].icon_url);

  $(".panel").removeClass("hidden").hide().fadeIn(400);
}
