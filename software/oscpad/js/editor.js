// Generated by CoffeeScript 1.3.3
(function() {
  var draw;

  draw = function() {
    var canvas, ctx;
    canvas = document.getElementById('display');
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.fillRect(10, 10, 55, 50);
      ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
      return ctx.fillRect(30, 30, 55, 50);
    }
  };

  $(function() {
    alert("working 2000");
    return draw();
  });

}).call(this);
