/**
 * 
 */

(function() {
	var doughnutData = [ {
		value : 1,
		color : "#46BFBD",
		highlight : "#5AD3D1",
		label : "Security Updates"
	}, {
		value : 2,
		color : "#FDB45C",
		highlight : "#FFC870",
		label : "Security Updates"
	}, {
		value : 3,
		color : "#386bb7",
		highlight : "#6d96d2",
		label : "Security Updates"
	}, {
		value : 4,
		color : "#c43fa2",
		highlight : "#d26db8",
		label : "Security Updates"
	}, {
		value : 5,
		color : "#9334b1",
		highlight : "#bb6dd4",
		label : "Security Updates"
	}, {
		value : 6,
		color : "#F7464A",
		highlight : "#FF5A5E",
		label : "Security Updates"
	}
	];

	window.onload = function() {
		
		console.log("The element with security level is:"+document.getElementById("security-level"));
		if(document.getElementById("security-level")){
		  var ctx = document.getElementById("security-level").getContext("2d");
		  window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
			responsive : true
		});
		
		}
		
	};
	
	/*
	 * Initialize Bootcards.
	 * 
	 * Parameters:
	 * - offCanvasBackdrop (boolean): show a backdrop when the offcanvas is shown
	 * - offCanvasHideOnMainClick (boolean): hide the offcanvas menu on clicking outside the off canvas
	 * - enableTabletPortraitMode (boolean): enable single pane mode for tablets in portraitmode
	 * - disableRubberBanding (boolean): disable the iOS rubber banding effect
	 * - disableBreakoutSelector (string) : for iOS apps that are added to the home screen:
	                      jQuery selector to target links for which a fix should be added to not
	                      allow those links to break out of fullscreen mode.
	 */

	bootcards.init({
		offCanvasBackdrop : true,
		offCanvasHideOnMainClick : true,
		enableTabletPortraitMode : true,
		disableRubberBanding : true,
		disableBreakoutSelector : 'a.no-break-out'
	});

	//enable FastClick
	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);

	

	//activate the sub-menu options in the offcanvas menu
	$('.collapse').collapse();
})();

/* toggle between the chat and security */
function toggleChatData(event) {

	var $ev = $(event.target);
	var $chat = $ev.parents('.hack-chat');

	if ($chat.length > 0) {
		$chat.fadeOut('fast', function() {
			$chat.siblings('.hack-security-status').fadeIn('fast');
		});

	} else {
		var $status = $ev.parents('.hack-security-status');
		$status.fadeOut('fast', function() {
			$status.siblings('.hack-chat').fadeIn('fast');
		});

	}
}