"use strict";

//$(function () {

/* VARIABLES & CONSTANTS */
var vData = [];
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var player = new WebAudioFontPlayer();


var kDiv, hbd, hbdt, timems=0.9, durations = 0, count, position = 0, key, px;
var pitches = [], allowedKeys = [], channels = {}, nchannels = {}, ch0k, ch1k;
var record = document.getElementById('record')
var stop = document.getElementById('stop')
var save = document.getElementById('save')
var pkeys = document.querySelectorAll('#p-keys a')
const soundClips = document.querySelector('.sound-clips');
const soundStop = document.getElementById('sound-stop');
const soundOff = document.getElementById("sound-off")
var pValue = document.getElementById('pitch-value')
var value = parseInt(pValue.value)
var tunes = {}
var newSong =	{}, recording = false;
var n = 0, timen, xFlame=0, yFlame=0, newCount, notesCanvas, sound = true;
var allkeys;

var songs = {
	"birthday": {
		"tones": ["A", "A", "B", "A", "D+", "C#+", "A", "A", "B", "A", "E+", "D+", "A", "A", "A+", "F#+", "D+", "C#+", "B", "G+", "G+", "F#+", "D+", "E+", "D+"],
		"durations": [500, 500, 700, 700, 800, 1000, 600, 500, 900, 800, 900, 1000, 500, 500, 500, 500, 500, 500, 600, 500, 500, 500, 500, 600, 1000]
	},
}

var sel = document.getElementById('instruments');
for(var i = 0; i < player.loader.instrumentKeys().length; i++) {
	var opt = document.createElement('option');
	opt.innerHTML = ''+(i+1)+'. '+player.loader.instrumentInfo(i).title;
	if (i == 0) {
		opt.selected = 'selected'
	}
	sel.appendChild(opt);
}
var InstrNbr = 0
var info = player.loader.instrumentInfo(InstrNbr)
//var strtone = '_tone_0090_JCLive_sf2_file'
var strtone = info.variable;
player.loader.startLoad(audioContext, info.url, info.variable);

function selectInstruments(selected) {
	InstrNbr = selected.selectedIndex;
	info = player.loader.instrumentInfo(InstrNbr)
	console.log('selectInstruments', InstrNbr, info);
	player.loader.startLoad(audioContext, info.url, info.variable);
	player.loader.waitLoad(function () {
		console.log('done',info.variable);
		strtone = info.variable;
		//player.cancelQueue(audioContext);
		//started=false;
		//start();
	});
}

/* FUNCTIONS */
player.loader.decodeAfterLoading(audioContext, strtone);

function playKey(pitch, time=1) {
	player.queueWaveTable(audioContext, audioContext.destination, eval(strtone), 0, pitch, time);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Switch() {
	pkeys = document.querySelectorAll('#p-keys a')
	pValue = document.getElementById('pitch-value')
	value = parseInt(pValue.value)
	//console.log(pValue.value)
	for (var i = 0; i < pitches.length; i++) {
		var np = parseInt(pitches[i]+value)
		pkeys[i].setAttribute('href', 'javascript:playKey('+np+')')//, '+tones_files[position]+')')
		pkeys[i].setAttribute('pitch', np)
	}
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
var k = 0, p = 0
var durationsArr = []
var clickedDurationsArr = []
async function KeyPress (e, pressedkey="") {
	if (e && e.repeat) { return }
	if (pressedkey == "") {pressedkey = e.key.toLowerCase()}

	if (allowedKeys.includes(pressedkey)) {

		key = document.getElementById(pressedkey)
		key.click()
		var durations = 0
		clearInterval(count);

		//if (durationsArr[p] > 900) {durationsArr[p] = 900}

		if (recording == true && n == 1) {
			var a = document.getElementById(pressedkey)
			newSong.keybordKeys.push(pressedkey)
			newSong.keys.push(a.getAttribute('key'))
			newSong.idkeys.push(a.getAttribute('idkeys'))
			newSong.tones.push(a.getAttribute('tone'))
			newSong.pitches.push(a.getAttribute('pitch'))

			newSong.durations = durationsArr
		}
		count = setInterval(function() {
        durations+= 10;
        durationsArr[p] = durations;
        if (durationsArr[p] >= 900) {clearInterval(count)}
        //console.log(pressedkey) 
    }, 1);
		p++;

		kDiv = document.querySelector("#"+pressedkey+" div")
		if (kDiv != "null") {
			kDiv.classList.add("clicked")
		}
	}
}

async function KeyUp (e, pressedkey="") {
	if (pressedkey == "") {pressedkey = e.key.toLowerCase()}
	clearInterval(count);

	if (allowedKeys.includes(pressedkey)) {
		  //await sleep(200)
	  	//player.cancelQueue(audioContext);

			var kDiv = document.querySelector("#"+pressedkey+" div")
    	if (kDiv != "null") {
				kDiv.classList.remove("clicked")
    	}
    	/*if (durationsArr[p] > 900) {durationsArr[p] = 900}*/

			if (recording == true && n == 1) {
				var a = document.getElementById(pressedkey)
				//newSong.keybordKeys.push(pressedkey)
				//newSong.keys.push(a.getAttribute('key'))
				//newSong.idkeys.push(a.getAttribute('idkeys'))
				//newSong.tones.push(a.getAttribute('tone'))
				//newSong.pitches.push(a.getAttribute('pitch'))

				newSong.durations = durationsArr
				newSong.betweenClicksdurations = durationsArr
			}
			//console.log(durationsArr)
	  }
}

function Resize () {

  var px0
	for (var i = 0; i < vData.length; i++) {

		if (window.innerWidth > 700) {
			px = parseInt(vData[i].positionPX) + window.innerWidth * 0.271
      px0 = parseInt(vData[0].positionPX) + window.innerWidth * 0.271

		} else if (window.innerWidth > 633) {
			px = parseInt(vData[i].positionPX) + window.innerWidth * 0.05
			px0 = parseInt(vData[0].positionPX) + window.innerWidth * 0.05
		} else {
			px = parseInt(vData[i].positionPX) //+ window.innerWidth
			px0 = parseInt(vData[0].positionPX) //+ window.innerWidth
		}

  	$('#falling-notes').css({"margin-left": ""+px0 +'px'})
    $("."+vData[i].key).css({"position": "absolute", "left": ""+px +'px'})
	}

}
/* REQUESTS */

$.getJSON({
    url: 'getKeys/',
    success: function ( data ) {
    //console.log(Object.values(data)[0])
		vData = Object.values(data)
		var colorsb = [244, 203, 255]
    	for (var i=0; i < vData.length; i++) {
    		if (vData[i]) {
    				tunes[vData[i].tone] = vData[i].keybordKey
    				allowedKeys[i] = vData[i].keybordKey
    				pitches[i] = vData[i].defaultPitch
          	$("#p-keys").append('<a id="'+vData[i].keybordKey+'" pitch="'+ vData[i].defaultPitch +'" tone="'+vData[i].tone+'" key="'+vData[i].key+'" idKeys="'+vData[i].id+'" href="javascript:playKey('+ vData[i].defaultPitch +');"><div class="'+vData[i].key+' '+vData[i].position+'">&nbsp;'+vData[i].keybordKey+': <br>&nbsp;'+vData[i].tone+'</div></a>')
          	
          	$("#falling-notes").append('<canvas id="canvas-'+vData[i].keybordKey+'" class="'+vData[i].key+' canvas-'+vData[i].position+'" ></canvas>')
          	/*// style="background: rgb('+colorsb[0]+','+colorsb[1]+','+colorsb[2]+')"
          	colorsb[0] -= 10
          	colorsb[1] -= 10
          	colorsb[2] -= 10*/
          	Resize();
          	//px = parseInt(vData[i].positionPX) + window.innerWidth * 0.275
          	//$("."+vData[i].key).css({"position": "absolute", "left": ""+px +'px'})
          }
    	}
    },
    error: function(error) {
        $("body").html("<p style='color: red'>Enable to load keys "+error.status+"</p>")
    }
});

function getSongs () {
	$.getJSON({
	    url: 'getSongs/',
	    success: function ( data ) {
	    //console.log(Object.values(data)[0])
			var sData = Object.values(data)
			//console.log(sData)
	    	for (var i=0; i < sData.length; i++) {
	    		if (sData[i]) {
	    				$('#autoplay').append("<option value='"+sData[i].name+"'>"+sData[i].name+"</option>")
	    				songs[sData[i].name] = {
		    				"name": sData[i].name,
		                    "idkeys": sData[i].idkeys,
		                    "keybordKeys": sData[i].keybordKeys,
		                    "tones": sData[i].tones,
		                    "idSong": sData[i].idSong,
		                    "pitches": sData[i].pitches,
		                    "durations":sData[i].durations,
	                    }
	    		}
	        }
	    },
	    error: function(error) {
	        $("body").html("<p style='color: red'>Enable to load keys "+error.status+"</p>")
	    }
	});
}

async function ShowFallingFlame(e, key, sduration, kDiv, sound=false, d=20) {

	var src = "static/images/f2.png"
	var notesCanvas = document.getElementById('canvas-'+key)
	//var	kDiv = document.querySelector("#"+key+" div")
	var key = document.getElementById(key)
	var fallingFlameIns = new fallingFlame(notesCanvas);

	fallingFlameIns.setImgTag(src);
	//var imgtg = fallingFlameIns.getImgTag()
	//console.log(imgtg.height)
	var yFlame = fallingFlameIns.getYFlame()

	var newCount = setInterval(async function () {
	  	yFlame++;

	  	//console.log(yFlame)
	  	requestAnimationFrame(fallingFlameIns.draw.bind(fallingFlameIns))

	  	fallingFlameIns.setYFlame(yFlame)
	  	if (yFlame > notesCanvas.height) {
	  		if (sound == true) {key.click()}
	  		//key.click()

	  		kDiv.classList.add("clicked")

	  		clearInterval(newCount);

	  		await sleep(sduration)
   			fallingFlameIns.notesCtx.clearRect(fallingFlameIns.xFlame, fallingFlameIns.yFlame-5, 140, 10);  // clear canvas
   			//console.log(sduration)
   			//console.log(sduration)
			kDiv.classList.remove("clicked")
	  		//KeyPress(e, "w")
	  		return;
	  	}

	  }, d);

	
}

/* CALLS & EVENTS */
getSongs();

document.addEventListener("keypress", KeyPress)
document.addEventListener("keyup", KeyUp)
window.addEventListener("resize", Resize)

record.onclick = function () {

	recording = true
	if (recording == true && n == 0) {
		durationsArr = []
		p = 0
		newSong = {
				"keybordKeys": [],
				"pitches": [],
				"durations": [],
				"betweenClickDurations": [],
				"keys": [],
				"tones": [],
				"idkeys": [],
		}
		n = 1
	}
}

stop.onclick = function () {
	n = 0
	recording = false
	durationsArr = [0]
	p = 0
	if (newSong.durations.length > newSong.tones.length) {newSong.durations.shift()}
	console.log(newSong)
}

playr.onclick = async function () {
	var songName = document.getElementById('autoplay').value;
	//var sound = true
	hbd = newSong.tones
	if (newSong.durations.length > newSong.tones.length) {newSong.durations.shift()}
	//newSong.durations.shift()
	hbdt = newSong.durations
	let pitches = newSong.pitches
	let keybordKeys = newSong.keybordKeys
	//console.log(keybordKeys)
	for (var i = 0; i < hbd.length; i++) {

		var	kDiv = document.querySelector("#"+tunes[hbd[i]]+" div")

		ShowFallingFlame(e, tunes[hbd[i]], hbdt[i], kDiv, sound)
		await sleep(hbdt[i]);
		//kDiv = document.querySelector("#"+tunes[hbd[i]]+" div")
		//kDiv.classList.remove("clicked")

	}
}

save.onclick = function() {
	var data = {
		"csrfmiddlewaretoken": $("#p-keys :input[type='hidden']").val(),
		"name": "song_" +Date.now(),
		"song": JSON.stringify(newSong),
	}
	console.log($("form :input[type='hidden']").val())
	console.log(newSong)
	//download(JSON.stringify(newSong), "Song_"+timen+".json", 'text/plain');
	$.ajax({
		url:"saveSong/",
		type: 'POST',
		dataType: 'json',
		data: data,
		success: function (data) {
			console.log(data)
			getSongs();
		},
		error: function (data) {
			console.log(data)
		}
	})

}

soundClips.onclick = async function(e) {
	var songName = document.getElementById('autoplay').value;
	hbd = songs[songName].tones
	hbdt = songs[songName].durations
	//var sound = true
	for (var i = 0; i < hbd.length; i++) {
		
		//ShowFallingFlame(e, tunes[hbd[i]], hbdt[i], sound)
		//await sleep(hbdt[i]);
		var	kDiv = document.querySelector("#"+tunes[hbd[i]]+" div")
		ShowFallingFlame(e, tunes[hbd[i]], hbdt[i], kDiv, sound)
		await sleep(hbdt[i]);
		kDiv.classList.remove("clicked")

	}

}
soundOff.onclick = function () {
	if (sound == true) {
		sound = false
	} else {
		sound = true
	}
}
/*soundStop.onclick = function () {
	player.cancelQueue(audioContext);
}*/

//})