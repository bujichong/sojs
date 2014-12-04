/*
 *	soSideNav 1.0 
 *	made by bujichong
 *	作者：不羁虫
 *百度空间： http://www.bujichong.com/
 *邮件地址：bujichong@163.com
 */
(function ($) {
	$.fn.extend({
		"soSideNav" : function (o) {
			var o = $.extend({
				title:'h2',//导航标题对象
				posX:0,//导航坐标X轴偏移量
				posY:0,//导航坐标Y轴偏移量
				position:'rb'//导航位置： lt,lb,rt,tb
			},o||{});
			
			var box = $(this),$title = box.find(o.title);
			var base = {
				boxW : box.outerWidth(),
				boxT : box.offset().top,
				wH : $(window).height()
			}
			nav = {
				fBox : null,
				fUl : null,
				spanS : null,
				init : function () {//初始化
					this._addNav()._setNav()._navClick();
				},
				_addNav : function () {//向内容盒子里插入文字导航
					this.fBox = $('<div class="floatNav"></div>');
					this.fUl = $('<ul class="floatNav_ul"></ul>');
					this.spanS = $('<span class="span_showFloat">文章导航</span>');
					var navH = '';

					$title.each(function (i) {
						var nId = $(this).attr('id')||'floatANav_add_'+i;
						$(this).attr('id',nId);
						var tc = $(this).text();
						navH += '<li><a href="#'+nId+'">'+tc+'</a></li>';
					});
					this.fUl.append(navH);
					this.fBox.append(this.spanS).append(this.fUl);
					box.append(this.fBox);
					return this;
				},
				_setNav : function () {
					var fBox = this.fBox,
					fUl = this.fUl,
					spanS = this.spanS;
					//设置文字导航层样式
					box.css({'position':'relative'});
					fBox.css({'position':'absolute'});
					var ulH = fUl.height();
					var posA = o.position.split('');

					//根据位置信息设置浮动层定位信息
					if (posA[0]==='l') {
						fBox.css({'right':base.boxW-14+o.posX});
						spanS.css({'float':'right'});
						fUl.css({'float':'right','marginRight':'-1px'});
					}
					if (posA[0]==='r') {
						fBox.css({'left':base.boxW-12+o.posX});
					}
					if (posA[1]==='t') {
						fBox.css({'top':base.boxT + 50+o.posY});
					}
					if (posA[1]==='b') {
						fBox.css({'top':base.wH-150+o.posY});
						fUl.css({'marginTop':-(ulH+20-68)});
					}
					//滚动时文章导航位置处理
					$(window).scroll(function () {
						var t = $(window).scrollTop();
						if (t<(base.boxT+ box.height()-base.wH)) {
							if (posA[1]==='b') {
								fBox.css({'top':t+base.wH-120});
							}
							if (posA[1]==='t') {
								fBox.css({'top':t+60});
							}
						}
					});
					return this;
				},
				_navClick : function () {//事件处理
					var fBox = this.fBox,spanS = this.spanS;
					var ts;
					this._clickToNow($('li',fBox),'now');
					spanS.mouseover(function () {
						fBox.addClass('floatNav_show').css({'width':'150px'});
					});
					fBox.mouseenter(function () {
						if (ts!= undefined) {clearTimeout(ts);}
					}).mouseleave(function () {
						var that = $(this);
						ts = setTimeout(function () {
							that.removeClass('floatNav_show').css({'width':'22px'});
						},500);
					});
				},
				_clickToNow : function (obj,cls) {//文章导航单项点击事件
					var obj = $(obj),that = this;
					obj.click(function () {
						$(obj).removeClass(cls);
						$(this).addClass(cls);
						var $href = $(this).find('a').attr('href');
						that._scrollTo($href);
						return false;
					});
				},
				_scrollTo : function (o) {//锚点滚动函数
					var st = parseInt($(o).offset().top);
					$('html').animate({scrollTop:st},500);
				}
			}
			nav.init();
		}
	})
})(jQuery);