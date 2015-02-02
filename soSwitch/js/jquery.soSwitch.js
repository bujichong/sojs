/*
*	soSwitch 1.0 - simple gallery with jQuery
*	made by bujichong
*	作者：不羁虫
* http://www.bujichong.com/
*/

;(function($){
	$.fn.soSwitch = function (o) {
		var opt = {
			/* slider对象属性 */
			switchType : 'fade',//切换方式 为['left','right','up','slide','slideUpDown','fade','slideUp','slideDown','scrollUp','scrollDown','scrollLeft','scrollRight','scrollUpDown','scrollLeftRight','random']中任意一值，无则直接切换
			switchObj : 'div', //切换子对象 默认为div,如 'img' '.divSlide'
			easing :'swing',//swing,linear
			wrapCls : 'soSwitch-wrap',
			autoChange: true,//是否自动切换，默认是true
			overStop : true, //鼠标经过时是否停止自动切换
			changeTime :5000, //切换间隙时间 默认是5s
			switchTime :600, //切换动画时间默认 0.5s
			x:0,//切换对象定位偏移量 x轴
			y:0,//切换对象定位偏移量 y轴
			zIndex:2, //切换对象默认z轴高度，没有定位问题最好不修改
			/* 切换按钮对象 */
			btnPrev : null,//上一个 按钮 如 '.btnPrev'
			btnNext : null,//下一个 按钮 如 '.btnNext'
			inBtn :null,//内置切换的2个按钮，写入一个数组，分别为2个按钮的class，如 ['btnPrev','btnNext']，直接赋值true，返回即为['btnPrev','btnNext']
			/* thumb及相关 */
			thumb : null,//自定义切换thumb对象，用来导航switchObj，如 '.ul_thumb li'，
			inThumb : null,//内置thumb 父ul 的 class 名称，一旦设置，自动添加内置thumb，内置的为一个ul li 列表作为thumb，添加inThumb如 'ul_thumb'，只写true，返回switchObj 即为 '.ul_thumb li'
			nowClass : 'now',//当前 thumb 的class名称，默认为 now
			clickFalse : true, //点击thumb不响应默认事件，如不返回 a对应的链接，默认为true，即不响应
			overChange : true, //是否鼠标经过时就响应切换，默认为true
			delayTime:300,//鼠标经过迟滞切换时间，默认300ms，设置越大，反应越迟钝
			/* 返回事件 */
			beforeEvent : function(){},//在对象切换前返回事件，有参数now,next 可返回当前要切换index值， 如function(now,next){console.log(now+','+next);}
			afterEvent : function(){}//在对象切换后返回事件，用法和参数同beforeEvent一样
		}
		var domData={};
		for (i in opt) {
			var att = $(this).attr(i);
			if (att) {
				if (att == 'true') {att = true}
				if (att == 'false') {att = false}
				domData[i] = att;
			}
		}
		var data = $(this).data('switch')||{};
		$.extend(opt,domData,data,o||{});
		var _self = this,sOutW = _self.outerWidth(),sOutH = _self.outerHeight(),sW = _self.width(),sH = _self.height();
		var _o = _self.find(opt.switchObj),size = _o.length;
		var osW = sW*size,soH = sH*size;
		var now=0,next,z=1*opt.zIndex;
		var autoRun,delayEvent;
		var sIdx = (opt.switchType>-1)?opt.switchType:jQuery.inArray(opt.switchType,['left','right','up','slide','slideUpDown','fade','slideUp','slideDown','scrollUp','scrollDown','scrollLeft','scrollRight','scrollUpDown','scrollLeftRight']);//所有切换方式数组
		if (sIdx==12) {sIdx = 8;}//特殊处理
		if (sIdx==13) {sIdx = 10;}

		var wrap = $('<div class="'+opt.wrapCls+'" style="position:relative;overflow:hidden;width:'+sOutW+'px;height:'+sOutH+'px;"></div>');
		_self.wrap(wrap);//外包装，辅助切换

		if (size==1) {return};//切换对象长度为1返回

		if (opt.inThumb) {//添加内置thumb
			opt.inThumb = (typeof opt.inThumb== 'string')? opt.inThumb:'ul_thumb';
			var thumbDom = $('<ul style="z-index:100;"></ul>').addClass(opt.inThumb);
			var oHtml = '';
			for (i = 1; i <=size ; i++) {
				oHtml +='<li>'+i+'</li>';
			}
			thumbDom.append(oHtml);
			_self.after(thumbDom);
			opt.thumb = thumbDom.find('li');
		}
		if (opt.inBtn) {//添加内置上下按钮
			opt.inBtn = (typeof opt.inBtn =='Array')?opt.inBtn:['btnPrev','btnNext'];
			opt.btnPrev = $('<span style="z-index:100;" class="'+opt.inBtn[0]+'">Prev</span>');
			opt.btnNext = $('<span style="z-index:100;" class="'+opt.inBtn[1]+'">Next</span>');
			_self.after(opt.btnNext).after(opt.btnPrev);
		}

		switch (sIdx) {//根据切换方式初始化
			case 0 :
				_self.css({width:osW+'px'});
				_o.css({'float':'left'});
				break;
			case 1 :
				_self.css({width:osW+'px',marginLeft:-sW*(size-1)});
				_o.css({'float':'right'});
				break;
			case 2 : case 3 :
				_self.css({height:soH+'px'});
				break;
			default :
				_o.css({"position":"absolute","top":(1*opt.x+0),"left":(1*opt.y+0)});
				_o.eq(0).show().siblings().hide();
		}
		_thumbChange(0);//初始化thumb状态

		if (opt.overStop) {//悬停切换对象停止自动切换
			_hoverEvent(_self);
		}
		if (opt.autoChange) {//自动切换事件
			clearInterval(autoRun);
			autoRun = setInterval (function () {
				_change('next');
			},opt.changeTime);
		}

		if (opt.thumb) {//thumb事件
			if (opt.overChange) {
				$(opt.thumb).bind('mouseenter',function () {//鼠标enter和leave事件
					var idx = $(opt.thumb).index($(this));
					if (idx!=now) {
						delayEvent = setTimeout(function () {
							_thumbChange(idx);
							_change(idx);
						},opt.delayTime);
					}
				}).bind('mouseleave',function () {
					clearTimeout(delayEvent);
				});
			}
			$(opt.thumb).click(function () {//点击直接执行
				var idx = $(opt.thumb).index($(this));
				if (idx!=now) {
					_thumbChange(idx);
					_change(idx);
				}
				if (opt.clickFalse) {return false;}
			});
			_hoverEvent(opt.thumb);
		}

		if (opt.btnPrev) {//点击上一个按钮事件
			$(opt.btnPrev).click(function () {
				if (opt.switchType=="scrollUpDown") {sIdx = 8;}//特殊处理
				if (opt.switchType=="scrollLeftRight") {sIdx = 10;}
				_change('prev');
			});
			_hoverEvent(opt.btnPrev);
		}
		if (opt.btnNext) {//点击下一个按钮事件
			$(opt.btnNext).click(function () {
				if (opt.switchType=="scrollUpDown") {sIdx = 9;}//特殊处理
				if (opt.switchType=="scrollLeftRight") {sIdx = 11;}
				_change('next');
			});
			_hoverEvent(opt.btnNext);
		}

		function _thumbChange(idx) {//thumb切换函数
			if (opt.thumb) {
				$(opt.thumb).eq(idx).addClass(opt.nowClass).siblings().removeClass(opt.nowClass);
			}
		}

		function _change(idx) {//对象切换函数
			if(_o.queue().length<1){//防止连续点击
				next = (typeof idx =='string')?(idx=='next')?(now+size+1)%size:(now+size-1)%size:idx;
				opt.beforeEvent(now,next);
				_thumbChange(next);
				if (opt.switchType=='random') {sIdx= Math.floor(Math.random()*7)+5;}
				switch (sIdx) {
					case 0:
						_self.animate({marginLeft:-next*sW},opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});break;
					case 1:
						_self.animate({marginLeft:next*sW-sW*(size-1)},opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});break;
					case 2:
						_self.animate({marginTop:-next*sH},opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});break;
					case 3:
						_o.eq(now).slideUp(opt.switchTime);
						_o.eq(next).slideDown(opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});
						break;
					case 4:
						_o.eq(now).css({'zIndex':z}).slideUp(opt.switchTime).siblings().css({'zIndex':0});
						_o.eq(next).css({'zIndex':z}).slideDown(opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});
						break;
					case 5:
						_o.eq(now).css({'zIndex':z}).fadeOut(opt.switchTime).siblings().css({'zIndex':0});
						_o.eq(next).css({'zIndex':z}).fadeIn(opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});
						break;
					case 6:
						_o.eq(next).css({'zIndex':z}).show().siblings().css({'zIndex':0});
						_o.eq(now).css({'zIndex':z+1}).slideUp(opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});
						break;
					case 7:
						_o.eq(now).css({'zIndex':z}).siblings().css({'zIndex':0});
						_o.eq(next).css({'zIndex':z+1}).hide().slideDown(opt.switchTime,opt.easing,function () {opt.afterEvent(now,next);});
						break;
					case 8:case 9:
						var wh = (sIdx==8)?-sH:sH;
						_o.eq(next).css({'zIndex':z}).show().siblings().css({'zIndex':0});
						_o.eq(now).css({'zIndex':z+1}).animate({'marginTop':wh},opt.switchTime,opt.easing,function () {
							$(this).hide().css('marginTop',0);
							opt.afterEvent(now,next);
						});
						break;
					case 10:case 11:
						var ww = (sIdx==10)?-sW:sW;
						_o.eq(next).css({'zIndex':z}).show().siblings().css({'zIndex':0});
						_o.eq(now).css({'zIndex':z+1}).animate({'marginLeft':ww},opt.switchTime,opt.easing,function () {
							$(this).hide().css('marginLeft',0);
							opt.afterEvent(now,next);
						});
						break;
					default:
						_o.eq(now).hide();
						_o.eq(next).show(0,function () {opt.afterEvent(now,next);});
				}
				now = next;
			}
		}

		function _hoverEvent(obj) {//鼠标悬停事件函数
			if (opt.autoChange) {
				$(obj).bind('mouseenter',function () {
					clearInterval(autoRun);
				});
				$(obj).bind('mouseleave',function () {
					clearInterval(autoRun);
					autoRun = setInterval (function () {
						_change('next');
					},opt.changeTime);
				});
			}
		}

	}

	$(function () {
		if ($('.soSwitch').length) {//针对.soSwitch自动加载切换事件
			$('.soSwitch').each(function () {
				$(this).soSwitch();
			});
		}
	})

})(jQuery);


