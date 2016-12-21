var click=0;
var artistName;

$(document).on("pagecontainershow", function( event, ui ) {
    var toPage = ui.toPage[0].id;
    if(toPage=="frontpage"){
      eventsToday();
      getArtist();
    }else if(toPage=="addEvent"){
      comingEvents();
    }
 });

$("#searchArtistBTN").on("tap", function() {                     //Search artist button
    $("#gigs").html("");
    getArtist();
    $("#artistNameInput").focus();
});

function getArtist() {                                          //find artist by name
    artistName=$("#artistNameInput").val().trim().replace(/\s+/g, '%20').replace(/\//g, ' ').replace(/\?/g, ' ');

    $.ajax({                                                    //json-query
        type: "GET",
        url: "http://api.bandsintown.com/artists/"+artistName+"/events.json?api_version=2.0&app_id=harjoitustyo",
        dataType: "json",
        timeout: 5000
    })
      .done (function(data){                                    //search results
          $("#artistSearch").html("");
          var jVar;
          if(data.length == 0){                                 //no gigs
            $("#gigs").append("<tr>" + "<td>" + "Artist doesn't have any upcoming tour dates." + "</td>" + "</tr>");
          }

          $.each(data, function(index) {                      //json-variables
            var jDateTime = data[index].datetime;
            var jDate = jDateTime.substring(0,10);            //date slicing
            var arrD = jDate.split("-");

            $("#gigs").append("<tr>");                        //json-variables display
            $("#gigs").append("<td style='display:none;'>" + data[index].artists[0].name + "</td>");
            $("#gigs").append("<td>" + data[index].venue.name + "</td>");
            $("#gigs").append("<td>" + data[index].formatted_location + "</td>");
            $("#gigs").append("<td>" + arrD[2] + "/" + arrD[1] + "/" + arrD[0] + "</td>");
            $("#gigs").append("<td>" + "<button class='addJsonBTN' id='addJson_"+data[index].id+"' style='background-color: #0088CC; opacity: 0.6; border-radius: 10px'>" +"Add" + "</button>" +"</td>");
            $("#gigs").append("/<tr>");
          });

          $.each(arr, function(index) {
            $("#artistSearch").append(arr[index]);
          });
          $("#artistSearch").html(output).listview("refresh");
        })
        .fail (function() {
              $("#artistSearch").append("Artist data not available. Please, try again later.");
        });
}

$("#addEventBTN").on("tap", function() {                      //add own event

    $.ajax({
        type: 'POST',                                       //insert into database
            data: $("#newEventFRM").serialize(),
            url: 'http://proto387.haaga-helia.fi/~a1501078/backend/insert_event.php',
            success: function(data){
                alert('Your data was successfully added');
                $("#event, #venue, #city, #time").val("");
            },
            error: function(){
                alert('There was an error adding your data');
            }
      });
});


$("#pastEventsBTN").on("tap", function() {                        //show past events

    if(click == 0) {                                              //show also past events
        ownEvents();
        click=1;
    } else {
        comingEvents();                                           //show only coming events
        click=0;
    }
});

$(document).on("tap", '.addJsonBTN',function(event){                //add from search results into own events
    var idToChangeJson= $(this).context.id;                         //get event id of the tapped row
    var idArrJson = idToChangeJson.split("_");
    var jDate;
    var venue;
    var city;

    $.ajax({                                                      //json
        type: "GET",
        url: "http://api.bandsintown.com/artists/"+artistName+"/events.json?api_version=2.0&app_id=harjoitustyo",
        dataType: "json",
        timeout: 5000
      })
      .done (function(data){
          $.each(data, function(index) {
              if(data[index].id == idArrJson[1]) {              //search from json by id
                  var jDateTime = data[index].datetime;
                  var jDate = jDateTime.substring(0,10);        //date slicing
                  var artistName = data[index].artists[0].name;
                  var venue = data[index].venue.name
                  var city =  data[index].formatted_location;

          $.ajax({
              type: 'POST',
              data: {
                  event :artistName,
                  venue :venue,
                  city :city,
                  time :jDate
              },
                                                                //insert variables to database
                  url: 'http://proto387.haaga-helia.fi/~a1501078/backend/insert_event.php',
                  success: function(data){
                    alert('Your data was successfully added');
                  },
                  error: function(){
                    alert('There was an error adding your data');
                  }
              });
            }
        });
      })
    .fail (function() {
        alert("Artist data not available. Please, try again later.");
    });
});

$(document).on("tap", '.deleteBTN',function(event){             //delete from own events
    if(confirm("Are you sure you want to delete this event?") == true) { //confirm
        var muutettava_id= $(this).context.id;                      //get id of the tapped row
        var idArr = muutettava_id.split("_");

        $.ajax({
            type: 'POST',
            data: {
              event_id :idArr[1],
            },                                                      //delete event from database
            url: 'http://proto387.haaga-helia.fi/~a1501078/backend/delete_event.php',
            success: function(data){
              console.log('Your event was successfully deleted');
              comingEvents();
            },
            error: function(){
              console.log('There was an error adding your data');
            }
          });
    }
});

function ownEvents(){                                             //Search own events
    $("#events").html("");
    $.getJSON("http://proto387.haaga-helia.fi/~a1501078/backend/select_events.php", function(result){

    if(result == 0){                                              //Message if there are no events
        $("#events").append("<tr>" + "<td>" + "You don't have any events." + "</td>" + "</tr>");
    }

    $.each(result, function(i, field) {                         //display all events
        $("#events").append("<tr>");
        $("#events").append("<td id='eventOwn'>" +field.event + "</td>");
        $("#events").append("<td>" +field.venue + "</td>");
        $("#events").append("<td>" +field.city + "</td>");

        var arrOwnD = field.time.split("-");
        $("#events").append("<td>" + arrOwnD[2] + "/" + arrOwnD[1] + "/" + arrOwnD[0] + "</td>");
        $("#events").append("<td>" + "<button class='deleteBTN' id='deleteOwnEvent_"+field.event_id+"' style='color: red; background-color: white; border: 1px solid red; opacity: 0.6; border-radius: 10px'>" +"Delete" + "</button>" +"</td>");
        $("#events").append("</tr>");
        });
    });
}


function eventsToday() {                                          //Search today's own events

    $("#gigsToday").html("");
    $.getJSON("http://proto387.haaga-helia.fi/~a1501078/backend/select_events_today.php", function(result){

    if(result == 0){                                              //Message if there are no events today
        $("#gigsToday").append("<tr>" + "<td>" + "You have no events today. Search gigs to make your life eventful!" + "</td>" + "</tr>");
    }
    $.each(result, function(i, field) {                            //display all today's events
        $("#gigsToday").append("<tr>");
        $("#gigsToday").append("<td>" +field.event + "</td>");
        $("#gigsToday").append("<td>" +field.venue + "</td>");
        $("#gigsToday").append("<td>" +field.city + "</td>");

        var arrOwnD = field.time.split("-");
        $("#gigsToday").append("<td>" + arrOwnD[2] + "/" + arrOwnD[1] + "/" + arrOwnD[0] + "</td>");
        $("#gigsToday").append("</tr>");
        });
    });
}

function comingEvents() {                                         //Search own events that are in the future
    $("#events").html("");

    $.getJSON("http://proto387.haaga-helia.fi/~a1501078/backend/select_events_future.php", function(result){
    $.each(result, function(i, field) {                           //display all coming events
        $("#events").append("<tr>");
        $("#events").append("<td>" +field.event + "</td>");
        $("#events").append("<td>" +field.venue + "</td>");
        $("#events").append("<td>" +field.city + "</td>");

        var arrOwnD = field.time.split("-");
        $("#events").append("<td>" + arrOwnD[2] + "/" + arrOwnD[1] + "/" + arrOwnD[0] + "</td>");
        $("#events").append("<td>" + "<button class='deleteBTN' id='deleteOwnEvent_"+field.event_id+"' style='color: red; background-color: white; border: 1px solid red; opacity: 0.6; border-radius: 10px'>" +"Delete" + "</button>" +"</td>");
        $("#events").append("</tr>");
        });
    });
}
