/* 
* soScrollBar 1.0
* made by bujichong
* Email : bujichong@163.com
* 2013-09-04
*/

;(function () {
	$.fn.soScrollBar = function (o) {
		var o = $.extend({
			type : 1, //类型:1||2||'y'||'x'，垂直||水平||垂直||水平
			width:600,
			height:300
		},o||{});

		var _self = $(this);
		var p = Math.floor(Math.random()*1000000);
		var pId = 'soScorll-'+p;
		var scrollBarHtml = '<div class="soScrollArea"><p class="soScrollBar"><span class="s-scrollBar-dot s-scrollBar-dot-i"></span><span class="s-scrollBar-dot s-scrollBar-dot-ii"></span></p></div>';

		_self.wrap('<div id="'+pId+'" class="soScorllBody" style="height:'+o.height+'px;"></div>').wrap('<div class="soScorllWrap" style="position:relative;"></div>');
		var $box = $('#'+pId);
		$box.append(scrollBarHtml);

		var $o = {
			area : $box.find('.soScrollArea'),
			bar : $box.find('.soScrollBar'),
			wrap : $box.find('.soScorllWrap')
		}

		$o.wrap.css({
			'position' : 'relative',
			'height' : (o.height-10),
			'marginTop':'5px',
			'marginLeft':'5px',
			'marginRight' :'5px',
			'overflow' : 'hidden'
		});
		_self.css({position:'relative'});

		$o.area.height(o.height);

		var wH = $o.wrap.height();
		var selfH = _self.height();
		var perH = wH/selfH;
		var barH = parseInt(perH*o.height);
		var hbarH = barH/2;
		var sliderH = o.height - barH;
		var sliderCH = selfH - wH;
		var areaTop;
		var barTop = hbarH;

		if (perH<1) {
			$o.area.show();
			$o.bar.height(barH);

			$o.bar.mousedown(function () {
				$(document).unbind('mousemove').bind('mousemove',function (e) {
					$.F.mouseEvent(e);
				});
			});

			$o.area.click(function (e) {
				$.F.mouseEvent(e);
			});

			$(document).mouseup(function (e) {
				$(document).unbind('mousemove');
				$box.removeClass('soScroll-doing');
			});
		}

		$.F = {
			mouseEvent : function (e) {
				var t;
				if (typeof e == 'number') {//mousewheel
					t = barTop+ hbarH + e;
				}
				if (typeof e == 'object') {//mousemove,click
					var y = e.pageY;
					areaTop = $o.area.offset().top;
					t = y - areaTop;
				}
				t = (t<hbarH)?0:(t>(o.height-hbarH)?sliderH:(t-hbarH));
				barTop = t;
				var preT = parseInt(sliderCH*t/sliderH);
				_self.css('top',-preT);
				$box.addClass('soScroll-doing');
				$o.bar.css({'top':t});
			},
			addScrollListener : function (element, wheelHandle) {
				if(typeof element != 'object') return;
				if(typeof wheelHandle != 'function') return;
				// 监测浏览器
				if(typeof arguments.callee.browser == 'undefined') {
					var user = navigator.userAgent;
					var b = {};
					b.opera = user.indexOf("Opera") > -1 && typeof window.opera == "object";
					b.khtml = (user.indexOf("KHTML") > -1 || user.indexOf("AppleWebKit") > -1 || user.indexOf("Konqueror") > -1) && !b.opera;
					b.ie = user.indexOf("MSIE") > -1 && !b.opera;
					b.gecko = user.indexOf("Gecko") > -1 && !b.khtml;
					arguments.callee.browser = b;
				}
				if(element == window)element = document;
				if(arguments.callee.browser.ie){
					element.attachEvent('onmousewheel', wheelHandle);
				}else {
					 element.addEventListener(arguments.callee.browser.gecko ? 'DOMMouseScroll' : 'mousewheel', wheelHandle, false);
				}
			},
			wheelHandle : function (e) {
				var foot;
				if(e.wheelDelta) { // IE, KHTML, Opera
					foot = e.wheelDelta > 0 ? -10:10;//上:下
				} else { // Gecko
					 foot = e.detail < 0 ? -10:10;//上:下
				}
				$.F.mouseEvent(foot);
			}
		}

		$.F.addScrollListener(_self.get(0),$.F.wheelHandle);
		return _self;
		
	}
})(jQuery);