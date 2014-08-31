jQuery.extend( jQuery.easing, {
//	def: 'easeInOutExpo',
//	swing: function (x, t, b, c, d) {
//		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
//	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
});

;(function ($) {
	$.fn.soScrollTo = function (o) {
		var o = $.extend({
			direction : 'y',//'y'||'x'
			speed : 800,//间隔时间
			offset : 0,//偏移
			easeType : 'easeInOutExpo'//'easeInOutExpo'||'swing'
		},o||{});
		var _self = $(this);
		_self.click(function () {
			var tim = $(this).attr('href');
			tim = $(tim!='#'?tim:'body');
			if(tim.length){
				var pos = {t:tim.offset().top+o.offset||0,l:tim.offset().left+o.offset||0};
				if (o.direction=='x') {
					$("html,body").stop().animate({'scrollLeft': pos.l}, o.speed,o.easeType);
				}else {
					$("html,body").stop().animate({'scrollTop': pos.t}, o.speed,o.easeType);
				}
			}
			return false;
		});
	}
})(jQuery);
