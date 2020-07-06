
	//var appID = window.location.pathname.substring(5);
	var items = new Array();
	var swipe = new Array();

	var openHABadr = window.location.origin;

	var page = 1;

	var d;
	var height,width;
	var previousStates;
	var gauge = new Array();
	var gaugeReg = new Array();
	var previousStates;

	function shadeColor(color, percent) {
		var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
		return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
	}
	
	var timer;
	function startTime() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = checkTime(m);
		h = checkTime(h);
		$('.clock').html(h + "<span class='dots'>:</span>" + m);
		if(s%2 == 0){
			$('.dots').animate({opacity:1},300);
		} else {
			$('.dots').animate({opacity:0.0},300);
		}
		if(h == 0 && m == 0) getDate()
		clearTimeout(timer);
		timer = setTimeout(startTime,1000);
	}

	function checkTime(i) {
		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
	}
	
	function Round(n, k)
	{
		var factor = Math.pow(10, k);
		return Math.round(n*factor)/factor;
	}
	
	function hex (c) {
	  var s = "0123456789abcdef";
	  var i = parseInt (c);
	  if (i == 0 || isNaN (c))
		return "00";
	  i = Math.round (Math.min (Math.max (0, i), 255));
	  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
	}

	/* Convert an RGB triplet to a hex string */
	function convertToHex (rgb) {
	  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
	}

	/* Remove '#' in color hex string */
	function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

	/* Convert a hex string to an RGB triplet */
	function convertToRGB (hex) {
	  var color = [];
	  color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
	  color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
	  color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
	  return color;
	}

	function generateColor(colorStart,colorEnd,colorCount){

		// The beginning of your gradient
		var start = convertToRGB (colorStart);    

		// The end of your gradient
		var end   = convertToRGB (colorEnd);    

		// The number of colors to compute
		var len = colorCount;

		//Alpha blending amount
		var alpha = 0.0;

		var saida = [];
		
		for (i = 0; i < len; i++) {
			var c = [];
			alpha += (1.0/len);
			
			c[0] = start[0] * alpha + (1 - alpha) * end[0];
			c[1] = start[1] * alpha + (1 - alpha) * end[1];
			c[2] = start[2] * alpha + (1 - alpha) * end[2];

			saida.push(convertToHex (c));
			
		}
		
		return saida;
		
	}

	function getDate()	{
		d = new Date();
		dni = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];
		miesiace = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
		$('.date').html(dni[d.getDay()]+", "+d.getDate()+" "+miesiace[d.getMonth()]);
	}

	function getWeather(loc)	{
		$.simpleWeather({
		location: loc,
		woeid: '',
		unit: 'c',
		success: function(weather) {
			html = '<span style="font-size:40px"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span>';
			$('.weather').html(html);
		}
		});
	}

	
	function findState(item)	{
		for(i = 0; i < previousStates.length; i++)	{
			if(previousStates[i].name == item)	{
				return Number(previousStates[i].state);
			}
		}
	}
	
	function findStateID(item)	{
		for(i = 0; i < previousStates.length; i++)	{
			if(previousStates[i].name == item)	{
				return i;
			}
		}
	}
	
	function pg(num)	{
		$('#page1, #page2,#page3,#page4,#page5,#page6, #page7').hide();
		$('#page'+num).show();
		page = num;
	}
	
	function setState(item, state)	{
		modyfikator = 0;

		if (state == "+")	{
			modyfikator = +1;
		}else
		if (state == "-")	{
			modyfikator = -1;
		}
		
		if (state == "+10")	{
			modyfikator = +10;
		}else
		if (state == "-10")	{
			modyfikator = -10;
		}
		
		state = Number(findState(item)) + modyfikator;
		
		updateElement(item,state,'fast');
		stateID = findStateID(item);
		previousStates[stateID].state = state;
		
		var request = $.ajax
		({
			url        : window.location.origin + "/rest/items/"+item+"",
			timeout		:	10000, 
			type       	: 	"POST",
			data       	: 	state.toString(), 
			headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"},
			dataType	:	"text"
		});
		
		request.done( function(data) 
		{ 
			//console.log( "Success" );
			//updateElement(item, state);
		});
		
		request.fail( function(jqXHR, textStatus ) 
		{ 
			console.log( "Failure: " + textStatus );
		});
	}
	
	function getAllStates()	{
		var result = "";
		$.ajax({
			url: window.location.origin + "/rest/items",
			async: false,
			success: function(data) {
				result = data; 
			}
		});
		return result;
	}

	function updateElement(item, state, type)
	{
		$(".v_"+item).each( function() {
			
			uid = $(this).attr('id').slice(4);
			
			s  = state;	// aktualny stan
			switch(items[uid].type)	{

				case "range":
					if(!type)
						$("#item"+uid).find("input").val(s).change();
				break;

				case "diode":
					if(s == 1)	{
						$("#item"+uid)
						.removeClass('glyphicon glyphicon-remove')
						.addClass('glyphicon glyphicon-fire');
					}
					if(s == 0)	{
						$("#item"+uid)
						.removeClass('glyphicon glyphicon-fire')
						.addClass('glyphicon glyphicon-remove');
					}
				break;

				case "showhide":
					if(items[uid].inv == "false") { ON = 0; OFF = 1;}
					if(items[uid].inv == "true") { ON = 1; OFF = 0;}
					if(items[uid].inv == "only" && s >= 1) { $("#item"+uid).hide(); }else
					if(items[uid].inv == "only" && s == 0) { $("#item"+uid).show(); }else
					if(s == OFF && s != ON)	{
						$("#item"+uid).hide();
					}else
					if(s >= ON && s != OFF)	{
						$("#item"+uid).show();
					}


				break;

//(number - min) / (max - min)
				case "progressbar":
					$("#item"+uid)
					.find('.progress-bar')
					.css({'width': (s/10-items[uid].min)/(items[uid].max-items[uid].min)*100+"%"});
					if(s >= 1400)	{
						$("#item"+uid).find('.progress-bar').text("brak czujnika");
					}	else	{
						$("#item"+uid).find('.progress-bar').text(s/10+items[uid].symbol).css({'font-size':'22px'});
					}
				break;

				case "variable":
				if(items[uid].variable == "TOTAL_HEAT_ENERGY")
						s/=-100;
				s = Number(s).toFixed(2);
				s = s / items[uid].div;
				s = Round(s,3);
				console.log(s);
				//if(s >= 1400)	{
				//	$("#item"+uid)
				//	.text("b/c");
				//}	else	{
					$("#item"+uid)
					.text(s);
				//}
				break;

				case "gauge":
					g_id = gaugeReg.indexOf(items[uid].variable);
					gauge[g_id].refresh(gauge[g_id].value = s/10);
					
					g_id = gaugeReg.lastIndexOf(items[uid].variable);
					gauge[g_id].refresh(gauge[g_id].value = s/10);
				break;

				case "donut":
					if(items[uid].variable == "TOTAL_ACTIVE_POWER")
						s*=10;
					
					if(items[uid].variable == "EnergyInMomentW")
						s/=-100;
				
					g_id = gaugeReg.indexOf(items[uid].variable);
					gauge[g_id].refresh(gauge[g_id].value = s);
					
					g_id = gaugeReg.lastIndexOf(items[uid].variable);
					gauge[g_id].refresh(gauge[g_id].value = s/10);
				break;

				case "switch":
					if(!type)
						$("#item"+uid).find('input').prop('checked', Number(s)?true:false).change();
				break;

				case "booltxt":
					if(s == 1)	{
						$("#item"+uid)
						.html(items[uid].textON);
					}
					if(s == 0)	{
						$("#item"+uid)
						.html(items[uid].textOFF);
					}
				break;

				case "boolimg":
					if(s >= 1)	{
						$("#item"+uid)
						.find('img').attr('src', items[uid].imgON );
					}
					if(s == 0)	{
						$("#item"+uid)
						.find('img').attr('src', items[uid].imgOFF );
					}
				break;
				
				case 'selvar':
						$("#item"+uid)
						.text(s * items[uid].multi);
				break;
					
				case "tslider":
					h1 = $("#item"+uid).attr('h1');
					h2 = $("#item"+uid).attr('h2');
					m1 = $("#item"+uid).attr('m1');
					m2 = $("#item"+uid).attr('m2');

					if(item == h1) { 
						left = Number(state)*60+Number(findState(m1));
						right = Number(findState(h2))*60+Number(findState(m2));
					}
					if(item == h2) { 
						left = Number(findState(h1))*60+Number(findState(m1));
						right =  Number(state)*60+Number(findState(m2));
					}
					if(item == m1) { 
						left = Number(findState(h1))*60+ Number(state);
						right = Number(findState(h2))*60+Number(findState(m2));
					}
					if(item == m2) { 
						left = Number(findState(h1))*60+Number(findState(m1));
						right = Number(findState(h2))*60+ Number(state);
					}
					console.log(uid+","+left+","+right);
					if(!type)
						$("#item"+uid)
						.find('.nstSlider')
						.nstSlider('set_position', left, right);
				break;
				
				case "anim":
					if(s >= 1)	{
						$("#item"+uid)
						.find('img').addClass('anim');
					}
					if(s == 0)	{
						$("#item"+uid)
						.find('img').removeClass('anim');
					}
				break;
				
				case "textList":
					textList = eval(items[uid].textArray);
					console.log(textList);
					console.log(s);
					if(textList.length >= s)
						$("#item"+uid)
						.text(textList[s]);
				break;
				
				case 'colorInd':
					low = $("#item"+uid).attr('low');		
					high = $("#item"+uid).attr('high');		
					lowColor= $("#item"+uid).attr('lowColor');		 
					highColor = $("#item"+uid).attr('highColor');
					var start = convertToRGB(lowColor);    
					var end   = convertToRGB(highColor);    
					c = [];
					alpha = (s/10-low)/(high-low);
					c[0] = start[0] * alpha + (1 - alpha) * end[0];
					c[1] = start[1] * alpha + (1 - alpha) * end[1];
					c[2] = start[2] * alpha + (1 - alpha) * end[2];
				
					$("#item"+uid)
					.find('.colorBar')
					.css({'height': "100%"})
					.css({'background-color': 'RGB('+c[0]+','+c[1]+','+c[2]+')'});

					if(items[uid].typ == 'height')	{
						$("#item"+uid)
						.find('.colorBar')
						.css({'height': (s/10-items[uid].low)/(items[uid].high-items[uid].low)*100+"%"})
					}
					
					if(s >= 1400)	{
						//$("#item"+uid).find('.progress-bar').text("brak czujnika");
					}	else	{
					//	$("#item"+uid).find('.progress-bar').text(s/10+items[uid].symbol).css({'font-size':'22px'});
					}
				break;
				
			}
			console.log(items[uid].type+" updated!");
		});
	
	}

	function init()	{
		console.log("START INIT");
		input = getAllStates();
		previousStates = input;
		for(i = 0; i < input.length; i++)	{
			updateElement(previousStates[i].name, previousStates[i].state);
		}
	    checkDiff();
	}
	
	function checkDiff()	{
		input = getAllStates();
		for(i = 0; i < input.length; i++)	{
			if(previousStates[i].state != input[i].state)	{
			//	console.log(input[i].name+","+input[i].state);
				previousStates[i].state = input[i].state;
				updateElement(previousStates[i].name, previousStates[i].state);
			}
		}
				
		clearTimeout(updateTimer);
		updateTimer = setTimeout(function() { checkDiff() },5000);
	}

	var updateTimer;
	
	$(function(){
		
	
		var myElement = document.getElementById('space');

		var mc = new Hammer(myElement);
		mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 20, velocity: 1.5 });

		$.getJSON("schema.json",
		function( json ) {

			items = $.map(json.load.content, function(el) { return el });

			height = json.load.height;
			width = json.load.width;
			$("#space").css({'background':json.load.bodyColor, 'width':width, 'height':height});
			$('body').css({'background':json.load.bodyColor});
			$("#holder").css({'background-image': 'url('+json.load.backgroundImage+')'});
		
			for(a = 0, len = items.length; a < len; a++)
			{
				d = document.createElement('span');
				$("#page"+items[a].page).append( d );

				$(d)
				.css({'width' : items[a].width ,'height' : items[a].height })
				.css({'position':'absolute', 'left' : items[a].x, 'top' : items[a].y, 'z-index' : items[a].stack })
				.attr('id','item'+a);

				switch(items[a].type)	{
					case 'text':
						$(d)
						.html(items[a].text)
						.css({'font-size':	items[a].fontSize+'px', 'color': items[a].fontColor,'text-align':'center'});
					break;

					case 'image':
						$(d)
						.append("<img src='"+items[a].src+"'/>")
						.find('img').css({"box-shadow": items[a].shadow})
						.on('dragstart', function(event) { event.preventDefault(); });
					break;

					case 'button':
						fun = items[a].onClick;
						$(d)
						.addClass("btn").html(items[a].btnText)
						.attr('var',items[a].btnVar)
						.attr('fnc',items[a].btnFnc)
						.css({'background':items[a].bodyColor, 'border':'solid 1px '+shadeColor(items[a].bodyColor,-10),'font-size': items[a].btnSize+'px'})
						.attr('func',fun)
						.click( function() {
							item = $(this).attr('var');
							state = $(this).attr('fnc');
							setState(item, state);
						} );
					break;

					case 'square':
						$(d)
						.css({'background-color':items[a].bodyColor, 'border-radius': items[a].radius+'px', 'border': 'solid '+items[a].border+'px '+items[a].borderColor, 'opacity': items[a].alpha/100 });

					break;

					case 'diode':
						$(d)
						.addClass("v_"+items[a].varDiode)
						.addClass("glyphicon glyphicon-remove")
						.css({'font-size':'35px'});
					break;

					case 'grafana':
						$(d)
						.append('<iframe src="'+items[a].link+'" width="100%" height="100%" frameborder="0"></iframe>');
					break;

					case 'progressbar':
						$(d)
						.addClass('v_'+items[a].variable)
						.append('<div class="progress" style="height: 100%"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 50%; background: '+items[a].barColor+'">'+items[a].barVar+'</div></div>');

					break;

					case 'gauge':
						$("#item"+a)
						.addClass('v_'+items[a].variable)
						.empty();

						if(items[a].fillColor == "#ffffff") { color = ["#a9d70b", "#f9c802", "#ff0000"]; }
						else if(items[a].fillColor == "#000000") { color = ["#ff0000", "#f9c802","#41A62A" ]; } else { color = [items[a].fillColor]; }

						gaugeReg.push(items[a].variable);

						gauge.push( new JustGage({
							id: "item"+a,
							value: null,
							min: items[a].min/10,
							max: items[a].max/10,
							symbol: items[a].symbol,
							shadowOpacity: 0.5,
							shadowSize: 2,
							shadowVerticalOffset: 3,
							decimals: items[a].decimals,
							valueFontColor: items[a].dataColor,
							gaugeWidthScale: items[a].widthScale,
							relativeGaugeSize: true,
							levelColors: color
						 }));
					break;

					case 'donut':
						$("#item"+a)
						.addClass('v_'+items[a].variable)
						.empty();

						if(items[a].fillColor == "#ffffff") { color = ["#a9d70b", "#f9c802", "#ff0000"]; }
						else if(items[a].fillColor == "#000000") { color = ["#ff0000", "#f9c802","#41A62A" ]; } else { color = [items[a].fillColor]; }

						gaugeReg.push(items[a].variable);

						gauge.push( new JustGage({
							id: "item"+a,
							value: null,
							min: items[a].min,
							max: items[a].max,
							symbol: items[a].symbol,
							shadowOpacity: 0.5,
							shadowSize: 2,
							shadowVerticalOffset: 3,
							decimals: items[a].decimals,
							valueFontColor: items[a].dataColor,
							gaugeWidthScale: items[a].widthScale,
							relativeGaugeSize: true,
							donut: true,
							levelColors: color
						  }));
					break;

					case 'variable':
						$("#item"+a)
						.addClass("v_"+items[a].variable)
						.css({'font-size':	items[a].fontSize+'px', 'color': items[a].fontColor,'text-align':'center'})
						.text("NaN");
					break;

					case 'switch':
						$("#item"+a)
						.html('<input type="checkbox" id="checkbox'+a+'" data-toggle="toggle">')
						.attr('var',items[a].variable)
						.addClass("v_"+items[a].variable)
						.children().bootstrapToggle();

						$("#item"+a)
						.find('.toggle')
						.css({'border': 'solid 1px '+shadeColor(items[a].bodyColor,15)});

						$("#item"+a)
						.find('.toggle-on').css({'background': items[a].bodyColor});

						$("#item"+a)
						.find('.toggle-handle').css({'background': shadeColor(items[a].bodyColor,-10), 'border': 'solid 1px '+shadeColor(items[a].bodyColor,10)});

						$("#checkbox"+a).change( function() {
							item = $(this).parent().parent().attr('var');
							setState(item, $(this).prop('checked')? 1 : 0);
						});
					break;

					case 'range':
						$("#item"+a)
						.attr('var',items[a].variable)
						.addClass('v_'+items[a].variable)
						.html('<input type="range" min="'+items[a].min+'" max="'+items[a].max+'" step="'+items[a].step+'" width="100%"  value="0" data-orientation="horizontal"/>')
						$("#item"+a).find("input").rangeslider({polyfill: false});
						$("#item"+a)
						.find('input')
						.change( function() {
							item = $(this).parent().attr('var');
							setState(item,Number($(this).val()));
						});

						$("#item"+a)
						.find('.rangeslider__fill')
						.css({'background':items[a].fillColor});
					break;

					case 'panel':
						$("#item"+a)
						.css({'background': items[a].bodyColor ,'border-radius':items[a].round+'px','border':'solid 1px '+shadeColor(items[a].bodyColor,10), 	'box-shadow': '0px 0px 3px 1px rgba(0,0,0,0.75)'})
						.append('<div class="panelHead" style="padding: 7px; width: 100%; height: 35px; color: '+items[a].titleColor+'; background: linear-gradient('+items[a].bodyColor+' 70%,'+shadeColor(items[a].bodyColor,-10)+' 110%)"><span class="glyphicon glyphicon-'+items[a].glyph+'"> </span>'+items[a].title+'</div>');
					break;

					case 'glyph':
						$("#item"+a)
						.html("<span class='glyphicon glyphicon-"+items[a].glyph+"'></span>")
						.css({'font-size':items[a].size+'px','color':items[a].color});
					break;

					case 'clock':
						$('#item'+a)
						.addClass('clock')
						.css({'color':items[a].color,'font-size':items[a].size+'px','text-align':'center'});
						startTime();
					break;

					case "date":
						$('#item'+a)
						.addClass('date')
						.css({'color':items[a].color,'font-size':items[a].size+'px', 'text-align':'center'});
						getDate();
					break;

					case "weather":
						$('#item'+a)
						.addClass('weather')
						.css({'text-align':'center'});

						getWeather(items[a].location); //Get the initial weather.
						setInterval(getWeather, 600000);
					break;

					case "showhide":
						$(d)
						.addClass("v_"+items[a].variable)
						.on('dragstart', function(event) { event.preventDefault(); })
						.append("<img height='100%' width='100%' src='"+items[a].img+"'/>")
						.attr('var',items[a].variable)
						.attr('active', items[a].active)
						.click( function() {
								if($(this).attr('active') == "on")	{
									item = $(this).attr('var');
									state = Number(!findState(item));
									setState(item, state);
								}
						} );
					break;

					case 'menubtn':
						$(d)
						.attr('page',items[a].link)
						.click( function() {
							console.log($(this).attr('page'));
							pg($(this).attr('page'));
						} );
					break;

					case 'booltxt':
						$(d)
						.html(items[a].textOFF)
						.css({'font-size':	items[a].fontSize+'px', 'color': items[a].fontColor,'text-align':'center'})
						.attr('var',items[a].variable)
						.addClass("v_"+items[a].variable);
					break;

					case 'boolimg':
						$(d)
						.append("<img src='"+items[a].imgOFF+"'/>")
						.on('dragstart', function(event) { event.preventDefault(); })
						.attr('var',items[a].variable)
						.attr('active', items[a].active)
						.addClass("v_"+items[a].variable)
						.click( function() {
								if($(this).attr('active') == "on")	{
									item = $(this).attr('var');
									state = Number(!findState(item));
									setState(item, state);
								}
								if($(this).attr("active") == "+" &&  $(this).attr('var') != 'active') {
									item = $(this).attr('var');
									setState(item, "+");
								}
								if($(this).attr("active") == "-" &&  $(this).attr('var') != 'active') {
									item = $(this).attr('var');
									setState(item, "-");
								}
								
								if($(this).attr('var') == 'active')	{
									item = activeVar;
									state = findState(item);
									if($(this).attr("active") == "+") state = "+";
									if($(this).attr("active") == "-") state = "-";
									setState(item, state);
								}
						} );
					break;
					
					case 'selvar':
						$(d)
						.attr('var',items[a].variable)
						.addClass("v_"+items[a].variable)
						.attr('selectedColor',items[a].selectedColor)
						.addClass("varsel")
						.css({'font-size':	items[a].fontSize+'px', 'color': items[a].fontColor,'text-align':'center'})
						.click(function(){
							v = $(this).attr('var');
							selectedColor = $(this).attr('selectedColor');
							console.log(v+','+selectedColor);
							$(".varsel").css({'background': ''});
							$(".varsel.v_"+v).css({'background': selectedColor});
							
							activeVar = v;
						})
						.text("NaN");
					break;
					
					case 'selvarbtn':
						fun = items[a].btnFnc;
						$(d)
						.addClass("btn").html(items[a].btnText)
						.css({'background':items[a].bodyColor, 'border':'solid 1px '+shadeColor(items[a].bodyColor,-10),'font-size': items[a].btnSize+'px'})
						.attr('func',fun)
						.click( function() {
							item = activeVar;
							state = findState(item);
							if($(this).attr("func") == "+") state = "+";
							if($(this).attr("func") == "-") state = "-";
							setState(item, state);
						} );
					break;
					
					case 'tslider':

						$(d)
						.attr('h1',items[a].h1)
						.attr('m1',items[a].m1)
						.attr('h2',items[a].h2)
						.attr('m2',items[a].m2)
						.html('<div class="nstSlider" data-range_min="'+items[a].min+'" data-enabled="false" data-range_max="'+items[a].max+'" data-cur_min="'+items[a].min+'"  data-cur_max="'+items[a].max+'">\
									<div class="bar"></div>\
									<div class="leftGrip"></div>\
									<div class="rightGrip"></div>\
								</div>\
								<div style="width: 50px; position: absolute; top: 0px;" class="leftLabel" />\
								<div style="width: 50px; position: absolute; top: 0px; right: 0px; text-align: right;" class="rightLabel" />\
								')
						.addClass("v_"+items[a].h1)
						.css({'width': items[a].width+'px','height':items[a].height+'px'});
								
						$("#item"+a)
						.find('.nstSlider').nstSlider({
							"rounding": {
								"10": "100"
							},
							"left_grip_selector": ".leftGrip",
							"right_grip_selector": ".rightGrip",
							"value_bar_selector": ".bar",
							"value_changed_callback": function(cause, leftValue, rightValue) {
								var $container = $(this).parent();
								var mmLeft = leftValue%60;
								var hhLeft = parseInt(leftValue/60);
								var mmRight = rightValue%60;
								var hhRight = parseInt(rightValue/60);
								if(hhLeft.toString().length == 1) hhLeft = '0'+hhLeft.toString(); 
								if(mmLeft.toString().length == 1) mmLeft = '0'+mmLeft.toString(); 
								if(mmRight.toString().length == 1) mmRight = '0'+mmRight.toString(); 
								if(hhRight.toString().length == 1) hhRight = '0'+hhRight.toString(); 
								
								$container.find('.leftLabel').text(hhLeft+':'+mmLeft);
								$container.find('.rightLabel').text(hhRight+':'+mmRight);
							},
							"user_mouseup_callback": function(leftValue, rightValue) {
								var mmLeft = leftValue%60;
								var hhLeft = parseInt(leftValue/60);
								var mmRight = rightValue%60;
								var hhRight = parseInt(rightValue/60);
								h1 = $(this).parent().attr('h1');
								m1 = $(this).parent().attr('m1');
								h2 = $(this).parent().attr('h2');
								m2 = $(this).parent().attr('m2');
								
								//CALY_TYDZIEN1_START_GODZ
								setState(h1, hhLeft);
								setState(m1, mmLeft);
								setState(h2, hhRight);
								setState(m2, mmRight);
							}
						});
					break;
					
					case 'anim':
						$(d)
						.append("<img src='"+items[a].img+"'/>")
						.on('dragstart', function(event) { event.preventDefault(); })
						.attr('var',items[a].variable)
						.addClass("v_"+items[a].variable);
					break;
					
					case 'textList':
						$("#item"+a)
						.addClass("v_"+items[a].variable)
						.css({'font-size':	items[a].fontSize+'px', 'color': items[a].fontColor,'text-align':'center'})
						.text("NaN");
					break;
					
					
					case 'colorInd':
						$(d)
						//.css({'width' : items[a].width ,'height' : items[a].height })
						//.css({'position':'absolute', 'left' : items[a].x, 'top' : items[a].y, 'z-index' : items[a].stack })
				
						.addClass('v_'+items[a].variable)
						.attr('low',items[a].low)
						.attr('high',items[a].high)
						.attr('lowColor',items[a].lowColor)
						.attr('highColor',items[a].highColor)
						.append("<div class='colorBar' style='position: absolute; bottom: 0px; width: 100%;'><div>");
					break;
					
				}

			}

		init();
		
		});
	});
