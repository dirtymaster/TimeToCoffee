let popupLoad = document.querySelector(".popup-load");
window.addEventListener("load", function() {
    popupLoad.classList.add("hide");
    setTimeout(function() {
        popupLoad.remove();
    }, 600);
});



//Определяем resolution после загрузки страницы
let resolution = window.localStorage.getItem("resolution");
if (resolution != "360p" && resolution != "1080p") {
	resolution = "720p";
}
//Меняем видео каждые...
let videoURL = [ // Список ссылок на видео
	`background videos/${resolution}/1.mp4`,
	`background videos/${resolution}/2.mp4`,
	`background videos/${resolution}/3.mp4`,
	`background videos/${resolution}/4.mp4`,
	`background videos/${resolution}/5.mp4`,
	`background videos/${resolution}/6.mp4`,
	`background videos/${resolution}/7.mp4`,
	`background videos/${resolution}/8.mp4`,
	`background videos/${resolution}/9.mp4`
],
	videoEL = document.querySelector('.random-video'), // Блок обёртка всех видео
	oldVideo = Math.floor(Math.random() * videoURL.length), // Рандомно выберем старовое видео (можно прописать индекс любого видео из списка)
	videos, // Тут будем хранить список всех видео
	timerTime = 1000*900, // Кол-во мс, через сколько будет смена видео
	opacityTime = 1500; // Кол-во мс, за сколько сменится видео ("плавность" перехода)

// Стартуем(©)
for(let url of videoURL) { // Проходим циклом по списку видео
	videoEL.insertAdjacentHTML('beforeend', `<video src="${url}" preload="metadata" muted loop></video>`); // И создаём видео внутри блока для видео
}
videos = videoEL.querySelectorAll('video'); // Далее записываем все видео из блока в переменную
videos[oldVideo].play(); // Запускаем "стартовое" видео
videos[oldVideo].style.opacity = 1; // Выставляем ему "видемость"
videoEL.style.setProperty('--opacity-time', opacityTime); // Указываем время плавности перехода для всех видео ("переход делаем через CSS)
function RandomVideo() { // Запускаем функцию смены видео в рекурсивном таймере
	let newVideo = function NewVideo() {
		let rand = Math.floor(Math.random() * videoURL.length);
		if(oldVideo === rand) return NewVideo(); else return rand;
	}(); // Рандомно берём видео из списка
  
	let oldVideoEL = videos[oldVideo]; // Берём "старое" видео (точнее текущее, которое воспроизводится сейчас)
	oldVideoEL.style.opacity = 0; // плавно "спрячем"
	setTimeout(function() { // После того как закончится плавный проход прозрачности, выполним это:
		oldVideoEL.pause(); // Остановим "старое" видео
		oldVideoEL.currentTime = 0; // Поставим время на 0, чтобы потом он начался сначала
	}, opacityTime);

	let newVideoEL = videos[newVideo]; // "Новое" видео (или следующее рандомное)
	newVideoEL.play(); // Запустим "новое" видео
	newVideoEL.style.opacity = 1; // плавно "покажем" его
	oldVideo = newVideo; // Теперь "новое" видео будет "старым" (текущим)
    setTimeout(RandomVideo, timerTime);
};
let videoTimer = setTimeout(RandomVideo, timerTime);



//Убрать экран loading, когда видео загрузится
document.querySelector("video").oncanplaythrough = function() {
    document.querySelector(".video-load").style.display = 'none'
};








//Таймер
/** Represents a timer that can count down. */
let congrats = true;
let CountdownTimer = function (seconds, tickRate) {
    this.seconds = seconds || (25*60);
    this.tickRate = tickRate || 500; // Milliseconds
    this.tickFunctions = [];
    this.isRunning = false;
    this.remaining = this.seconds;

    /** CountdownTimer starts ticking down and executes all tick
        functions once per tick. */
    this.start = function() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        document.querySelector(".congrats").classList.add("hide");
        
        // Set variables related to when this timer started
        var startTime = Date.now(), 
            thisTimer = this;
         
        // Tick until complete or interrupted
        (function tick() {
            secondsSinceStart = ((Date.now() - startTime) / 1000) | 0;
            var secondsRemaining = thisTimer.remaining - secondsSinceStart;
            
            // Check if timer has been paused by user
            if (thisTimer.isRunning === false) {
                thisTimer.remaining = secondsRemaining;
            } else {
                if (secondsRemaining > 0) {
                    // Execute another tick in tickRate milliseconds
                    setTimeout(tick, thisTimer.tickRate);
                } else {
                    // Stop this timer
                    thisTimer.remaining = 0;
                    thisTimer.isRunning = false;

                    // Alert user that time is up
                    playAlarm();
                }
                
                var timeRemaining = parseSeconds(secondsRemaining);
                
                // Execute each tickFunction in the list with thisTimer
                // as an argument
                thisTimer.tickFunctions.forEach(
                    function(tickFunction) {
                        tickFunction.call(this, 
                                          timeRemaining.minutes, 
                                          timeRemaining.seconds);
                    }, 
                    thisTimer);
            }
        }());        
    };

    /** Pause the timer. */
    this.pause = function() {
        this.isRunning = false;
    };

    /** Pause the timer and reset to its original time. */
    this.reset = function(seconds) {
        this.isRunning = false;
        this.seconds = seconds;
        this.remaining = seconds;
    };

    /** Add a function to the timer's tickFunctions. */
    this.onTick = function(tickFunction) {
        if (typeof tickFunction === 'function') {
            this.tickFunctions.push(tickFunction);
        }
    };
}

/** Return minutes and seconds from seconds. */
let parseSeconds = function (seconds) {
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    }
}

/** Play the selected alarm at selected volume. */
let playAlarm = function () {
    
    var alarmAudio = new Audio("audio/one_bell.mp3");
    alarmAudio.play();
    if (congrats) {
    	document.querySelector(".congrats").classList.remove("hide");
    }
    

}

/** Window onload functions. */
window.onload = function () {
    var timerDisplay = document.getElementById('timer'),
        customTimeInput = document.getElementById('ipt_custom'),
        timer = new CountdownTimer(),
        timeObj = parseSeconds(25*60);
    
    /** Set the time on the main clock display and
        set the time remaining section in the title. */
    function setTimeOnAllDisplays(minutes, seconds) {
        if (minutes >= 60) {
            // Add an hours section to all displays
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
            clockHours = hours + ':';
            
        } else {
            clockHours = '';
            
        }
        
        clockMinutes = minutes < 10 ? '0' + minutes : minutes;
        clockMinutes += ':';
        clockSeconds = seconds < 10 ? '0' + seconds : seconds;

        timerDisplay.textContent = clockHours + clockMinutes + clockSeconds;

        
    } 
    
    /** Revert the favicon to red, delete the old timer
        object, and start a new one. */
    function resetMainTimer(seconds) {

        timer.pause();
        timer = new CountdownTimer(seconds); 
        timer.onTick(setTimeOnAllDisplays);
    }
    
    // Set default page timer displays
    setTimeOnAllDisplays(timeObj.minutes, timeObj.seconds);

    timer.onTick(setTimeOnAllDisplays);
    
    // Add listeners for start, pause, etc. buttons
    document.getElementById('btn_start').addEventListener(
        'click', function () { 
            timer.start(); 
        });
        
    document.getElementById('btn_pause').addEventListener(
        'click', function () {
            timer.pause(); 
        });
        
    document.getElementById('btn_reset').addEventListener(
        'click', function () {
            resetMainTimer(timer.seconds);
            timer.start();
            congrats = true;
            document.querySelector(".congrats").classList.add("hide");
        });
    document.getElementById('btn_shortbreak').addEventListener(
        'click', function () {
            resetMainTimer(5*60);
            timer.start();
            congrats = false;
            document.querySelector(".congrats").classList.add("hide");
        });
        
    
        
    document.getElementById('btn_custom').addEventListener(
        'click', function () {
        	document.querySelector(".congrats").classList.add("hide")
            customUnits = document.getElementById('custom_units').value
            if (customUnits === 'minutes') {
                resetMainTimer(customTimeInput.value*60);
            } else if (customUnits === 'hours') {
                resetMainTimer(customTimeInput.value*3600);
            } else {
                resetMainTimer(customTimeInput.value);
            }
            timer.start();
        });
        
    // Bind keyboard shortcut for starting/pausing timer
    
};



//Трансформируем textarea
let tx = document.getElementsByTagName('textarea');
let OnInput = function() {
	this.style.height = 'auto';
	this.style.height = (this.scrollHeight) + 'px';//////console.log(this.scrollHeight);
}
for (var i = 0; i < tx.length; i++) {
	tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
	tx[i].addEventListener("input", OnInput, false);
}






document.querySelector(".p1080").addEventListener("click", function () {
	window.localStorage.setItem("resolution", "1080p");
	window.location.hash = "";
	window.location.reload();
});
document.querySelector(".p720").addEventListener("click", function () {
	window.localStorage.setItem("resolution", "720p");
	window.location.hash = "";
	window.location.reload();
});
document.querySelector(".p360").addEventListener("click", function () {
	window.localStorage.setItem("resolution", "360p");
	window.location.hash = "";
	window.location.reload();
});


switch (resolution) {
	case "1080p":
		document.querySelector(".p1080").insertAdjacentHTML("afterbegin", "✔️ ");
		break;
	case "720p":
		document.querySelector(".p720").insertAdjacentHTML("afterbegin", "✔️ ");
		break;
	case "360p":
		document.querySelector(".p360").insertAdjacentHTML("afterbegin", "✔️ ");
		break;
}







//Поменять плейер
let spotifyPlayer = document.getElementById("spotify-player");
if (spotifyPlayer.innerHTML != '<iframe class="spotify_frame" src="https://open.spotify.com/embed/album/33FiXrPqAW1gYMxFfFgWcm?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>') {
	spotifyPlayer.innerHTML = window.localStorage.getItem("player");
}

let players = ['<iframe class="spotify_frame" src="https://open.spotify.com/embed/album/33FiXrPqAW1gYMxFfFgWcm?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //Coffee Shop Background Noise
			   '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX9RwfGbeGQwP?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //Lo-Fi Cafe
			   '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DWVqfgj8NZEp1?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //Coffee Table Jazz
               '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZwtERXCS82H?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //Reading Soundtrack
               '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //Coding Mode
               '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37wAlecHkD8yywYadgkfQf?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //I Miss My Cafe
               '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8ymr6UES7vc?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>', //Rain Sounds
               '<iframe class="spotify_frame" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXaa8UmWJHYTU?utm_source=generator&amp;theme=0" width="100%" height="280" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'//Fire Sounds
              ];

document.querySelector(".change-playlist").addEventListener("click", changePlayer);
function changePlayer() {
    
  do {
  var randomPlayer = players[Math.floor(Math.random()*players.length)];
  } while (randomPlayer == spotifyPlayer.innerHTML);
  spotifyPlayer.innerHTML = randomPlayer;
  window.localStorage.setItem("player", randomPlayer);
};
document.querySelector(".coffee-shop-background-noise").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[0];
});
document.querySelector(".lofi-cafe").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[1];
});
document.querySelector(".coffee-table-jazz").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[2];
});
document.querySelector(".reading-soundtrack").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[3];
});
document.querySelector(".coding-mode").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[4] ;
});
document.querySelector(".i-miss-my-cafe").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[5];
});
document.querySelector(".rain-sounds").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[6];
});
document.querySelector(".fire-sounds").addEventListener("click", function() {
	spotifyPlayer.innerHTML = players[7];
});








let setCustomPlayer = function () {
	let inputText = document.querySelector("#spotify-code").value;
	inputText = inputText.replace('height="380"', 'height="280"');
	inputText = inputText.replace('height="80"', 'height="280"');
	inputText = inputText.replace("<iframe", "<iframe class='spotify_frame'");
	inputText = inputText.replace('generator"', 'generator&amp;theme=0"');
	document.getElementById("spotify-player").innerHTML = inputText;
};
document.querySelector("#embed").addEventListener("click", setCustomPlayer);


//document.querySelector(".arrow-container").innerHTML = '<img src="images/arrow.png" alt="" class="arrow">';
let arrow = document.querySelector(".arrow")
arrow.addEventListener("click", function() {
	arrow.classList.toggle("rotated");
	document.querySelector(".spotify-player").classList.toggle("spotify-player-hover");
});

//Выпадающий список
let listHead = document.querySelector(".list-head");

let show = function () {
	document.querySelector(".list").classList.toggle("show");
	listHead.classList.toggle("rotated-settings");
};
listHead.addEventListener("click", show);
window.addEventListener("click", function(event) {
	if (!event.target.matches('.list-head')) {
		var dropdowns = document.getElementsByClassName("list");
		for (var i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
});


let textarea = document.querySelector(".current-project__textarea");
textarea.oninput = function() {
	window.localStorage.setItem("textarea", textarea.value);
};
textarea.value = window.localStorage.getItem("textarea");


document.querySelector(".fullscreen").addEventListener("click", function(){
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.documentElement.requestFullscreen();
	}
});



//Скрыть таймер
let thisLink = document.querySelector(".hide-timer");
thisLink.addEventListener("click", function() {
	document.querySelector(".timer").classList.toggle("hide");
});



//Изменить локацию
document.querySelector(".change-location").addEventListener("click", RandomVideo);


if (window.localStorage.getItem("entranceNumber") == undefined) {
	window.localStorage.setItem("entranceNumber", 1);
	window.location.hash = "onboarding";
};
if (window.localStorage.getItem("entranceNumber") > 0) {
	window.localStorage.setItem("entranceNumber", String(Number(window.localStorage.getItem("entranceNumber"))+1));
};