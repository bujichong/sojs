/*
 *	soScroll 1.0 
 *	made by bujichong
 *	作者：不羁虫
 *百度空间： http://www.bujichong.com/
 *邮件地址：bujichong@163.com
 */
(function ($) {

	$.fn.soMarquee= function (o) {

	//this.each(function () {
		var opt = {
			direction :'left',// 滚动方向 ['left','right','up','down']
			wrapClass :'', // 外部临时生成盒子class
			width : null, // 滚动宽度，如果不设置为父盒子宽度
			height : null, // 滚动高度，如果不设置为父盒子高度
			step:1, // 滚动步长，1为1px，越大滚动越快，注意如果滚动有停顿，step须可以整除 li 的ouer宽(高)
			speed : 10, // 滚动速度周期，单位为毫秒，即10ms滚动1个步长，越小滚动越快
			pause :1000, // 停歇时间 单位 li 的停歇时间，单位为毫秒，设置为0，则不停歇
			//autoStart:true,
			overStop : true, //鼠标经过时是否中止滚动
			overEvent :function(){}, //鼠标经过事件 返回参数 (li,i),鼠标经过的li对象及对应的index值
			clickEvent : function () {} //鼠标经过事件 返回参数 (li,i),鼠标经过的li对象及对应的index值
		};
		var domData={};
		for (i in opt) {
			if ($(this).attr(i)) {
				domData[i]=$(this).attr(i);
			}
		}
		var data = $(this).data('marquee')||{};
		$.extend(opt,data,domData,o||{});
		var run = new $F(this,opt);
		run.init();
		return this;
	//});
	}

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
			var dInx = jQuery.inArray(opt.direction, ['left','right','up','down']);
			opt.step = (dInx%2)?opt.step:-opt.step;
			opt.width = opt.width?opt.width:o.parent().width();
			opt.height = opt.width?opt.height:o.parent().height();

			var wrapper = $('<div style="position:relative;overflow:hidden;"></div>');
			if (opt.wrapClass) {wrapper.addClass(opt.wrapClass);};

			if (dInx<2 && sonsW>opt.width) {
				o.width(sonsW*2);
				wrapper.css({'width':opt.width});
				if (opt.step > 0) {o.css({'marginLeft':-sonsW});}
			}else if (dInx>1 && sonsH>opt.height) {
				o.height(sonsH*2);
				wrapper.css({'height':opt.height});
				if (opt.step > 0) {o.css({'marginTop':-sonsH});}
			}else {return;}

			o.wrap(wrapper).append(sons.clone());

			var autoMarquee;

			//if (opt.autoStart== true || opt.autoStart=='true') {
				clearInterval(autoMarquee);
				autoMarquee = setInterval(_marquee,opt.speed);
			//}

			if (opt.overStop==true || opt.overStop== 'true') {
				o.hover(function () {
					clearInterval(autoMarquee);
				},function () {
					autoMarquee = setInterval(_marquee,opt.speed);
				});
			}

			o.find('li').mouseover(function () {
				i = o.find('li').index($(this))%sonL;
				return opt.overEvent(this,i);
			});
			o.find('li').click(function () {
				i = o.find('li').index($(this))%sonL;
				return opt.clickEvent(this,i);
			});

			function _marquee() {
				var m = 0,t;
				if (dInx < 2) {
					m = parseInt(o.css('marginLeft'));t = sonW;
					if (dInx ==0) {
						o.css({'marginLeft':-m>sonsW?0:(m+opt.step)+'px'});
					}else {
						o.css({'marginLeft':m>0?-sonsW:(m+opt.step)+'px'});
					}
				}else {
					m = parseInt(o.css('marginTop'));t = sonH;
					if (dInx == 2) {
						o.css({'marginTop':-m>sonsH?0:(m+opt.step)+'px'});
					}else{
						o.css({'marginTop':m>0?-sonsH:(m+opt.step)+'px'});
					}
				}

				if (opt.pause > 0) {
					if (m%t==0) {
						var tempStep = opt.step;
						opt.step = 0;
						setTimeout(function() {
							opt.step = tempStep;
						}, opt.pause);
					}
				}
				
			}
		}
	}

	$(function () {
		if ($('.soMarquee').length) {
			$('.soMarquee').each(function () {
				$(this).soMarquee();
			});
		}
	})

})(jQuery);