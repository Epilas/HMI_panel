	var startX, startY, startWidth, startHeight, active, items = new Array(), page = 1, copy;

	function initDrag(e) {
	   startX = e.clientX;
	   startY = e.clientY;
	   var elem = document.getElementById(active);
	   startWidth = parseInt(document.defaultView.getComputedStyle(elem).width, 10);
	   startHeight = parseInt(document.defaultView.getComputedStyle(elem).height, 10);
	   document.documentElement.addEventListener('mousemove', doDrag, false);
	   document.documentElement.addEventListener('mouseup', stopDrag, false);
	}

	function doDrag(e) {
		endWidth =  Math.round((startWidth + e.clientX - startX)/10)*10;
		endHeight =  Math.round((startHeight + e.clientY - startY)/10)*10;
		if( endWidth <= 10) { endWidth = 10; }
		if( endHeight <= 10) { endHeight = 10; }

		if( endWidth+$("#"+active).position().left >= $("#worktable").width() ) { endWidth = $("#worktable").width() }//- $("#"+active).position().left;}
		if( endHeight+$("#"+active).position().top >= $("#worktable").height() ) { endHeight = $("#worktable").height() }//- $("#"+active).position().height; }

	   $("#"+active).css({'width': endWidth, 'height': endHeight });

	   items[active.slice(4)].height = endHeight;
	   items[active.slice(4)].width = endWidth;
	}

	function stopDrag(e) {
		document.documentElement.removeEventListener('mousemove', doDrag, false);    document.documentElement.removeEventListener('mouseup', stopDrag, false);
	}

	function shadeColor(color, percent) {  // deprecated. See below.
		var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
		return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
	}

	function startTime() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		//var s = today.getSeconds();
		m = checkTime(m);
		//s = checkTime(s);
		return h + ":" + m;
	//	var t = setTimeout(startTime, 500);
	}

	function checkTime(i) {
		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
	}

	function getDate()	{
		d = new Date();
		dni = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];
		miesiace = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
		return (dni[d.getDay()]+", "+d.getDate()+" "+miesiace[d.getMonth()]);
	}

	function pattern(n,e,t,d,o) {
		this.name = n;
		this.editable = e; // nazwy pol edycji
		this.type = t; //Rodzaj pola do wpisywania tekst, liczba, kolor
		this.description =d; //Opis pola
		this.onSet = o; //WartoĹÄ poczÄtkowa
	}
	

	var elements = new Array();
	//						1		2		3		4			5		6			7			8			9		10			11			12		13		14		15		16			17		18			19          20         21
	var elementsType = ["text","button", "image", "square", "diode", "grafana","progressbar", "gauge",  "donut", "variable", "switch", "range", "panel", "glyph", "clock", "date", "weather", "menubtn", "showhide", "booltxt", "selvar","selvarbtn", "boolimg","tslider","anim","textList"];

/*1*/	elements.push(new pattern('Tekst',['text','fontSize', 'fontColor'],['text','number','color'],['Tekst', 'Rozmiar czcionki', 'Kolor czcionki'], ['text',14,'#FFFFFF']) );
/*2*/	elements.push(new pattern('Przycisk',['btnText','btnSize', 'btnVar', 'btnFnc','bodyColor'],['text','number', 'varN','text','color'],['Tekst przycisku','Rozmiar tekstu', 'Zmienna','Działanie','Kolor'], ["Button","20", "var","set",'#666666']) );
/*3*/	elements.push(new pattern('Obrazek',['src','shadow'],['text','text'],['Źródło','Cień'], ["blank.png",'0px 0px 0px 0px']) );
/*4*/	elements.push(new pattern('Prostokąt',['bodyColor','radius','border','alpha','borderColor'],['color','number','number','number','color'],['Kolor tła','Zaokrąglenie kątów','Grubość obramowania','Przeźroczystość','Kolor obramowania'], ["#666666","0","0",'100','#FFFFFF']) );
/*5*/	elements.push(new pattern('Dioda',['varDiode'],['varB'],['Nazwa zmiennej'], ["zmienna"]) );
/*6*/	elements.push(new pattern('Wykres Grafana',['link'],['text'],['Ścieżka do wykresu'], ["127.0.0.1"]) );
/*7*/	elements.push(new pattern('Pasek postępu',['barColor','variable','min','max','symbol'],['color','varN','number','number','text'],['Kolor paska','Zmienna','Wartość minimalna','Wartość maksymalna','Symbol'], ["blue","","0","100",""]) );
/*8*/	elements.push(new pattern('WzkaĹşnik',['dataColor','fillColor','min','max','widthScale','variable','symbol','decimals'],['color','color','number','number','number','varN','text','number'],['Kolor wzkaĹşnika','Kolor wypełnienia','Wartość minimalna','Wartość maksymalna','Grubość wzkaĹşnika','Zmienna','Symbol','Miejsca po przecinku'], ["#FFFFFF","blue","0","100","1","","%",'0']) );
/*9*/	elements.push(new pattern('Donut',['dataColor','fillColor','min','max','widthScale','variable','symbol','decimals'],['color','color','number','number','number','varN','text','number'],['Kolor wskaĹşnika','Kolor wypełnienia','Wartość minimalna','Wartość maksymalna','Grubość wzkaĹşnika','Zmienna','Symbol','Miejsca po przecinku'], ["#FFFFFF","blue","0","100","0.2","",'%','0']) );
/*10*/	elements.push(new pattern('Zmienna',['variable','div','fontSize', 'fontColor'],['varN','number','number','color'],['Zmienna', 'Dzielnik', 'Rozmiar czcionki', 'Kolor czcionki'],['',1,14,'#FFFFFF']) );
/*11*/	elements.push(new pattern('Przełącznik',['variable','bodyColor'],['varB','color'],['Nazwa zmiennej','Kolor'],['','#666666']) );
/*12*/	elements.push(new pattern('Range',['variable','min','max','step','fillColor'],['varN','number','number','number','color'],['Nazwa zmiennej','Wartość minimalna','Wartość maksymalna','Krok','Kolor wypeĹnienia'],['','0','100','1','#485872']) );
/*13*/	elements.push(new pattern('Panel',['title','titleColor','glyph','bodyColor','round'],['text','color','glyph','color','number'],['Nagłówek','Kolor nagłówka', 'Ikona','Kolor tła','Zaokrąglenie krawędzi'],['Panel','#000000', '','#666666', '1']) );
/*14*/  elements.push(new pattern('Glyphicon',['glyph','size','color'],['glyph','number','color'],['Ikona','Rozmiar','Kolor'],['asterisk','30','#ffffff']));
/*15*/  elements.push(new pattern('Clock',['color','size'],['color','number'],['Kolor','Rozmiar'],['#ffffff','20']));
/*16*/  elements.push(new pattern('Date',['color','size'],['color','number'],['Kolor','Rozmiar'],['#ffffff','20']));
/*17*/  elements.push(new pattern('Pogoda',['color','location'],['color','text'],['Kolor','Lokalizacja'],['#ffffff','BIALYSTOK, PODLASKIE']));
/*18*/  elements.push(new pattern('Przycisk menu',['link'],['number'],['Odsyła do strony'], ["1"]) );
/*19*/  elements.push(new pattern('Show hide',['variable','img','inv','active'],['varB','text','text','text'],['Zmienna','Image','Odwróć','Aktywna zmienna?'], ["",'images/disable.png','false','false']) );
/*20*/  elements.push(new pattern('Boolen Text',['textON','textOFF','variable', 'fontSize', 'fontColor'],['text', 'text', 'varB', 'number','color'],['Tekst ON', 'Tekst OFF', 'Zmienna', 'Rozmiar czcionki', 'Kolor czcionki'], ['ON','OFF',"", 14,'#FFFFFF']) );
/*21*/  elements.push(new pattern('Selected Variable',['variable', 'fontSize', 'fontColor','selectedColor','multi'],['varN', 'number', 'color', 'color','number'],['Zmienna', 'Rozmiar', 'Kolor', 'Podświetlenie','mnoznik'], ['','20','#FFFFFF', '#000000','1']) );
/*22*/	elements.push(new pattern('SelVarBtn',['btnText','btnSize', 'btnFnc','bodyColor'],['text','number','text','color'],['Tekst przycisku','Rozmiar tekstu','Działanie','Kolor'], ["Button","20","set",'#666666']) );
/*23*/  elements.push(new pattern('Boolen Image',['imgON','imgOFF','variable','active'],['text', 'text', 'varB','text'],['Image ON', 'Image OFF', 'Zmienna','Aktywne'], ['ON.png','OFF.png',"",'off']) );
/*24*/	elements.push(new pattern('Time slider',['h1','h2','m1','m2','min','max','fillColor'],['var','var','var','var','number','number','color'],['Nazwa zmiennej h1','Nazwa zmiennej h2','Nazwa zmiennej m1','Nazwa zmiennej m2','Wartość minimalna','Wartość maksymalna','Kolor wypeĹnienia'],['','','','','0','100','#485872']) );
/*25*/	elements.push(new pattern('Anim',['img','variable'],['text','var'],['Obrazek','Nazwa zmiennej'],['','']) );
/*26*/	elements.push(new pattern('Text List',['variable','textArray','fontSize','fontColor'],['var','text','number','color'],['Zmienna','Tablica elementów','Rozmiar czcionki','Kolor czcionki'],['','','','']) );


		var glyphicons = ['','asterisk','plus','euro','minus','cloud','envelope','pencil','glass','music','search','heart','star','star-empty',
		'user','film','th-large','th','th-list','ok','remove','zoom-in','zoom-out','off','signal','cog','trash','home','file','time','road',
		'download-alt','download','upload','inbox','play-circle','repeat','refresh','list-alt','lock','flag','headphones','volume-off',
		'volume-down','volume-up','qrcode','barcode','tag','tags','book','bookmark','print','camera','font','bold','italic','text-height',
		'text-width','align-left','align-center','align-right','align-justify','list','indent-left','indent-right','facetime-video','picture',
		'map-marker','adjust','tint','edit','share','check','move','step-backward','fast-backward','backward','play','pause','stop','forward',
		'fast-forward','step-forward','eject','chevron-left','chevron-right','plus-sign','minus-sign','remove-sign','ok-sign','question-sign',
		'info-sign','screenshot','remove-circle','ok-circle','ban-circle','arrow-left','arrow-right','arrow-up','arrow-down','share-alt',
		'resize-full','resize-small','exclamation-sign','gift','leaf','fire','eye-open','eye-close','warning-sign','plane','calendar','random',
		'comment','magnet','chevron-up','chevron-down','retweet','shopping-cart','folder-close','folder-open','resize-vertical','resize-horizontal',
		'hdd','bullhorn','bell','certificate','thumbs-up','thumbs-down','hand-right','hand-left','hand-up','hand-down','circle-arrow-right',
		'circle-arrow-left','circle-arrow-up','circle-arrow-down','globe','wrench','tasks','filter','briefcase','fullscreen','dashboard',
		'paperclip','heart-empty','link','phone','pushpin','usd','gdp','sort','sort-by-alphabet','sort-by-alphabet-alt','sort-by-order',
		'sort-by-order-alt','sort-by-attributes','unchecked','expand','collapse-down','collapse-up','log-in','flash','log-out','new-window',
		'record','save','open','saved','import','export','send','floppy-disk','floppy-saved','floppy-removed','floppy-save','floppy-open',
		'credit-card','transfer','cutlery','header','compressed','earphone','phone-alt','tower','stats','sd-video','hd-video','subtitles',
		'sound-stereo','sound-dolby','sound-5-1','sound-6-1','sound-7-1','copyright-mark','registration-mark','cloud-download','cloud-upload',
		'tree-conifer','tree-deciduous'];

		glyphicons.sort();	//Posortuj alfabetycznie

	function createPopover(id, type) {
		d = document.createElement('div');

		uid = id.slice(4);
		for(i = 0; i < elements[type].editable.length; i++) {
						if(elements[type].editable[i] === 'glyph'){
				html = '<div class="form-group"><label>'+elements[type].description[i]+'</label><select id="'+elements[type].editable[i]+uid+'" class="form-control">';
				for(a=0; a < glyphicons.length; a++)	{
					if( eval("items["+uid+"]."+elements[type].editable[i]+"") == glyphicons[a])	{
						html += '<option selected>'+glyphicons[a]+'</option>';
					}else{
						html += '<option>'+glyphicons[a]+'</option>';
					}
				}
				html += '</select></div>';
				$(d).append(html);
			}else
			if(elements[type].type[i] === 'color'){
				$(d).append('<div class="form-group"><label>'+elements[type].description[i]+'</label><input type="color" id="'+elements[type].editable[i]+uid+'" class="form-control" value="'+eval("items["+uid+"]."+elements[type].editable[i]+"")+'"></div>');
			}else
			if(elements[type].type[i] === 'number'){
				$(d).append('<div class="form-group"><label>'+elements[type].description[i]+'</label><input type="number" id="'+elements[type].editable[i]+uid+'" class="form-control" value="'+eval("items["+uid+"]."+elements[type].editable[i]+"")+'"></div>');
			}else
			{
				$(d).append('<div class="form-group"><label>'+elements[type].description[i]+'</label><input type="text" id="'+elements[type].editable[i]+uid+'" class="form-control" value="'+eval("items["+uid+"]."+elements[type].editable[i]+"")+'"></div>');
			}
		}
		$(d).append('<div class="btn-group"><button class="btn" onclick="$(\'#'+id+'\').popover(\'hide\'); updateObject('+uid+',\'pop\');"><span class="glyphicon glyphicon-ok"></span>Zapisz</button><button class="btn" onclick="$(\'#'+id+'\').popover(\'hide\');"><span class="glyphicon glyphicon-remove"></span>Zamknij</button></div>');
		return $(d).html();
	}

	function item(act, param)	{
		if(act == "add")	{
			this.type = param.type;
			this.stack = param.stack;
			this.x = param.x;
			this.y = param.y;
			this.page = param.page;
			this.width = param.width;
			this.height = param.height;
			el = elements[elementsType.indexOf(this.type)];

			for(i=0; i < elements[elementsType.indexOf(this.type)].type.length; i++) {
				eval("this."+el.editable[i]+"=param."+el.editable[i]+";");
			}
		}

		if(act == "new")	{
			this.type = param;
			this.stack = 10;
			this.x = 0;
			this.y = 0;
			this.page = page;
			this.width = 100;
			this.height = 100;
			el = elements[elementsType.indexOf(this.type)];
			for(i=0; i < elements[elementsType.indexOf(this.type)].type.length; i++) {
				eval("this."+el.editable[i]+"='"+el.onSet[i]+"';");
			}
		}
	}

	function updateObject(id,n)	{
		if(n == "pop")	{
			el = elements[elementsType.indexOf(items[id].type)];
			for(i=0; i < elements[elementsType.indexOf(items[id].type)].type.length; i++) {
				eval("items["+id+"]."+el.editable[i]+"=$('#"+el.editable[i]+id+"').val();");
			}
		}

		$("#item"+id)
		.css({'left': items[id].x, 'top': items[id].y, 'z-index' : items[id].stack })
		.css({'width':items[id].width,'height':items[id].height});

		$(".glyphicon-save").text(" Zapisz").parent().removeClass('zapisano');

		switch(items[id].type)	{
			case 'text':
				$("#item"+id)
				.html(items[id].text)
				.css({'font-size':	items[id].fontSize+'px', 'color': items[id].fontColor,'text-align':'center'});
			break;

			case 'button':
				$("#item"+id)
				.css({'background':items[id].bodyColor, 'border':'solid 1px '+shadeColor(items[id].bodyColor,-10), 'font-size': items[id].btnSize+'px'})
				.html(items[id].btnText);
			break;

			case 'image':
				$("#item"+id)
				.find('img').attr('src', items[id].src )
				.css({"box-shadow": items[id].shadow});
			//	$("#item"+items[id].id).css({'width';
			break;

			case 'square':
				$("#item"+id)
				.css({
					'background-color':items[id].bodyColor,
					'border-radius': items[id].radius+'px',
					'opacity': items[id].alpha/100,
					'border': 'solid '+items[id].border+'px '+items[id].borderColor 
					});
			break;

			case 'diode':
				$("#item"+id);
			break;

			case 'grafana':
				$("#item"+id);
			break;

			case 'progressbar':
				$("#item"+id).find('.progress').children().css({'background': items[id].barColor});
				$("#item"+id).find('.progress').children().css('width',items[id].barVar).text(items[id].barVar);
			break;

			case 'gauge':
				$("#item"+id).empty();

				if(items[id].fillColor == "#ffffff") { color = ["#a9d70b", "#f9c802", "#ff0000"]; }
				else if(items[id].fillColor == "#000000") { color = ["#ff0000", "#f9c802","#41A62A" ]; } else { color = [items[id].fillColor]; }

				new JustGage({
					id: "item"+id,
					value: 67,
					min: items[id].min,
					max: items[id].max,
					symbol: items[id].symbol,
					shadowOpacity: 0.5,
					shadowSize: 2,
					shadowVerticalOffset: 3,
					decimals: items[id].decimals,
					valueFontColor: items[id].dataColor,
					gaugeWidthScale: items[id].widthScale,
					relativeGaugeSize: true,
					levelColors: color
				  });
			break;

			case 'donut':
				$("#item"+id).empty();

				if(items[id].fillColor == "#ffffff") { color = ["#a9d70b", "#f9c802", "#ff0000"]; }
				else if(items[id].fillColor == "#000000") { color = ["#ff0000", "#f9c802","#41A62A" ]; } else { color = [items[id].fillColor]; }

				new JustGage({
					id: "item"+id,
					value: 67,
					min: items[id].min,
					max: items[id].max,
					symbol: items[id].symbol,
					shadowOpacity: 0.5,
					shadowSize: 2,
					shadowVerticalOffset: 3,
					decimals: items[id].decimals,
					valueFontColor: items[id].dataColor,
					gaugeWidthScale: items[id].widthScale,
					relativeGaugeSize: true,
					donut: true,
					levelColors: color
				  });
			break;

			case 'variable':
				$("#item"+id)
				.html("$"+items[id].variable+"$")
				.attr('title',items[id].variable)
				.css({'color':items[id].fontColor, 'font-size': items[id].fontSize+'px','overflow':'hidden'});
			break;

			case 'switch':
				$("#item"+id)
				.html('<input type="checkbox" checked data-toggle="toggle" disabled>')
				.children().bootstrapToggle()

				$("#item"+id)
				.find('.toggle')
				.css({'border': 'solid 1px '+shadeColor(items[id].bodyColor,15)});

				$("#item"+id)
				.find('.toggle-on').css({'background': items[id].bodyColor});

				$("#item"+id)
				.find('.toggle-handle').css({'background': shadeColor(items[id].bodyColor,-10), 'border': 'solid 1px '+shadeColor(items[id].bodyColor,10)});
			break;

			case 'range':
				$("#item"+id)
				.html('<input type="range" min="'+items[id].min+'" max="'+items[id].max+'" data-orientation="horizontal" step="'+items[id].step+'" width="100%" disabled/>')
				.css({'width': items[id].width+'px','height':items[id].height+'px'});
				$("#item"+id).find("input").rangeslider({polyfill: false});
				$("#item"+id)
				.find('.rangeslider__fill')
				.css({'background':items[id].fillColor});
			break;

			case 'panel':
				$("#item"+id)
				.css({'background': items[id].bodyColor, 'border-radius':items[id].round+'px','border':'solid 1px '+shadeColor(items[id].bodyColor,5),'box-shadow': '0px 0px 3px 1px rgba(0,0,0,0.75)'})
				.find('.panelHead')
				.css({'color': items[id].titleColor, 'background':'linear-gradient('+items[id].bodyColor+' 70%,'+shadeColor(items[id].bodyColor,-10)+' 110%)','border-radius':items[id].round+'px '+items[id].round+'px 0px 0px'})
				.html("<span class='glyphicon glyphicon-"+items[id].glyph+"'> </span>"+items[id].title);
			break;

			case 'glyph':
				$("#item"+id)
				.html("<span class='glyphicon glyphicon-"+items[id].glyph+"'></span>")
				.css({'font-size':items[id].size+'px','color':items[id].color});
			break;

			case 'clock':
				$('#item'+id)
				.text(startTime())
				.css({'color':items[id].color,'font-size':items[id].size+'px', 'text-align':'center'});
			break;

			case "date":
				$('#item'+id)
				.text(getDate())
				.css({'color':items[id].color,'font-size':items[id].size+'px', 'text-align':'center'});
			break;

			case "weather":
				$.simpleWeather({
				location: items[id].location,
				woeid: '',
				unit: 'c',
				success: function(weather) {
					html = '<span style="font-size:40px"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span>';
					$('.weather').html(html)
					.css({'text-align':'center'});
				}
				});
			break;

			case 'menubtn':
				$("#item"+id)
				.css({'background': 'repeating-linear-gradient(45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px)', 'border':'solid 1px', 'opacity': '0.2'});
			break;

			case 'showhide':
				$("#item"+id)
				.find('img').attr('src', items[id].img )
			break;

			case 'booltxt':
				$("#item"+id)
				.html(">"+items[id].textON+"<")
				.css({'font-size':	items[id].fontSize+'px', 'color': items[id].fontColor,'text-align':'center'});
			break;

			case 'boolimg':
				$("#item"+id)
				.find('img').attr('src', items[id].imgON );
			break;
			
			case 'selvar':
				$("#item"+id)
				.html(">"+items[id].variable+"<")
				.css({'font-size':	items[id].fontSize+'px', 'color': items[id].fontColor,'text-align':'center','overflow':'hidden'});
			break;
			
			case 'selvarbtn':
				$("#item"+id)
				.css({'background':items[id].bodyColor, 'border':'solid 1px '+shadeColor(items[id].bodyColor,-10), 'font-size': items[id].btnSize+'px'})
				.html(items[id].btnText);
			break;
			
			case 'tslider':
				$("#item"+id)
				.html('<div class="nstSlider" data-range_min="'+items[id].min+'" data-enabled="false" data-range_max="'+items[id].max+'" data-cur_min="'+items[id].min+'"  data-cur_max="'+items[id].max+'">\
							<div class="bar"></div>\
							<div class="leftGrip"></div>\
							<div class="rightGrip"></div>\
						</div>\
						<div style="width: 50px; position: absolute; top: 0px;" class="leftLabel" />\
						<div style="width: 50px; position: absolute; top: 0px; right: 0px; text-align: right;" class="rightLabel" />\
						')
				.css({'width': items[id].width+'px','height':items[id].height+'px'});
						
				$('.nstSlider').nstSlider({
					"rounding": {
						"100": "1000",
						"1000": "10000",
						"10000": "100000"
					},
					"left_grip_selector": ".leftGrip",
					"right_grip_selector": ".rightGrip",
					"value_bar_selector": ".bar",
					"value_changed_callback": function(cause, leftValue, rightValue) {
						var $container = $(this).parent();
						$container.find('.leftLabel').text(leftValue);
						$container.find('.rightLabel').text(rightValue);
					}
				});
				
				$('.nstSlider').nstSlider('disable');
			break;
			
			case 'anim':
				$("#item"+id)
				.find('img').attr('src', items[id].img );
			break;
			
			case 'textList':
				$("#item"+id)
				.html("$"+items[id].variable+"$")
				.attr('title',items[id].variable)
				.css({'color':items[id].fontColor, 'font-size': items[id].fontSize+'px','overflow':'hidden'});
			break;

		}
	}

	function stack(id, dir){
		zindex = $("#item"+id).css("z-index");
		if(dir == "up")		zindex= Number(zindex)+1;
		if(dir == "down")	zindex= Number(zindex)-1;
		$("#item"+id).css("z-index", zindex);
		items[id].stack=zindex;
	}

	function newObject(act, param, _p)	{
		items.push(new item(act, param));

		id = items.length-1;
		if(_p) items[id].page = _p;
		d = document.createElement('span');
		$(d)
		.appendTo($("#page"+items[id].page))
		.css({'position':'absolute', 'z-index' : '10'})
		.attr('id','item'+id)
		.dblclick(function (){
			$(this).popover('show');
		})
		.popover({
			'html': true,
			'title':'<span class="glyphicon glyphicon-indent-left"></span> Parametry <div class="pull-right"><a href="#" onclick="stack('+id+',\'up\')"><span class="glyphicon glyphicon-arrow-up"></span></a><a href="#" onclick="stack('+id+',\'down\')"><span class="glyphicon glyphicon-arrow-down"></span></a><a href="#" onclick="removeObject('+id+')"><span class="glyphicon glyphicon-trash"></span></a></div>',
			'content': function() { return createPopover($(this).attr('id'), elementsType.indexOf(items[$(this).attr('id').slice(4)].type)); },
			'trigger':'manual',
			'container': 'body'
			})
		.click(function() {  active = $(this).attr('id'); var resizer = document.createElement('div'); resizer.className = 'resizer'; $('#worktable').children().children().removeClass('active'); $(this).addClass('active'); $('#worktable').find(".resizer").remove(); $(resizer).appendTo(this);  resizer.addEventListener('mousedown', initDrag, false); })
		.draggable({containment: "#worktable", grid: [ 10, 10 ], cancel: ".resizer", start: function() { $(this).popover('hide'); }, stop:  function() { $(".glyphicon-save").text(" Zapisz").parent().removeClass('zapisano'); items[$(this).attr('id').slice(4)].y = $(this).css('top'); items[$(this).attr('id').slice(4)].x = $(this).css('left'); } });

		switch(items[id].type)	{
			case 'text':
				$(d)
				.html(items[id].text)
				.css({'font-size':	items[id].fontSize+'px', 'color': items[id].fontColor,'text-align':'center'});
			break;

			case 'button':
				$(d)
				.css({'background':items[id].bodyColor, 'font-size':items[id].btnSize+'px'})
				.addClass("btn").html("Button");
			break;

			case 'image':
				$(d)
				.append("<img src='images/blank.png'/>")
				.css({"box-shadow": items[id].shadow});;
			break;

			case 'square':
				$(d)
				.css({'background-color':'#666', 'width':'100px','height':'100px'});
			break;

			case 'diode':
				$(d)
				.css({'width':'100px','height':'100px'})
				.append("<img src='images/OFF.png' width='100%' height='100%'/>");
			break;

			case 'grafana':
				$(d)
				.append('<img style="border: solid 1px;" src="images/grafana_icon.SVG" width="100%" height="100%"/>')
			break;

			case 'progressbar':
				$(d)
				.append('<div class="progress" style="height: 100%"><div class="progress-bar progress-bar-success" role="progressbar" style="width: 66%; background:'+items[id].barColor+'">66%</div></div>');
			break;

			case 'gauge':
				if(items[id].fillColor == "#ffffff") { color = ["#a9d70b", "#f9c802", "#ff0000"]; }
				else if(items[id].fillColor == "#000000") { color = ["#ff0000", "#f9c802","#41A62A" ]; } else { color = [items[id].fillColor]; }

				  var g = new JustGage({
					id: "item"+id,
					value: 67,
					min: items[id].min,
					max: items[id].max,
					symbol: items[id].symbol,
					shadowOpacity: 0.5,
					shadowSize: 2,
					shadowVerticalOffset: 3,
					decimals: items[id].decimals,
					valueFontColor: items[id].dataColor,
					title: items[id].dataText,
					gaugeWidthScale: items[id].widthScale,
					relativeGaugeSize: true,
					levelColors: color
				  });
			break;

			case 'donut':
				if(items[id].fillColor == "#ffffff") { color = ["#a9d70b", "#f9c802", "#ff0000"]; }
				else if(items[id].fillColor == "#000000") { color = ["#ff0000", "#f9c802","#41A62A" ]; } else { color = [items[id].fillColor]; }

				  var g = new JustGage({
					id: "item"+id,
					value: 67,
					min: items[id].min,
					max: items[id].max,
					symbol: items[id].symbol,
					shadowOpacity: 0.5,
					shadowSize: 2,
					shadowVerticalOffset: 3,
					decimals: items[id].decimals,
					valueFontColor: items[id].dataColor,
					gaugeWidthScale: items[id].widthScale,
					relativeGaugeSize: true,
					donut: true,
					levelColors: color
				  });
			break;

			case 'variable':
				$("#item"+id)
				.html("$"+items[id].variable+"$");
			break;

			case 'switch':
				$("#item"+id)
				.html('<input type="checkbox" checked data-toggle="toggle" disabled>')
				.children().bootstrapToggle();

				$("#item"+id)
				.find('toggle-group')
				.children().css({'border': 'solid 1px '+shadeColor(items[id].bodyColor,10)});

				$("#item"+id)
				.find('.toggle-on').css({'background':items[id].bodyColor});

				$("#item"+id)
				.find('.toggle-handle').css({'background':items[id].bodyColor});
			break;

			case 'range':
				$("#item"+id)
				.html('<input type="range" min="'+items[id].min+'" max="'+items[id].max+'" step="'+items[id].step+'" width="100%" disabled/>')
				.css({'width':'200px','height':'30px'});
				//rangeSlider.create($("#item"+items[id].id).find("input"))
				$("#item"+id).find("input").rangeslider({polyfill: false});
				$("#item"+id)
				.find('.rangeslider__fill')
				.css({'background':items[id].fillColor});
			break;

			case 'panel':
				$("#item"+id)
				.css({'width':'200px','height':'125px','background': items[id].bodyColor ,'border-radius':items[id].round+'px','border':'solid 1px '+shadeColor(items[id].bodyColor,10), 	'box-shadow': '0px 0px 3px 1px rgba(0,0,0,0.75)'})
				.append('<div class="panelHead" style="padding: 7px; width: 100%; height: 35px; color: '+items[id].titleColor+'; background: linear-gradient('+items[id].bodyColor+' 70%,'+shadeColor(items[id].bodyColor,-10)+' 110%)"><span class="glyphicon glyphicon-'+items[id].glyph+'"> </span>'+items[id].title+'</div>');
			break;

			case 'glyph':
				$("#item"+id)
				.html("<span class='glyphicon glyphicon-"+items[id].glyph+"'></span>")
				.css({'font-size':items[id].size+'px','color':items[id].color});
			break;

			case 'clock':
				$('#item'+id)
				.text(startTime())
				.css({'color':items[id].color,'font-size':items[id].size+'px', 'text-align':'center'});
			break;

			case 'date':
				$('#item'+id)
				.text(getDate())
				.css({'color':items[id].color,'font-size':items[id].size+'px', 'text-align':'center'});
			break;

			case "weather":
				$('#item'+id)
				.addClass("weather");
				$.simpleWeather({
				location: items[id].location,
				woeid: '',
				unit: 'c',
				success: function(weather) {
					html = '<span style="font-size:40px"><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</span>';
					$('.weather').html(html)
					.css({'text-align':'center'});
				}
				});
			break;

			case "menubtn":
				$(d)
				.css({'background': 'repeating-linear-gradient(45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px)', 'border':'solid 1px', 'opacity': '0.2', 'width':'100px', 'height': '100px'});
			break;

			case "showhide":
				$(d)
				.append("<img height='100%' width='100%' src='"+items[id].img+"'/>");
			break;

			case 'booltxt':
				$(d)
				.html(">"+items[id].textON+"<")
				.css({'font-size':	items[id].fontSize+'px', 'color': items[id].fontColor,'text-align':'center'});
			break;

			case 'boolimg':
				$(d)
				.append("<img src='images/blank.png'/>");
			break;
			
			case 'selvar':
				$(d)
				.html(">"+items[id].variable+"<")
				.css({'font-size':	items[id].fontSize+'px', 'color': items[id].fontColor,'text-align':'center'});
			break;
			
			case 'selvarbtn':
				$(d)
				.css({'background':items[id].bodyColor, 'font-size':items[id].btnSize+'px'})
				.addClass("btn").html("Button");
			break;
			
			case 'tslider':
				$("#item"+id)
				.html('<div class="nstSlider" data-range_min="'+items[id].min+'" data-enabled="false" data-range_max="'+items[id].max+'" data-cur_min="'+items[id].min+'"  data-cur_max="'+items[id].max+'">\
							<div class="bar"></div>\
							<div class="leftGrip"></div>\
							<div class="rightGrip"></div>\
						</div>\
						<div style="width: 50px; position: absolute; top: 0px;" class="leftLabel" />\
						<div style="width: 50px; position: absolute; top: 0px; right: 0px; text-align: right;" class="rightLabel" />\
						')
				.css({'width': items[id].width+'px','height':items[id].height+'px'});
						
				$('.nstSlider').nstSlider({
					"rounding": {
						"100": "1000",
						"1000": "10000",
						"10000": "100000"
					},
					"left_grip_selector": ".leftGrip",
					"right_grip_selector": ".rightGrip",
					"value_bar_selector": ".bar",
					"value_changed_callback": function(cause, leftValue, rightValue) {
						var $container = $(this).parent();
						$container.find('.leftLabel').text(leftValue);
						$container.find('.rightLabel').text(rightValue);
					}
				});
				
				$('.nstSlider').nstSlider('disable');
			break;
			
			case 'anim':
				$(d)
				.append("<img src='images/blank.png'/>");
			break;
						
			case 'textList':
				$("#item"+id)
				.html("$"+items[id].variable+"$");
			break;
			
		}
	}

	function removeObject(id)	{
		$("#item"+id).popover('hide').remove();
		delete items[id];
		//items[id] = 0;
	}

	var varName = [];
	var varType = [];
	var varReg = [];

	var varLength = varName.length;
	var editing = 0;

	function variables() {
			$("#variableModal").find(".modal-body").empty()
			.append('<table id="varTable" class="table"></table>');

			$("#varTable").append("<thead>	<tr>		<th>#</th>	<th>Nazwa zmiennej</th>		<th>Typ zmiennej</th>	<th>Rejestr / Funkcja</th>	<th>Opcje</th></tr>	</thead>");
			$("#varTable").append("<tbody></tbody>");

			for(i = 0; i < varName.length; i++) {
				$("#varTable").find('tbody').append('<tr id="row'+i+'">		<td>'+i+'</td>	<td class="varName">'+varName[i]+'</td>	<td class="varType">'+varType[i]+'</td>		<td class="varReg">'+varReg[i]+'</td>	<td>	<a><span class="glyphicon glyphicon-ok"></span></a> <a href="#" onclick="removeVar('+i+')"> <span class="glyphicon glyphicon-trash"></span></a> <a href="#" onclick="editVar('+i+');"><span class="glyphicon glyphicon-pencil"></span></a></td><tr>');
			}

			$("#variableModal").modal('show');
			varLength = varName.length
	}

	function addVar() {
		$("#varTable").find('tbody').append('<tr id="row'+varLength+'">		<td>'+varLength+'</td>	<td class="varName"><input type="text" class="form-control" place-holder="Nazwa zmiennej"></td>	<td class="varType"><select class="form-control"><option>Text</option><option>Number</option><option>Boolen</option><option>Function</option><option>OpenHAB</option></select></td>		<td class="varReg"><input type="text" class="form-control" place-holder="Numer rejestru"></td>	<td><a href="#" onclick="saveVar('+varLength+');"><span class="glyphicon glyphicon-ok"></span></a> <a href="#" onclick="removeVar('+varLength+');"><span class="glyphicon glyphicon-trash"></span></a> <a href="#" onclick="editVar('+varLength+');"><span class="glyphicon glyphicon-pencil"></span></a></td><tr>');
		varLength++;
	}

	function saveVar(id, name, type, reg)	{

		if(!name && !type && !reg) {
			name = $("#varTable").find("#row"+id).find(".varName").children().val();
			type = $("#varTable").find("#row"+id).find(".varType").children().val();
			reg = $("#varTable").find("#row"+id).find(".varReg").children().val();
		}

		if(name != "" && type != "" && reg != "" && editing == 0 && varName.indexOf(name) == -1 )	{
			$("#varTable").find("#row"+id).find(".varName").text(name);
			$("#varTable").find("#row"+id).find(".varType").text(type);
			$("#varTable").find("#row"+id).find(".varReg").text(reg);

			varName.push(name);
			varType.push(type);
			varReg.push(reg);

			$("#varTable").find("#row"+id).find(".glyphicon-ok").parent().removeAttr("href").removeAttr("onclick");
		}

		if(name != "" && type != "" && reg != "" && editing == 1 && varName.indexOf(name) == -1 )	{
			$("#varTable").find("#row"+id).find(".varName").text(name);
			$("#varTable").find("#row"+id).find(".varType").text(type);
			$("#varTable").find("#row"+id).find(".varReg").text(reg);

			varName[id] = name;
			varType[id] = type;
			varReg[id] = reg;
			$("#varTable").find("#row"+id).find(".glyphicon-ok").parent().removeAttr("href").removeAttr("onclick");
		}

	}

	function editVar(id)	{
		editing = 1;
		name = $("#varTable").find("#row"+id).find(".varName").text();
		reg = $("#varTable").find("#row"+id).find(".varReg").text();
		$("#varTable").find("#row"+id).find(".glyphicon-ok").parent().attr("href","#").attr("onclick","saveVar("+id+")");
		$("#varTable").find("#row"+id).find(".varName").html('<input type="text" class="form-control" place-holder="Nazwa zmiennej" value="'+name+'">');
		$("#varTable").find("#row"+id).find(".varReg").html('<input type="text" class="form-control" place-holder="Numer rejestru" value="'+reg+'">');

		html = '<select class="form-control"><option ';
		if($("#varTable").find("#row"+id).find(".varType").text() == "Text") html += "selected";
		html +='>Text</option><option ';
		if($("#varTable").find("#row"+id).find(".varType").text() == "Number") html += "selected";
		html += '>Number</option><option ';
		if($("#varTable").find("#row"+id).find(".varType").text() == "Boolen") html += "selected";
		html +='>Boolen</option><option ';
		if($("#varTable").find("#row"+id).find(".varType").text() == "Function") html += "selected";
		html +='>Function</option><option ';
		if($("#varTable").find("#row"+id).find(".varType").text() == "OpenHAB") html += "selected";
		html +='>OpenHAB</option></select>';

		$("#varTable").find("#row"+id).find(".varType").html(html);
	}

	function removeVar(id)	{
		varName.splice(id,1);
		varType.splice(id,1);
		varReg.splice(id,1);
		varLength--;
		variables();
	}

	function startApp()
	{
		$("#start").hide();
		$("#worktable").fadeIn();
		$("#toolbox").slideDown();
		$("#options").slideDown();
		$('#newApp').modal('show');
		$("#worktable").css({ 'height': 600 ,'width': 800 });
	}

	function save()	{
		$(".glyphicon-save").text(" Zapisano!").parent().addClass('zapisano');
		setTimeout(function() { $(".glyphicon-save").text(' Zapisz').parent().removeClass('zapisano'); }, 2500);

		var newItm = items;

		sendVar='[';
		for(i = 0; i < varName.length; i++)	{
			sendVar+= '{"name":"'+varName[i]+'", "type":"'+varType[i]+'", "reg":"'+varReg[i]+'"}';

			if(i != varName.length-1) sendVar+= ',';
		}
		sendVar+=']';

		while(newItm.indexOf(0) != -1)	{
			newItm.splice(newItm.indexOf(0),1);
		}

		output = '{"load": {"width": '+$("#appWidth").val()+',"height": '+$("#appHeight").val()+',"bodyColor": "'+$("#appColor").val()+'", "backgroundImage": "'+$("#appGif").val()+'", "openHAB": "'+$("#openHabAddr").val()+'", "variables": '+sendVar+',"content": '+JSON.stringify(newItm)+'}}';

		$.ajax({
			method: "POST",
			url: "file.php?q=save",
			data: {  data: output }
		})
		.done(function( html ) {
			console.log( html );
		});
	}

	function loadApp()	{
		$("#openApp").modal('show');
	}

	function load() {
		$.getJSON("schema.json",
		function( json ) {
		//json = JSON.parse( $("#loadScript").val() );
			//$("#openApp").modal('hide');
			$("#start").hide();
			$("#worktable").fadeIn();
			$("#nav").fadeIn();
			$("#toolbox").slideDown();
			$("#options").slideDown();

			$("#worktable").css({ 'height': json.load.height ,'width': json.load.width, 'background': json.load.bodyColor });
			$("#appWidth").val(json.load.width);
			$("#appHeight").val(json.load.height);
			$("#appColor").val(json.load.bodyColor);
			$("#appGif").val(json.load.backgroundImage);
			$("#btn_down").children().css({'top': json.load.height+'px'});

			//NEW
			$("#openHabAddr").val(json.load.openHAB);

			items = new Array();

			itm = $.map(json.load.content, function(el) { return el; });
			//$('#page1, #page2, #page3, #page4, #page5, #page6').empty().hide();


			for(var i = 0; i < itm.length; i++)	{
				newObject('add',itm[i]);
				updateObject(i,'');
			}

			varName = [];
			varReg = [];
			varType = [];
			varLength = 0;

			$.each( json.load.variables, function( i, item ) {
				addVar();
				saveVar(i, json.load.variables[i].name, json.load.variables[i].type, json.load.variables[i].reg);
			});
		});
	}

	function shareApp()	{
		$('#shareApp').modal('show');

		var newItm = items;

		sendVar='[';
		for(i = 0; i < varName.length; i++)	{
			sendVar+= '{"name":"'+varName[i]+'", "type":"'+varType[i]+'", "reg":"'+varReg[i]+'"}';

			if(i != varName.length-1) sendVar+= ',';
		}
		sendVar+=']';

		while(newItm.indexOf(0) != -1)	{
			newItm.splice(newItm.indexOf(0),1);
		}

		output = '{"load": {"width": '+$("#appWidth").val()+',"height": '+$("#appHeight").val()+',"bodyColor": "'+$("#appColor").val()+'", "backgroundImage": "'+$("#appGif").val()+'", "openHAB": "'+$("#openHabAddr").val()+'", "variables": '+sendVar+',"content": '+JSON.stringify(newItm)+'}}';

		$('#scriptApp').val(output);
	}

	function pg(num)	{
		$('#page1, #page2,#page3,#page4,#page5,#page6,#page7,#page8').hide();
		$('#page'+num).show();
		page = num;
	}

	function duplicate(id)	{
			newItm = items[id];
			newObject('add',newItm, page);
			console.log(items[items.length-1].page);
			updateObject(items.length-1,'');
			$("#item"+(items.length-1)).addClass('active');
	}

	//NEW
	function setOpenHab()	{
		addr = $("#openHabAddr").val();
		console.log("OpenHAB: " + addr);
		$("#openHab").modal('hide');
	}
	// //

	$(function(){
		$("#toolbox").hide();
		$("#options").hide();
		$("#nav").hide();

		$(document).keydown(function(e){
			if(e.ctrlKey && e.key == "x") {
				uid = active.slice(4);
				removeObject(uid);
			}
			if(e.ctrlKey && e.key == "c") {
				copy = active.slice(4);
			}
			if(e.ctrlKey && e.key == "v") {
				duplicate(copy);
			}
		});

		$('#newApp').find('form').on('submit', function (e) {
				$("#newApp").modal('hide');
				$("#worktable").css({ 'height': $("#appHeight").val() ,'width': $("#appWidth").val(), 'background': $("#appColor").val(), 'background-image': 'url("'+$("#appGif").val()+'")' });
				$("#nav").fadeIn();
				$("#btn_down").css({'top': $("#appHeight").val()+'px'});

				if($("#appID").text() == "")	{
					$.ajax({
						method: "POST",
						url: "db.php?q=blank",
						data: { name: $("#appTitle").val(), height: $("#appHeight").height(), width: $("#appWidth").width() }
					})
					.done(function( html ) {
						$("#appID").text(html);
					});
				}
		});

		$("#toolbox").click( function() {
				$(this).animate({
					left: "0"
				}, 200);
		});

		$("#worktable").click(function() {
				$("#toolbox").animate({
					left: "-200"
				}, 200);
		});

		$(".newObject").click(function() {
			setTimeout(function() {
				$("#toolbox").animate({
					left: "-200"
				}, 200);
			}
				,100);
		});
		
		$("#pageSelect").change(function(){
			pg($(this).val());
		});

		$('#grid').click(function() {
			if ($('#grid').is(':checked')) {
				$("#worktable").css({'background-image': "url('../images/grid.png')" });
			}else{
				$("#worktable").css({'background-image': 'none' });
			}
		});
	});
