/* 
* soScrollBar 1.0
* made by bujichong
* Email : bujichong@163.com
* 2013-09-04
*/
/* jquery.mousewheel.min */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);

;(function () {
	$.fn.soScrollBar = function (o) {
		var o = $.extend({
			type : 2, //类型:1||2||'x'||'y'，垂直||水平||垂直||水平
			width:600,
			height:300
		},o||{});

		this.each(function () {
			var _self = $(this);
			var p = Math.floor(Math.random()*10000000);
			window.console && console.log(p);
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
				'marginTop':'5px',
				'marginLeft':'5px',
				'marginRight' :'5px',
				'overflow' : 'hidden'
			});
			_self.css({position:'relative'});

			if (o.type===2||o.type==='y') {
				$o.wrap.css({
					'height' : (o.height-10)
				});
				$o.area.css({
					height:o.height,
					top:'1px',
					right:'1px'
				});
			}
			if (o.type===1||o.type==='x') {
				$box.addClass('soScorllBody-x');
				$o.area.css({
					width:o.width,
					left:'1px',
					bottom:'1px'
				});
			}

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
						mouseEvent(e);
					});
				});

				$o.area.click(function (e) {
						mouseEvent(e);
				});

				$(document).mouseup(function (e) {
					$(document).unbind('mousemove');
					$box.removeClass('soScroll-doing');
				});

				_self.mousewheel(function (e,d) {
					var foot = -10*d;
					mouseEvent(foot);
					return false;
				});
			}

			function mouseEvent(e) {
				var t;
				if (typeof e == 'number') {//mousewheel
					t = barTop+ hbarH + e;
				}
				if (typeof e == 'object') {//mousemove,click
					var y = e.pageY;
					areaTop = $o.area.offset().top;
					t = y - areaTop;
					$box.addClass('soScroll-doing');
				}
				t = (t<hbarH)?0:(t>(o.height-hbarH)?sliderH:(t-hbarH));
				barTop = t;
				var preT = parseInt(sliderCH*t/sliderH);
				_self.css('top',-preT);
				$o.bar.css({'top':t});
			}

		});
		return this;
		
	}
})(jQuery);