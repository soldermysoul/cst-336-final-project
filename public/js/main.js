/* global newPrice $*/

var newPrice=0;
var basePrice=0;
var sum =0;
    
 $(".calculate").change(function(res, req) 
{

    newPrice = basePrice;
    $(".calculate option:selected").each(function() {
        newPrice += $(this).data('price')
        
        document.getElementById("myButton").disabled = false;
    });

    $("#total").html(newPrice.toFixed(2));
});


$("#myButton").on("click", async function()
{
    window.location.href='/store-results';
    let queryString = window.location.search;
    let urlParams   = new URLSearchParams(queryString);
    // let check =  $(this).html().trim(); 
    //  $("#check").val(check);
    let total="";
    let value = 0;
    value= $("#check").val();  
    
    
    updateDatabase("add", total, value);
    
});

$("#submit").on("click", async function()
{   
    
    let fname   = $("#fname").val();
    let lname   = $("#lname").val();
    let country = $("#country").val();
    let subject = $("#subject").val();
    
    updateContact("add", fname, lname, country, subject);
    
    
});

async function updateContact(action,fname,lname,country,subject)
{
    let url = `/api/updateContact?action=${action}&firstname=${fname}&lastname=${lname}&country=${country}&subject=${subject}`
    await fetch(url);
}

async function updateDatabase(action,total,value)
{
       let url = `/api/updateDatabase?action=${action}&total=${newPrice}&value=${value}`
    await fetch(url);
}


function calculate(){
    
    var sum = parseIntX($("#setId").val()) + parseIntX($("#setId1").val()) + parseIntX($("#setId2").val()) + parseIntX($("#setId3").val());
        
      $('#check').val(sum);
      
}

function parseIntX(num){
    return (isNaN(parseInt(num))) ? 0 : parseInt(num);
}

// gets the sum of all four option inputs. 
$("#setId, #setId1, #setId2, #setId3").change(function() {
    
    calculate();
});



