/*
 *	soScrollAdd 1.0 
 *	made by bujichong
 *	作者：不羁虫
 *百度空间： http://www.bujichong.com/
 *邮件地址：bujichong@163.com
 */
(function ($) {

	var $sA = function (box,option) {
		this.box = $(box);
		this.contHtml = option.addDom;
		this.leader = option.leader;
		this.eachBox  = option.eachBox;
		this.eachBack = option.eachBack;
		this.allBack = option.allBack;
		return this.init();
	}

	$sA.prototype = {
		init : function () {//初始化
			var box = this.box,
			contHtml= this.contHtml,
			that = this,
			leader = that._addLeader(box);

			that._leaderTop = parseInt(leader.offset().top-50);
			that._scrollEvent(function () {
				that._scrollFunc(leader,contHtml);
			});
		},
		_addLeader : function (box) {//添加leader
			var leader;
			if (this.leader) {
				leader = $(this.leader);
			}else {
				leader = $('<div style="clear:both;height:5px;background:red;"></div>');
				box.append(leader);
			}
			return leader;
		},
		_leaderTop : null,//目标距离顶部高度
		_scrollEvent : function (func) {//滚动事件
			var leaderTop = this._leaderTop,wh = $(window).height();
			if (leaderTop === null) {return false;}
			$(window).bind("scroll.sA",function () {
				var ds = parseInt($(document).scrollTop()+wh);
				//console.log(ds+','+ot);
				if (ds>=leaderTop) {
					func();
				}
			});
		},
		_scrollFunc : function (leader,contHtml) {//滚动到目标执行的事件
			var that = this;
			if (that.contHtml) {
				$(that.eachBox).each(function () {
					$(this).append(that.contHtml);
				});
			}
			if (that.eachBack) {
				$(that.eachBox).each(function (i,v) {
					that.eachBack(i,v,this);
				});
			}
			if (that.allBack) {
				allBack();
			}

			//leader.before(contHtml);
			that._leaderTop = parseInt(leader.offset().top-50);
			$(window).unbind("scroll.sA");
			that._scrollEvent(function () {
				that._scrollFunc(leader,contHtml);
			});
			//console.log(that._leaderTop);
		}
	}

	$.fn.soScrollAdd = function (o) {
		o = $.extend($.fn.soScrollAdd.default,o||{});
		var sc = new $sA(this,o);
	}

	
	$.fn.soScrollAdd.default = {
		leader : null,
		eachBox : null,
		addDom : null,
		eachBack : null,
		allBack : null
	}

})(jQuery);