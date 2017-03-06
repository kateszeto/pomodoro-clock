var ctx = document.getElementById('pomo_canvas').getContext('2d');
var al = 0;
var start = 4.72;
var cw = ctx.canvas.width;
var ch = ctx.canvas.height; 
var diff;
var interval = 0;
var pomomin;
var breakmin;
var flag;
var status = 0;
var total;
var sim;
ctx.lineWidth = 10;

function init(PorB){
  ctx.clearRect(0, 0, cw, ch);
  if(PorB){
  $("#pomo_canvas").css({"background-color":"#FF6347","border": "1px solid #FF6347"});
  drawBG("#ff7f68");
//  drawBG("#ffe2dd");
  drawIcon('\uf02d');
  pomomin=getCurrentPomo();
  drawText(pomomin+":00");
  flag = true;
  }else{
    $("#pomo_canvas").css({"background-color":"#ffc6bc","border": "1px solid #ffc6bc"});
    drawBG("#ffe2dd");
    drawIcon("\uf0f4");
    breakmin = getCurrentBreak();
    drawText(breakmin+":00");
    flag = false;
  }
  interval = 0;
}

function getCurrentPomo(){  
    var pm = parseInt($("#pomomin").text());
    return pm;
}

function getCurrentBreak(){
  var bm = parseInt($("#breakmin").text());
  return bm;
}

function drawBG(color){
  ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(140, 140, 100, 0, 2*Math.PI);
	ctx.stroke();
}

function drawIcon(icon){
  ctx.font = "48px 'FontAwesome'";
  ctx.textAlign = 'center';
  ctx.fillText(icon,cw*.5,ch*.5-10,cw);
}

function drawText(text){
  ctx.font = "36px 'Ubuntu Condensed', sans-serif";
  ctx.fillText(text, cw*.5, ch*.5+36, cw);
}
function displayTime(cint){
  var timeleft = total - cint;
  var sec = timeleft;
  var minpart = Math.floor(sec/60).toString();
  var secpart = sec % 60;
  secpart = secpart.toString();
  if(minpart.length<=1){
    minpart = "0"+minpart;
  }
  if(secpart.length<=1){
    secpart = "0"+secpart;
  }
//  console.log(minpart+":"+secpart);
  return minpart+":"+secpart;
  
}
function progressSim(){
//  console.log("Start draw");
	ctx.clearRect(0, 0, cw, ch);
  
  if(flag){
      drawBG("#ff7f68");
    	ctx.fillStyle = '#D43023';
	    ctx.strokeStyle = "#D43023";
      drawIcon("\uf02d");
  }
  else{
      drawBG("#ffe2dd");
      ctx.fillStyle = '#FF6347';
	    ctx.strokeStyle = "#FF6347";
      drawIcon("\uf0f4");
      
  }
  al = interval*100/total;
	diff = ((al / 100) * Math.PI*2*10).toFixed(2);

	ctx.textAlign = 'center';
//  ctx.lineWidth = 7;
  var dptext = displayTime(interval);
	drawText(dptext);
	ctx.beginPath();
	ctx.arc(140, 140, 100, start, diff/10+start, false);
	ctx.stroke();
  
	if(interval >= total){
		clearTimeout(sim);
	  if(flag){
      flag = false;
      total = getCurrentBreak()*60;  
        $("#pomo_canvas").css({"background-color":"#ffc6bc","border": "1px solid #ffc6bc"});
    }else{
      flag = true;
      total = getCurrentPomo()*60; 
        $("#pomo_canvas").css({"background-color":"#FF6347","border": "1px solid #FF6347"});
    }
    ctx.clearRect(0, 0, cw, ch);
    interval = 0;
    sim = setInterval(progressSim,1000); 
	}
//	al++;
  interval ++;
}



//

/* Font */
   WebFontConfig = {
    google: { families: [ 'FontAwesome' ] },
    active: function(){init(true);}
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })(); 


$("#playpause").click(function(){
  console.log("click play!");
//  sim = setInterval(progressSim,1000);
  if(flag){
    total = getCurrentPomo()*60;
  }else{
    total = getCurrentBreak()*60;
  }
  if(status==0){
    sim = setInterval(progressSim,1000);
    $(this).html("<i class='fa fa-pause-circle-o' aria-hidden='true'></i>");
    status = 1;
  }else if(status==1){
    clearTimeout(sim);
    $(this).html("<i class='fa fa-play-circle-o' aria-hidden='true'></i>");
    status = 0;
  }
  
});

$("#stop").click(function(){
  status = 0;
  $("#playpause").html("<i class='fa fa-play-circle-o' aria-hidden='true'></i>");
  clearTimeout(sim);
  interval = 0;
  init(true);
});

$(".plus").click(function(){
  if(status==0){
  var increased =           parseInt($(this).parent().find('.number').text());
  var numid = $(this).parent().find('.number').prop('id');
  console.log("id name:"+numid);
      if (isNaN(increased) || increased > 0) {
        if(numid=="pomomin"&&flag===true){
          $(this).parent().find('.number').text(increased+1);
          init(true);
        }else if(numid=="breakmin"&&flag===false){
          $(this).parent().find('.number').text(increased+1);
          init(false);
        }else if(numid=="breakmin"&&flag===true){
          $(this).parent().find('.number').text(increased+1);
        }
    }
}
});

$(".minus").click(function(){
  if(status==0){
  var decreased =           parseInt($(this).parent().find('.number').text());
  var numid = $(this).parent().find('.number').prop('id');
  console.log("id name:"+numid);
      if (isNaN(decreased) || decreased > 1) {
        if(numid=="pomomin"&&flag===true){
          $(this).parent().find('.number').text(decreased-1);
          init(true);
        }else if(numid=="breakmin"&&flag===false){
          $(this).parent().find('.number').text(decreased-1);
          init(false);
        }else if(numid=="breakmin"&&flag===true){
          $(this).parent().find('.number').text(decreased-1);
        }
    }
}
});