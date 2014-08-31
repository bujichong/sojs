/* 
* soSlider 1.0
* made by bujichong
* Email : bujichong@163.com
* 2013-09-04
*/
(function () {
	$.fn.soSlider = function (o) {
		var o = $.extend({
			type : 1, //类型:1||2，1个滑动点，2个滑动点
			bit :1, //进位步长，默认为1
			data:null, //'min,max' 字符串格式，用逗号隔开，最小数和最大数
			defaultPos:null, //'point1,point2' 字符串格式，默认数值，1个滑动点1个数值
			showRange : true, //显示滑动区间
			initEvent : function (){}, //加载执行事件， initEvent : function(v1,v2){}提供2点对应数值
			mMoveEvent : function () {}, //移动执行事件， mMoveEvent : function(v1,v2){}提供2点对应数值
			mUpEvent : function (){} //鼠标按起执行事件， mUpEvent : function(v1,v2){}提供2点对应数值
		},o||{});

		var _self = $(this);
		o.data = o.data || _self.attr('sliderData');
		var $ha = $('<span class="s-handler s-handler-a"></span>');
		var $hb = $('<span class="s-handler s-handler-b"></span>');
		var $w = $('<span class="s-slide-w"></span>');
		if (o.type==1) {
			_self.append($w).append($ha);
		}else if(o.type==2){
			_self.append($w).append($ha).append($hb);
		}

		var selfW = _self.width();//对象宽
		var handW = $ha.width();//handler宽
		var handHw = handW/2;//handler一半宽
		var selfL = _self.offset().left;//对象左坐标
		var data = o.data.split(',');//范围数据
		var f1 = data[0]*1,f2 = data[1]*1;//范围数据
		var $temp = {o:$ha,type:'add'};//临时对象，用来跟踪滑动条点击触发对象
		var nock =  false;//定义事件开关，触发事件时为true，鼠标按起后为false
		if (f1==NaN||f2==NaN||f2<f1) {
			alert('范围值必须为数字，并且第二个数字大于第一个数字');
			return;
		}
		var foot = f2 - f1;//范围值
		var dn = o.defaultPos?o.defaultPos:o.data;//初始化2个范围点
		dn = dn.split(',');
		var d1 = dn[0]*1, d2 = dn[1]*1||f2;//初始化两个范围值
		if (d1==NaN||d2==NaN||d2<d1) {
			alert('初始值必须为数字，并且第二个数字大于第一个数字');
			return;
		}
		d1=(d1>f1)?d1:f1;d2 = (d2<f2)?d2:f2;//规范初始值
		var p1 =(d1-f1)*selfW/foot-handHw;//初始化两个范围坐标
		var p2 = (d2-f1)*selfW/foot-handHw;
		$ha.css('left',p1);
		o.initEvent(d1,d2);
		if (o.type==1) {//1个点
			var rb = p2+handHw;
			$w.width(p1);
		}
		if (o.type==2) {//2个点
			$hb.css('left',p2);
			$w.css({'left':p1+handHw,'width':(p2-p1)});
			var ra = p1+3*handHw;//初始化2个滑动范围值
			var rb = p2-handHw;
		}

		var moveEvent = function (e,obj,type) {//滑动主处理函数
			var x = parseInt(e.pageX - selfL);// 鼠标点距离slider左侧实际距离
			if (type=='add') {
				x = (x<0)?0:(x>rb)?rb:x;// 操控handler不超出slider x值
			}else{
				x = (x<ra)?ra:(x>selfW)?selfW:x;// 操控handler不超出slider x值
			}
			var hx = x-handHw;//hander的left
			var v = parseInt((f1+foot*x/selfW)/o.bit)*o.bit;

			if (type=='add') {ra = hx+3*handHw;d1=v;} else {rb = hx-handHw;d2=v;}
			obj.css({'left':hx+'px'});
			if (o.showRange&&o.type==1) {//1个点
				$w.width(hx+handHw);
			}
			if (o.showRange&&o.type==2) {//2个点
				$w.css({'left':(ra-handW),'width':(rb-ra+2*handW)});
			}
			$temp.o = obj;
			$temp.type = type;
			nock = true;
			o.mMoveEvent(d1,d2);//鼠标移动事件
			//$w.width(hx);
		}
		
		$ha.mousedown(function (e) {//a滑块事件
			$(document).unbind('mousemove').bind('mousemove',function (e) {
				moveEvent(e,$ha,'add');
			});
		});

		_self.click(function (e) {//滑条点击事件
			moveEvent(e,$temp.o,$temp.type);
		});

		o.type==2&&$hb.mousedown(function (e) {//b滑块事件
			$(document).unbind('mousemove').bind('mousemove',function (e) {
				moveEvent(e,$hb,'dunce');
			});
		});

		$(document).mouseup(function (e) {//解除绑定事件
			$(document).unbind('mousemove');
			nock&&o.mUpEvent(d1,d2);
			nock = false;
		});
	}
})(jQuery);