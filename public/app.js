// Grab the articles as a json

//$("#articles").hide();
$("#scraper").on("click", function() {
 
  //$("#articles").show();
  $.get("/scrape", function(data) {

  // }).then(function(data) {
    //$.getJSON("/articles", function(data) {
      console.log(data);
      // For each one
      for (var i = 0; i < data.length; i++) {
        var title = data[i].title;
        var link = "https://www.nytimes.com" + data[i].link;
        var id = data[i]._id;
       
        var div = $("<div>");
        div.attr("class", "basic-card");
        div.attr("style", "width:600px");

        var h2 = $("<h2>");
        h2.attr("data-id", id);
        h2.append(title);
        
        div.append(h2);

        var sourceUrl = $("<a>");
        sourceUrl.attr("href", link);
        sourceUrl.attr("target", "_blank");
        sourceUrl.append(link);
        div.append(sourceUrl);


       
        $("#articles").append(div);


        // $("#articles").append("<h2 data-id='" + id + "'>" + title + "</h2> "); 
        // $("#articles").append($("<a target='_blank' href=" + link + ">" + link + "</a>"));
        // $("#articles").append("<hr>");
        
      }
    });
    

})

// $("#clearer").on("click", function() {
//   $("#articles").empty();
// });


// Whenever someone clicks a p tag
$(document).on("click", "h2", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#savenote").attr("class", "btn-primary");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
      $("#deletenote").attr("class", "btn-danger");
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });
   

//     // When you click the deletenote button
$(document).on("click", "#deletenote", function() {
//   // Grab the id associated with the article from the submit button
 var thisId = $(this).attr("data-id");
 

 
  $.ajax({
    url: "/note/" + thisId,
    method: "DELETE"

  })
  .then(function(data) {
    $("#notes").empty();
    console.log("Note " + thisId + "deleted");
    //location.reload();
  });
  
  });




  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
