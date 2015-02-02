/* soBanner 
* 用于商城简易版的banner切换，内置src4延迟加载非第一张banner图，复杂自定义的请使用soChange
* 已min到base.js中，无需单独调用
*所有参数及默认设置参考代码注释，如和默认保持一致不需自定义
*使用：
*
*html参考：
*<div class="changeWrap">
*	<div class="slide-each"></div>
*	<div class="slide-each"></div>
*	<div class="slide-each"></div>
*</div>
*js参考：
*$('.changeWrap').soBanner({
*	thumbLiNowCls : 'li-now',//自定义thumb nowClass为 li-now
*	changeDelayTime :4000,//设置banner延迟4s切换
*	callback : function(prev,now){//callback事件
*		alert(prev+','+now);
*	}
*});
*/


(function($){
	$.fn.extend({
		"soBanner" : function (o) {
			o= $.extend({
				cont :'.slide-each',//切换对象
				thumbUlCls:'ul-slide',//thumb ul class名，默认ul-slide
				thumbLiCls : 'li-slide',//thumb li class名，默认li-slide
				thumbLiNowCls : 'li-slide-now',//thumb li 当前 class名，默认li-slide-now
				thumbNumber : false,//thumb内是否显示数字，默认false
				changeDelayTime :0,//banner切换延迟时间
				imgDelayTime :4000,//图片延迟加载时间
				lazyImgTag : 'src4',//如果有img lazy，默认使用标签 src4
				changeTime: 5000,//banner切换时间，soChange事件
				slideTime:500,//banner动画过度时间，soChange事件
				autoChange:true,//是否自动切换，soChange事件
				callback : function(){}//切换间事件，soChange事件
			}, o || {});
			var _self = $(this);
			if (_self.length) {
				_self.each(function () {
					var $o = $(this);
					var $cont = $o.find(o.cont);
					var cLen =$cont.length;
					if (cLen>1) {//多于2张才执行
						var $thumbHtml = '<ul class="'+o.thumbUlCls+'">';
						for (var i = 1; i <= cLen; i++) {
							$thumbHtml += o.thumbNumber?('<li class="'+o.thumbLiCls+'">'+i+'</li>'):('<li class="'+o.thumbLiCls+'"></li>');
						}
						$thumbHtml +='</ul>';
						$o.soLazy({type:"delay",imgTag:o.lazyImgTag,defDelay:o.delayTime});//delay lazy
						$o.append($thumbHtml);
						if (o.changeDelayTime>0) {
							setTimeout(function () {
								chg();
							},o.changeDelayTime);
						}else {
							chg();
						}
						function chg() {
							$cont.soChange({
								thumbObj:$o.find('.'+o.thumbLiCls),
								thumbNowClass:o.thumbLiNowCls,
								changeTime:o.changeTime,
								slideTime:o.slideTime,
								autoChange:o.autoChange,
								callback : o.callback
							});
						}
					}
				});
			}
			return _self;
		}
	});
})(jQuery);