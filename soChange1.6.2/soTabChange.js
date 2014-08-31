/* soTabChange */
/* 
* 用于商城tab切换，内置鼠标事件触发src3图片加载
* 已min到base.js中，无需单独调用
*所有参数及默认设置参考代码注释，如和默认保持一致不需自定义
*使用：
*
*html参考：
*<div class="tabBox">
*	<h3 class="tab-title"></h3>
*	<div class="tab-cont"></div>
*	
*	<h3 class="tab-title"></h3>
*	<div class="tab-cont"></div>
*	
*	<h3 class="tab-title"></h3>
*	<div class="tab-cont"></div>

*</div>
*js参考：
*$('.tabBox').soTabChange();
*/

(function($){
	$.fn.extend({
		"soTabChange" : function (o) {
			o= $.extend({
				cont :'.tab-cont',//切换内容，默认 .tab-cont
				title : '.tab-title',//切换标题，默认 .tab-title
				titleNowCls : 'tab-title-now',//切换标题 当前的class名，默认 tab-title-now
				lazyImgTag : 'src3',//如果有img lazy，默认使用标签 src3
				slideTime:0,//切换过渡时间，默认为0，即无过渡效果
				autoChange:false,//是否自动切换，soChange参数
				clickFalse:true,//点击title是否无效，soChange参数
				callback : function(){}//切换返回函数，soChange参数
			}, o || {});
			var _self = $(this);
			if (_self.length) {
				_self.each(function () {
					var $title = $(this).find(o.title);
					var $cont = $(this).find(o.cont);
					$cont.soChange({
						thumbObj:$title,
						thumbNowClass:o.titleNowCls,
						slideTime:o.slideTime,
						autoChange:o.autoChange,
						clickFalse:o.clickFalse,
						callback:function (prev,now) {
							$cont.eq(now).find('img').each(function () {//callback lazy
								var srcPath = $(this).attr(o.lazyImgTag);
								if (srcPath) {$(this).attr('src',srcPath).removeAttr('src3');}
							});
							o.callback(prev,now);
						}
					});
				});
			}
			return _self;
		}
	});
})(jQuery);