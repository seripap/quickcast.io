$(function() {
	$('video').quickCastPlayer();
});

(function($) {
	// Player initially based on http://www.inserthtml.com/2013/03/custom-html5-video-player/
	$.fn.quickCastPlayer = function(options) {

		// Add controls to mobile version and then return before quickcast player added
		// for now on mobile devices we just serve the standard html5 player
		if (/mobile/i.test(navigator.userAgent)) {
			$("video").attr("controls", true);
			return;
		}
		
		return this.each(function() {

			var $vid = $(this)[0];

			if(/chrome|mozilla/i.test(navigator.userAgent)) {
				var obj = $(this).find("source[type='video/webm']");
				$(this).children().remove();
				$(this).append(obj);
			}else{
				var obj = $(this).find("source[type='video/mp4']");

				if(/-small.mp4/i.test(obj.src))
					obj.src = obj.src.replace('-small.mp4','.mp4');

				$(this).children().remove();
				$(this).append(obj);
			}
			
			$vid.addEventListener('loadeddata', function() {

				var $this = $(this);

				var $video_width = $this.attr("data-width");
				var $video_height = $this.attr("data-height");
				var $video_intro = $this.attr("data-intro");
				var $video_outro = $this.attr("data-outro");
				var $micro = false;

				if ($video_width <= 300 || $video_height <= 300){
					$micro = true;
					$this.wrap('<div class="video micro"></div>');
				}else{
					$this.wrap('<div class="video"></div>');
				}

				if ($micro === false){
					if ($video_intro != ""){
						$(".play-button").append("<div><span>" + $video_intro + "</span></div>");
					}
				}
				
				var $that = $this.parent('.video');
				
				$('<div class="play-button"></div>'
					+ '<div class="player">'
					+ '<div class="pause-button"></div>'
						+ '<div class="progress">'
							+ '<div class="progress-bar">'
								+ '<div class="progress-button"> </div>'
							+ '</div>'
						+ '</div>'
						+ '<div class="time">'
							+ '<span class="ctime">00:00</span>' 
							+ '<span class="stime"> / </span>'
							+ '<span class="ttime">00:00</span>'
						+ '</div>'
						+ '<div class="volume">'
							+ '<div class="volume-icon v-change-0">'
								+ '<span> </span>'
							+ '</div>'
						+ '</div>'
						+ '<div class="fullscreen">'
							+ '<a href="#"> </a>'
						+ '</div>'
						+ '<div class="link">'
							+ '<a href="#"> </a>'
						+ '</div>'
					+ '</div>').appendTo($that);

				$that.bind('selectstart', function() { return false; });

				var $spc = $(this)[0], // Specific video
					$duration = $spc.duration, // Video Duration
					$originalTitle = document.title, // Page title (original)
					currentTime,
					$mclicking = false,
					$vclicking = false,
					$vidhover = false,
					$volhover = false, 
					$playing = false,
					$drop = false,
					$begin = false,
					$draggingProgess = false,
					x = 0,
					y = 0,
					vtime = 0,
					updProgWidth = 0,
					progWidth = $that.find('.progress').width();

				var bufferLength = function() {
					var buffered = $spc.buffered;

					$that.find('[class^=buffered]').remove();
					
					if(buffered.length > 0) {
						var i = buffered.length;
							
						while(i--) {
							$maxBuffer = buffered.end(i);
							$minBuffer = buffered.start(i);
												
							var bufferOffset = ($minBuffer / $duration) * 100;			
							var bufferWidth = (($maxBuffer - $minBuffer) / $duration) * 100;

							$('<div class="buffered"></div>').css({"left" : bufferOffset+'%', 'width' : bufferWidth+'%'}).appendTo($that.find('.progress'));
						}
					}
				} 
			
				bufferLength();
				
				var timeUpdate = function($ignore) {
					var time = Math.round(($('.progress-bar').width() / progWidth) * $duration);

					var curTime = $spc.currentTime;
					
					var seconds = 0,
						minutes = Math.floor(time / 60),
						tminutes = Math.floor($duration / 60),
						tseconds = Math.round(($duration) - (tminutes*60));
					
					if(time) {
						seconds = Math.round(time) - (60*minutes);
						if(seconds > 59) {
							seconds = Math.round(time) - (60*minutes);
							if(seconds == 60) {
								minutes = Math.round(time / 60); 
								seconds = 0;
							}
						}
					} 

					updProgWidth = (curTime / $duration) * progWidth;
					
					// zero pad
					if(seconds < 10) { seconds = '0'+seconds; }
					if(tseconds < 10) { tseconds = '0'+tseconds; }
					
					$that.find('.progress-bar').css({'width' : updProgWidth+'px'});

					var buttonPos = (updProgWidth-$that.find('.progress-button').width());
					if (buttonPos < 0) buttonPos = 0;
					$that.find('.progress-button').css({'left' : buttonPos+'px'});

					$that.find('.ctime').html(minutes+':'+seconds) 
					$that.find('.ttime').html(tminutes+':'+tseconds);
				
					if($spc.currentTime > 0 && $spc.paused == false && $spc.ended == false)
						bufferLength();

					if ($playing)
						document.title = 'Playing ' + minutes+':'+seconds + ' / ' + tminutes+':'+tseconds;
					else if ($spc.currentTime > 0)
						document.title = 'Paused ' + minutes+':'+seconds + ' / ' + tminutes+':'+tseconds;
					else
						document.title = $originalTitle;

					if ($micro === false && curTime <= 0){
						if ($video_intro != ""){
							if ($(".play-button div").length === 0)
								$(".play-button").append("<div><span></span></div>");
							$(".play-button div span").text($video_intro);
						}
					}
				}
				
				timeUpdate();

				$spc.addEventListener('timeupdate', timeUpdate);

				$(window).resize(function(){
					resize();
				});

				function resize()
				{
					if ($spc.currentTime >= $duration)
						$spc.currentTime = 0;

					progWidth = $that.find('.progress').width();

					timeUpdate();

					$that.find('.progress-bar').css({'width' : updProgWidth+'px'});

					var buttonPos = (updProgWidth-$that.find('.progress-button').width());
					if (buttonPos < 0) buttonPos = 0;
					$that.find('.progress-button').css({'left' : buttonPos+'px'});

					bufferLength();
				}

				if ($micro === false){
					$that.find('.player').css("opacity", 1);
					setTimeout(function() { $that.find('.player').css("opacity", 0); }, 3000);
				}else{
					$that.find('.player').css("display", "none");
					$(".play-button").append("<span></span>");
					var sizePlay = ($video_width / 1.4);

					if ($video_width > $video_height)
						sizePlay = ($video_height / 1.4);

					$(".play-button span").css("margin", "-" + parseInt(sizePlay/2) + "px 0 0 -" + parseInt(sizePlay/2) +"px");
					$(".play-button span").css({"width": parseInt(sizePlay) + "px", "height": parseInt(sizePlay) + "px"});
				}

				$that.find('.play-button, .pause-button').on('click', function(){

					if($spc.currentTime > 0 && $spc.paused == false && $spc.ended == false){
						$playing = false;
					}else{ 
						$playing = true; 
					}
					
					if($playing == false){
						if($spc.currentTime > 0 && $spc.ended == false)
							$('.play-button div').hide();

						$('.play-button, .pause-button').removeClass("playing");
						$spc.pause();
						bufferLength();
					}else{
						$('.play-button, .pause-button').addClass("playing");
						$begin = true;
						$spc.play();
					}		
					
				});
				
				$that.find('.progress').on('mousedown', function(e) {
					$mclicking = true;
					
					if($playing == true)
						$spc.pause();
					
					x = e.pageX - $that.find('.progress').offset().left;

					currentTime = (x / progWidth) * $duration;
					
					$spc.currentTime = currentTime;
				});
				
				$('body, html').on('mousemove', function(e){
					
					var playerTimerHideShow = null;

					if ($micro != true){
						$that.on("mouseover", function(){ 
							clearTimeout(playerTimerHideShow);
							$that.find('.player').css("opacity", 1);
						});

						$that.on("mouseout", function(){
							playerTimerHideShow = setTimeout(function() { $that.find('.player').css("opacity", 0); }, 1000);
						});
					}

					if($mclicking == true) {

						if ($spc.currentTime > 0)
							$('.play-button div').hide(200);
						else
							$('.play-button div').show(200);

						$draggingProgress = true;

						var progMove = 0;

						var buttonWidth = $that.find('.progress-button').width();
						
						x = e.pageX - $that.find('.progress').offset().left;
						
						if(x < 0){
							progMove = 0;
							$spc.currentTime = 0;
						} 
						else if(x > progWidth){
							$spc.currentTime = $duration;
							progMove = progWidth;	
						}else{
							progMove = x;
							currentTime = (x / progWidth) * $duration;
							$spc.currentTime = currentTime;	
						}

						$that.find('.progress-bar').css({'width' : progMove+'px'});
						var buttonPos = (updProgWidth-$that.find('.progress-button').width());
						if (buttonPos < 0) buttonPos = 0;
						$that.find('.progress-button').css({'left' : buttonPos+'px'});
					}	
				});

				$spc.addEventListener('playing', function() {	
					resize();
				});
				
				// When the video ends the play button becomes a pause button
				$spc.addEventListener('ended', function() {	
					$playing = false;

					if ($micro === false){
						if ($video_outro != ""){
							if ($(".play-button div").length === 0)
									$(".play-button").append("<div><span></span></div>");
							$(".play-button div span").text($video_outro);
							$(".play-button div").show();
						}
					}
						
					$('.play-button, .pause-button').removeClass("playing");
				});
				
				$that.find('.volume').on('click', function() {
					if($spc.volume == 1){
						$spc.volume = 0;
						$that.find('.volume').addClass("off");
					}else{
						$spc.volume = 1;
						$that.find('.volume').removeClass("off");
					}
				});
				
				
				$('body, html').on('mouseup', function(e) {
					$mclicking = false;
					$vclicking = false;
					$draggingProgress = false;
					
					if($playing == true)
						$spc.play();
					
					bufferLength();
				});
				
				if(!$spc.requestFullscreen && !$spc.mozRequestFullScreen && !$spc.webkitRequestFullScreen) {
					$('.fullscreen').hide();
				}
				
				$('.fullscreen').on("click", function() {
				
					if ($spc.requestFullscreen) {
						$spc.requestFullscreen();
					}
				
					else if ($spc.mozRequestFullScreen) {
						$spc.mozRequestFullScreen();
					}
					
					else if ($spc.webkitRequestFullScreen) {
						$spc.webkitRequestFullScreen();
					}
				
				});

				$('.link').on("click", function() {
					window.parent.postMessage(window.location.href.replace('/embed/','/'), '*');
					return false;			
				});
				
			});
			
		});
	
	}
	
})(jQuery);