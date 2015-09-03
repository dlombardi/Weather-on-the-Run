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
  $('.forecast').empty();
  var input = $('.cityStateInput').val().split(",");
  var UrlCityInput = input[0].replace(/ /g, "_");
  var state = input[1];

  ajaxCalls(state, UrlCityInput);

}

function currentLocationClicked(){
  $('.forecast').empty();
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
  } else {
    $img.attr('src', radarUrl).addClass("radarImg").hide().appendTo('#radar').fadeIn(400, "swing");
  }
}

function ajaxCalls(state, UrlCityInput){
  var input = $.ajax("http://api.wunderground.com/api/16b28f8ea83c7f4b/conditions/q/" + state + "/" + UrlCityInput + ".json", {
    timeout: 10000
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

function generateForecast(data){

  var $image = $("<img>");
  var $tableRow = $('<tr>');

  var day = data.forecast.simpleforecast.forecastday;

  var dayOne = $('<tr>').attr('id','dayOne').append($('<td>').text(day[0].date.weekday),
  $('<td>').append($("<img>").attr('src', day[0].icon_url)),
  $('<td>').text(day[0].high.fahrenheit + "°f"),
  $('<td>').text(day[0].low.fahrenheit + "°f"));

  var dayTwo = $('<tr>').attr('id','dayTwo').append($('<td>').text(day[1].date.weekday),
  $('<td>').append($("<img>").attr('src', day[1].icon_url)),
  $('<td>').text(day[1].high.fahrenheit + "°f"),
  $('<td>').text(day[1].low.fahrenheit + "°f"));
  // //
  var dayThree = $('<tr>').attr('id','dayThree').append($('<td>').text(day[2].date.weekday),
  $('<td>').append($("<img>").attr('src', day[2].icon_url)),
  $('<td>').text(day[2].high.fahrenheit + "°f"),
  $('<td>').text(day[2].low.fahrenheit + "°f"));
  //
  var dayFour = $('<tr>').attr('id','dayFour').append($('<td>').text(day[3].date.weekday),
  $('<td>').append($("<img>").attr('src', day[3].icon_url)),
  $('<td>').text(day[3].high.fahrenheit + "°f"),
  $('<td>').text(day[3].low.fahrenheit + "°f"));

  $('.forecast').append(dayOne,dayTwo,dayThree,dayFour);


  $(".panel").removeClass("hidden").hide().fadeIn(400);
}
