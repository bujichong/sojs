/*
 *	soMmEvent 1.0 
 *	made by bujichong
 *	作者：不羁虫
 *百度空间： http://www.bujichong.com/
 *邮件地址：bujichong@163.com
 */
(function ($) {

	var $M =  function (o,opt) {
		this.o = $(o);
		this.opt = opt;
	}

	$M.prototype = {
		init : function () {
			var that = this;
			var s,e,limit = that.opt.limit;
			$(this.o).bind("mousedown",function (e) {
				s = {x:e.pageX,y:e.pageY};
			});
			$(this.o).bind("mouseup",function (e) {
				e = {x:e.pageX,y:e.pageY}
				var x = e.x - s.x,
					y = e.y - s.y;
				//console.log("起始：{x:"+s.x+",y:"+s.y+"}，结束：{x:"+e.x+",y:"+e.y+"}，差："+x+","+y);
				if (x<-limit && y<limit && y>-limit) {return that.opt.lEvent();}
				if (x>limit && y<limit && y>-limit) {return that.opt.rEvent();}
				if (y<-limit && x<limit && x>-limit) {return that.opt.tEvent();}
				if (y>limit && x<limit && x>-limit) {return that.opt.bEvent();}

				if (x<-limit && y<-limit) {return that.opt.ltEvent();}
				if (x>limit && y<-limit) {return that.opt.rtEvent();}
				if (x<-limit && y>limit) {return that.opt.lbEvent();}
				if (x>limit && y>limit) {return that.opt.rbEvent();}
			});
		}
	}

	$.fn.soMmEvent = function (o) {
		var o =$.extend({
			limit : 50, //反应阈值，鼠标滑动多少px进行反应，越小越灵敏
			lEvent : function(){}, //←
			rEvent : function(){}, //→
			tEvent : function(){}, //↑
			bEvent : function(){}, //↓

			ltEvent : function(){}, //↖
			rtEvent : function(){}, //↗
			lbEvent : function(){}, //↙
			rbEvent : function(){} //↘
		},o||{});

		this.each(function () {
			var run = new $M(this,o);
			run.init();
		});
	}

})(jQuery);