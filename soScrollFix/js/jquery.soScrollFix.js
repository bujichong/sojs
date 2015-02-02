/*
*soScrollFix 1.0
*made by bujichong 
*作者：不羁虫
*百度空间： http://www.bujichong.com/
*邮件地址：bujichong@163.com

*$(obj).soScrollFix({type : "scroll", position : 'default',autoHide : false,hideHeight : 400});
*$(obj).soScrollFix('scroll','top'); // scroll/fix 【第一个参数type，第二个参数position】

 */
(function ($) {

	$.fn.soScrollFix = function (param1,param2) {
		var o;
		if(arguments.length==1){//智能匹配参数
			o = (typeof(param1)==='string')?{type:param1}:param1;
		}else {
			o = {type:param1,position:param2}
		}

		var opt =$.extend({//默认参数
			type : "scroll", //'scroll'/ 'fix' 【scroll：浏览器滚动到目标对象，开始定位在顶部，fix：浏览器滚动，对象始终滚动在position设置的一种状态位置】
			position : 'default', // 'default'/'top'/'bottom' 【default：dom对象css的top,left,right原值不变（不可用bottom），fixed相对于整个屏幕不动，top：始终在顶部，bottom：始终在底部】
			autoHide: false, // false/true/'out' 【false：默认不隐藏，true：在hideHight高度内不可见，'out'：在hideHight高度外不可见】
			hideHeight : 400 //隐藏执行距离顶部的滚动高度
		},o||{});

		$(this).each(function () {//each执行
			var run = new $F(this,opt);
			run.init();
		});
	}

	var $F = function (o,opt) {
		this.o =$(o);
		this.opt = opt;
	}

	$F.prototype = {
		oInfo : null,
		IE6 : $.browser.msie&&($.browser.version == "6.0")&&!$.support.style, //判断ie6
		init : function () {//初始化
			var that = this,
				type = that.opt.type,
				$o = that.o;
			this._getOInfo();
			if (type ==="scroll") {that._typeScroll($o,that.oInfo);}
			if (type ==="fix") {that._typeFix($o,that.oInfo);}
			if (that.opt.autoHide) {
				that._autoHide($o,that.opt.autoHide,that.opt.hideHeight);
			}
		},
		_getOInfo : function () {//获取对象相关定位参数
			var $o = this.o;
			this.oInfo = {
				top : $o.offset().top,
				left : $o.offset().left,
				posLeft : $o.position().left,
				width :$o.width(),
				height :$o.height(),
				outHeight : $o.outerHeight(true),
				cssPos : $o.css('position'),
				cssWidth : $o.css('width'),
				cssTop: $o.css('top'),
				cssLeft: $o.css('left')
			};
		},
		_typeScroll : function ($o,info) {//scroll定位时事件
			var that = this,$o = $o,
				loopBox  = $o.clone().empty().css('height',info.height);
			$(window).scroll(function () {
				var st = parseInt($(window).scrollTop());
				if (st>=info.top) {
					$o.after(loopBox);
					$o.css({
						position:'fixed',
						top:0,
						left:info.left,
						width:info.width,
						zIndex:'10000'
					});
					if (that.IE6) {//ie6事件
						$o.css({position:'absolute',
							top:st,
							left:info.posLeft
						});
					}
				}else {
					if (loopBox) {loopBox.remove();}
					$o.css({
						position:info.cssPos,
						width:info.cssWidth,
						left:info.cssLeft,
						top:info.cssTop
					});
				}
			});
		},
		_typeFix : function ($o,info) {//fix定位时事件
			var that = this,$o = $o,newTop =info.top,position = that.opt.position;
			if (position ==="top") {// top定位
				newTop = 0;
			}
			if (position ==="bottom") {//bottom定位
				var wh = $(window).height();
				newTop = wh -info.outHeight;
			}
			$('body').append($o);
			$o.css({
				position:'fixed',
				top:newTop,
				left:info.left,
				width:info.width
			});
			if (that.IE6) {//ie6事件
				$o.css({
					position:'absolute',
					top:newTop,
					left:info.left
				});
			}
			$(window).scroll(function () {
				var st = parseInt($(window).scrollTop());
				if (that.IE6) {//ie6事件
					$o.css({
						position:'absolute',
						top:st+parseInt(newTop)
					});
				}
			});
		},
		_autoHide : function ($o,a,h) {//隐藏判断执行事件
			var that = this,$o = $o,a = a,h = h;
			(a === 'out')?$o.show():$o.hide();
			$(window).scroll(function () {
				var st = parseInt($(window).scrollTop());
				(a === 'out')?
					(st>h)?$o.fadeOut():$o.fadeIn():
					(st<h)?$o.fadeOut():$o.fadeIn();
			});
		}
	}


})(jQuery);