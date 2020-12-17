/* global $*/

// Button implementation to add sql database values from button click in ticket portion
$("#btn1").on("click", async function()
{
    updateTicketDatabase("add","150","Raiders_VS_Bears")
});

$("#btn2").on("click", async function()
{
    updateTicketDatabase("add","250","Jets_VS_Giants")
});

$("#btn3").on("click", async function()
{
    updateTicketDatabase("add","350","Chargers_VS_Chiefs")
});

$("#btn4").on("click", async function()
{
    updateTicketDatabase("add","450","Seahawks_VS_Niners")
});


//grabs the data from the button and stores into updated ticket table.

async function updateTicketDatabase(action,price,teams)
{
       let url = `/api/updateTicketDatabase?action=${action}&price=${price}&teams=${teams}`
    await fetch(url);
}

// changes background color shchem depending on slider section
function background(c1, c2) {
  return {
    background: "-moz-linear-gradient(15deg, " + c1 + " 50%, " + c2 + " 50.1%)",
    background: "-o-linear-gradient(15deg, " + c1 + ", " + c2 + " 50.1%)",
    background: "-webkit-linear-gradient(15deg, " + c1 + " 50%, " + c2 + ")",
    background: "-ms-linear-gradient(15deg, " + c1 + " 50%, " + c2 + " 50.1%)",
    background: "linear-gradient(15deg, " + c1 + " 50%," + c2 + " 50.1%)"
  };
}

function changeBg(c1, c2) {
  $("div.bg")
    .css(background(c1, c2))
    .fadeIn(700, function () {
      $("body").css(background(c1, c2));
      $(".bg").hide();
    });
  $("span.bg").css({
    background: "-moz-linear-gradient(135deg, " + c1 + ", " + c2 + ")",
    background: "-o-linear-gradient(135deg, " + c1 + ", " + c2 + ")",
    background: "-webkit-linear-gradient(135deg, " + c1 + ", " + c2 + ")",
    background: "-ms-linear-gradient(135deg, " + c1 + ", " + c2 + ")",
    background: "linear-gradient(135deg, " + c1 + "," + c2 + ")"
  });
}

//implements slider to move image views
$slider = $(".slider");

$slider
  .slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 600,
    fade: true,
    focusOnSelect: true,
    customPaging: function (slider, i) {
      var color = $(slider.$slides[i]).data("color").split(",")[1];
      return (
        '<a><svg width="100%" height="100%" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.215" stroke="' +
        color +
        '"></circle></svg><span style="background:' +
        color +
        '"></span></a>'
      );
    }
  })
  .on("beforeChange", function (event, slick, currentSlide, nextSlide) {
    colors = $("figure", $slider).eq(nextSlide).data("color").split(",");
    color1 = colors[0];
    color2 = colors[1];
    $(".price, .btn").css({
      color: color1
    });
    changeBg(color1, color2);
    $(".btn").css({
      borderColor: color2
    });
  });
