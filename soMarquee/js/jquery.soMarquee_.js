/*
 *	soScroll 1.0 
 *	made by bujichong
 *	作者：不羁虫
 *百度空间： http://www.bujichong.com/
 *邮件地址：bujichong@163.com
 */
(function ($) {

	var $F =  function (o,opt) {
		this.o = $(o);
		this.opt = opt;
	}

	$F.prototype = {
		init : function () {
			var that = this,o = this.o,opt = this.opt;
			var sons= o.find('li');
			var sonW = sons.outerWidth(true),sonH = sons.outerHeight(true),sonL = sons.length;
			var sonsW = parseInt(sonW)*sonL,sonsH = parseInt(sonH)*sonL;

			var wrapper = $('<div class="'+this.opt.wrapClass+'" style="position:relative;overflow:hidden;width:'+opt.width+'px;height:'+opt.height+'px;"></div>');
			o.wrap(wrapper).append(sons.clone());

			var dInx = jQuery.inArray(opt.direction, ['left','right','up','down']);
			var step = (dInx%2)?-opt.step:opt.step;
		
			if (dInx<2&&sonsW>opt.width) {
				o.width(sonsW*2);
				if (step < 0) {o.css({'marginLeft':sonsW});}
			}else if (dInx>1&&sonsH>opt.height) {
				o.height(sonsH*2);
				if (step < 0) {o.css({'marginTop':sonsH});}
			}else {return;}

			if (opt.autoStart) {run();}
			o.hover(function () {
				o.stop(true);
				return opt.stopEvent();
			},function () {
				run();
				return opt.runEvent();
			});

			function start() {run();}
			function stop() {o.stop();}

			function run() {
				switch (opt.direction) {
					case 'left' :that._scrollLeft(o,sonW);break;
					case 'right' :that._scrollRight(o,sonW);break;
					case 'up' :that._scrollUp(o,sonH);break;
					case 'down' :that._scrollDown(o,sonH);break;
					default :that._scrollLeft(o,sonW);
				}
			}
		},
		_marquee : function () {
			
		},
		_scrollLeft : function (o,sonW) {
			var that =this;
			o.animate({"marginLeft": "-"+sonW+"px"}, that.opt.speed,'linear',function () {
				o.append(o.find('li:first'));
				o.css('marginLeft','0px');
				that._scrollLeft(o,sonW);
			});
		},
		_scrollRight: function (o,sonW) {
			var that =this;
			o.prepend(o.find('li:last')).css('marginLeft',-sonW+'px');
			o.animate({"marginLeft": "0px"}, that.opt.speed,'linear',function () {
				that._scrollRight(o,sonW);
			});
		},
		_scrollUp : function (o,sonH) {
			var that =this;
			o.animate({"marginTop": "-"+sonH+"px"}, that.opt.speed,'linear',function () {
				o.append(o.find('li:first'));
				o.css('marginTop','0px');
				that._scrollUp(o,sonH);
			});
		},
		_scrollDown: function (o,sonH) {
			var that =this;
			o.prepend(o.find('li:last')).css('marginTop',-sonH+'px');
			o.animate({"marginTop": "0px"}, that.opt.speed,'linear',function () {
				that._scrollDown(o,sonH);
			});
		}
	}


	$.fn.soMarquee= function (o) {
		if (typeof o == 'string' ) {
			return $.fn.soScroll.methods[0](this);//调用相应的方法
		}
		var o =$.extend({
			direction :'left',
			wrapClass :'',
			width : null,
			height : null,
			step:1,
			speed : 2000,
			autoStart:true,
			overStop : true,
			stopEvent :function(){},
			runEvent :function(){}
		},o||{});

		this.each(function () {
			var run = new $F(this,o);
			run.init();
		});
	}

	$.fn.soMarquee.methods = {
		start : function () {
			
		},
		stop : function () {
			
		}
	}

})(jQuery);