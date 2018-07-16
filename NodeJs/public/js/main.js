var socket = io("http://10.1.10.204:3000");
var file = "";
// Server send fails
socket.on("server-send-fails", function() {
  alert("aaaaaa");
});
// Server send success
socket.on("server-send-success", function(data) {
  $("#left-logout #txtUserName").text(data);
  $("#login-form").hide(2000);
  $("#form-chat").show(1000);
});
// Server send list user
socket.on("server-send-list-user", function(data) {
  $("#listAccount").html("");
  data.forEach(function(i) {
    $("#listAccount").append("<div class='user'>" + i + "</ div>");
  });
});
// Server send message
socket.on("server-send-data", function(data) {
  if (data.fileImage.trim() == '') {
    $("#message").append("<div class='ms'>" + data.user + ": " + data.message + "</div>");
  } else {
    $("#message").append("<div class='img'> <img src='" + data.fileImage + "' class='fileImage'/>" +
      "<div class='ms'>" + data.user + ": " + data.message + "</div>");
  }

});
// Server send typing
socket.on("server-user-typing", function(data) {
  $("#info").html("");
  $("#info").html(data + "<img width='70px' src='/image/typing.gif'/>");
});
// Server send stop typing
socket.on("server-user-stop-typing", function() {
  $("#info").html("");
});
// Server send room
socket.on("server-send-room", function(data) {
  $("#listRoom").html("");
  var index = 0;
  data.forEach(function(i) {
    index++;
    $("#listRoom").append("<div class='room" + index + "' onclick='selectRoom(this);'>" + i + "</div>");
  });
});
// Server send name room
socket.on("server-send-name-room", function(data) {
  $("#nameRoom").html(data);
});
$(document).ready(function() {

  $("#login-form").show();
  $("#form-chat").hide();

  $("#btnLogin").click(function() {
    socket.emit("client-send-user", $("#txtUserName").val());
  });
  $("#btnLogout").click(function() {
    socket.emit("logout");
    $("#form-chat").hide(1000);
    $("#login-form").show(2000);
  })
  $("#btnSend").click(function() {
    var reader = new FileReader();
    var data = {};
    if (file == '') {
      data.file = "";
      data.msg = $("#txtMessage").val();
      socket.emit("user-send-data", data);
    } else {
      reader.onload = function(event) {
        data.file = event.target.result;
        data.msg = $("#txtMessage").val();
        socket.emit("user-send-data", data);
        $("#txtMessage").val('');
      };
      reader.readAsDataURL(file);
    }
  })
  $("#txtMessage").focusin(function() {
    socket.emit("user-typing");
  })
  $("#txtMessage").focusout(function() {
    socket.emit("user-stop-typing");
  })
  $("#btnCreateRoom").click(function() {
    socket.emit("create-room", $("#txtRoom").val());
  })
  $("#openImage").on('change', function(e) {
    file = e.originalEvent.target.files[0];
  });
});

function selectRoom(param) {
  var nameRoom = param.className;
  $(".ms").html("");
  socket.emit("client-join-room", param.innerText);
}
