$(function() {

	var height = windowHeight();
	$(".banner").css("height", height+1);

	/mobile/i.test(navigator.userAgent) && !location.hash &&
		setTimeout(function () { height = windowHeight(); $(".banner").css("height", height+1); /*window.scrollTo(0, 1);*/ }, 1000);​

	!/mac ox x/i.test(navigator.userAgent) || /iphone|ipod|ipad/i.test(navigator.userAgent) &&
		$(".btn").text("Find out more");

	$(window).resize(function() {
		height = windowHeight();
		$(".banner").css("height", height+1);​
	});

	var item = Math.floor(Math.random()*3);

	$(".btn").on("click", function(){
    	$('html, body').animate({
        	scrollTop: $( $.attr(this, 'href') ).offset().top
    	}, 300);
    	return false;
	});

	switch(item){
		case 2:
			$(".cc").attr("href", "http://doctype.me").text("Photo credit: Aleks Dorohovich");
			break;
		case 1:
			$(".cc").attr("href", "http://imluke.me").text("Photo credit: Luke Chesser");
			break;
		default:
			$(".cc").attr("href", "http://alejandroescamilla.com").text("Photo credit: Alejandro Escamilla");
	}

	$(".banner").addClass("img-" + item);

	runAnimation();
});

var windowHeight = function() {
    var zoomLevel = document.documentElement.clientHeight / window.innerHeight;
    return window.innerHeight * zoomLevel;
};

function runAnimation(){
	var transitionEnd = whichTransitionEvent();

	$(".gradient").css("opacity", 1);

	setTimeout(function() { 
		$(".banner .position").css("opacity", 1);
	}, 1500);

	setTimeout(function() { 
		$(".banner .svg").css("webkitTransform", "rotate(-60deg)")
		.css("animationTransform", "rotate(-60deg)")
		.css("msAnimationTransform", "rotate(-60deg)")
		.css("oAnimationTransform", "rotate(-60deg)")
		.css("mozAnimationTransform", "rotate(-60deg)")
		.css("transform", "rotate(-60deg)");
		$("h1 .make").css("opacity", 1);
	}, 2000);

	$(".banner .svg").on(transitionEnd, function(e){
		
		setTimeout(function() {
			$(".banner .svg").css("webkitTransform", "rotate(-30deg)")
			.css("animationTransform", "rotate(-30deg)")
			.css("msAnimationTransform", "rotate(-30deg)")
			.css("oAnimationTransform", "rotate(-30deg)")
			.css("mozAnimationTransform", "rotate(-30deg)")
			.css("transform", "rotate(-30deg)");
			$("h1 .publish").css("opacity", 1);
		}, 300);
		
		$(".banner .svg").on(transitionEnd, function(e){
		
			setTimeout(function() {
				$(".banner .svg").css("webkitTransform", "rotate(0deg)")
				.css("animationTransform", "rotate(0deg)")
				.css("msAnimationTransform", "rotate(0deg)")
				.css("oAnimationTransform", "rotate(0deg)")
				.css("mozAnimationTransform", "rotate(0deg)")
				.css("transform", "rotate(0deg)");
				$("h1 .share").css("opacity", 1);

				setTimeout(function() {
					$("h1 .screencasts").css("opacity", 1);
					$(".btn").css({ "opacity": 1, "bottom": "2em" });
				}, 800);

			}, 300);
		
		});
	});
}

function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'OTransition':'otransitionend',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}