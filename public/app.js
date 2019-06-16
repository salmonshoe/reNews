$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(`<div id="post"><p data-id=${data[i]._id}> <strong>${data[i].headline}</strong> <br /> ${data[i].summary} <br /> <a href="${data[i].url}" target="_blank">${data[i].url}</a> </p></div>`)
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "div", function() {
    $("#notes").empty();
    
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // first find a note to the article
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // Saveing the note by clicking save button
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    // post the note
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  