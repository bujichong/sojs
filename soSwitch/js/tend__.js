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
				delayLazy : true,
				delayTag : 'src3',
				delayTime :3000,
				callback : function () {}
			},o||{});
			var _self = $(this);
			var $m = _self.find(o.moveWrap);
			var $o = $m.find(o.obj);
			var oSize = $o.length;
			var nowIndex =o.defInx+1; //定义全局指针
			var index;//定义全局指针
			var startRun;//预定义自动运行参数
			var delayRun;//预定义延迟运行参数
			var delayState = false;
			var lockMove = false;

			//初始化
			var $first = $o.first().clone();
			var $last = $o.last().clone();
			$m.append($first).prepend($last);
			$o = $m.find(o.obj);
			var size = $o.length;
			$o.each(function (i,v) {
				$(v).css({left:(i*100+'%')});
			});
			$m.css({left:-100*nowIndex+'%'});
			
			if (o.delayLazy) {
				setTimeout(function () {
					$m.find('img').each(function () {
						$(this).attr('src',$(this).attr(o.delayTag)).removeAttr(o.delayTag);
					});
				},o.delayTime);
			}

			//$m.css({'position':'relative','width':o.tendWidth*size+'px'});
			//主切换函数
			function moveAB () {
				//window.console && console.log(lockMove);
				if (nowIndex != index&&!lockMove) {
					lockMove = true;
					if (o.thumb) {
						$(o.thumb).removeClass(o.thumbNowClass).eq(index-1).addClass(o.thumbNowClass);
					}
					if (o.slideTime <= 0) {
						if (index == (size-1)) {index = 1;}
						if (index == 0) {index = size-2;}
						$m.css({'left':-100*index+'%'});
						nowIndex = index;
						lockMove = false;
					}else {
						nowIndex = index;
						$m.animate({'left':-100*index+'%'},o.moveTime,function () {
							window.console && console.log(index);
							if (index > size-2) {
								index = 1;
								$m.css({left:'-100%'});
								nowIndex = index;
							}
							if (index == 0) {
								index = size-2;
								$m.css({left:-100*index+'%'});
								nowIndex = index;
							}
							if (o.thumb) {
								$(o.thumb).removeClass(o.thumbNowClass).eq(index-1).addClass(o.thumbNowClass);
							}
							if (o.callback) {o.callback(nowIndex, index)};
							lockMove = false;
						});
					}

				}
			}

			//切换到下一个
			function runNext() {
				//window.console && console.log('before:'+index);
				index = nowIndex+1;
				//window.console && console.log('afiter:'+index);
				moveAB();
			}

			//点击任一图片
			if (o.thumb) {
				var $t = $(o.thumb);
				
				//初始化thumbObj
				$t.removeClass(o.thumbNowClass).eq(nowIndex-1).addClass(o.thumbNowClass);
				$t.click(function () {
					index = $t.index($(this))+1;
					moveAB();
					if (o.clickFalse) {return false;}
				});
				if (o.thumbOverEvent) {
					$t.hover(function () {//去除jquery1.2.6不支持的mouseenter方法
						index = $t.index($(this))+1;
						delayRun = setTimeout(moveAB,o.delayTime);
					},function () {
						clearTimeout(delayRun);
					});
				}
			}

		//点击上一个
			if (o.btnNext) {
				$(o.btnNext).click(function () {
					runNext();
					return false;
				});
			}

		//点击下一个
			if (o.btnPrev) {
				$(o.btnPrev).click(function () {
					index = (nowIndex+size-1)%size;
					moveAB();
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

