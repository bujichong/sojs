/*
 *	soTend - simple object change with jQuery
 *	made by bujichong 2011-10-10
 *	作者：不羁虫  2013
 * http://www.bujichong.com/
 *E-mail:bujichong@163.com
 */
;(function($){
	$.fn.extend({
		"soTend": function(o){
			var o = $.extend({
				moveWrap : 'moveWrap',
				easing :'swing',//swing,linear
				obj : null,
				btnPrev : null,
				btnNext : null,
				thumb : null,
				thumbOverEvent:true,
				thumbNowClass : 'now',
				defInx : 0,
				overStop : true,
				clickFalse : true,
				autoChange : true,
				changeTime:5000,//自动切换时间
				moveTime:800,
				callback : function () {}
			},o||{});
			var _self = $(this);
			var $m = _self.find(o.moveWrap);
			var $o = $m.find(o.obj);
			var size = $o.length;
			var nowIndex =o.defInx; //定义全局指针
			var index;//定义全局指针
			var startRun;//预定义自动运行参数
			var delayRun;//预定义延迟运行参数
			var delayState = false;


			//$m.css({'position':'relative','width':o.tendWidth*size+'px'});
			//主切换函数
			function moveAB () {
				if (nowIndex != index) {
					if (o.thumb) {
						$(o.thumb).removeClass(o.thumbNowClass).eq(index).addClass(o.thumbNowClass);
					}
					if (o.slideTime <= 0) {
						$m.css({'left':-100*index+'%'});
					}else {
						$m.stop().animate({'left':-100*index+'%'},o.moveTime,function () {
							if (o.callback) {o.callback(nowIndex, index)}
						});
					}
					nowIndex = index;
				}
			}

			//切换到下一个
			function runNext() {
				index =  (nowIndex+1)%size;
				moveAB();
			}

			//初始化
			$m.css({'left':-100*nowIndex+'%'});

			//点击任一图片
			if (o.thumb) {
				var $t = $(o.thumb);
				
				//初始化thumbObj
				$t.removeClass(o.thumbNowClass).eq(nowIndex).addClass(o.thumbNowClass);
				$t.click(function () {
					index = $t.index($(this));
					moveAB();
					if (o.clickFalse) {return false;}
				});
				if (o.thumbOverEvent) {
					$t.hover(function () {//去除jquery1.2.6不支持的mouseenter方法
						index = $t.index($(this));
						delayRun = setTimeout(moveAB,o.delayTime);
					},function () {
						clearTimeout(delayRun);
					});
				}
			}

		//点击上一个
			if (o.btnNext) {
				$(o.btnNext).click(function () {
					if(_self.queue().length<1){runNext();}
					return false;
				});
			}

		//点击下一个
			if (o.btnPrev) {
				$(o.btnPrev).click(function () {
					if(_self.queue().length<1){
						index = (nowIndex+size-1)%size;
						moveAB();
					}
					return false;
				});
			}

		//自动运行
			if (o.autoChange) {
				clearInterval(startRun);
				startRun = setInterval(function () {
					if (!delayState) {
						runNext();
					}
				},o.changeTime);
				if (o.overStop) {
					_self.hover(function () {//去除jquery1.2.6不支持的mouseenter方法
						delayState = true;
					},function () {
						delayState = false;
					});

					if (o.thumb) {
						$(o.thumb,o.obj).hover(function () {
							delayState = true;
						},function () {
							delayState = false;
						});
					}
				}
			}



		}

	})

})(jQuery);

