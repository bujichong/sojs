/*
* 使用方式 ：
* $('.lazybox').soLazy({'type':'delay'});
*
*/
(function ($) {
	$.fn.extend({
		"soLazy": function(o){
			o = $.extend({
				scrollWrap : null,
				type : 'scroll',//scroll,delay
				imgTag : 'src2',
				defHeight : 40,
				defDelay : 4000
			},o||{});
			var _self = $(this);
			var img=_self.find("img"),imgTag = o.imgTag;
			if (o.type == "scroll") {
				var pageTop=function(){
				if (o.scrollWrap) {
					return $(o.scrollWrap).height()+$(o.scrollWrap).scrollTop()-o.defHeight;
				}else{
					return document.documentElement.clientHeight+Math.max(document.documentElement.scrollTop,document.body.scrollTop)-o.defHeight;
				};
				};
				var imgLoad=function(){
					img.each(function(){
						if ($(this).offset().top<=pageTop()){
							var imgPath=$(this).attr(imgTag);
							if (imgPath){
							$(this).attr("src",imgPath).removeAttr(imgTag);
							}
						}
					});
				};
				imgLoad();
				var $scrollWrap = o.scrollWrap?$(o.scrollWrap):$(window);
				$scrollWrap.bind("scroll",function(){
					imgLoad();
				});
			}
			if (o.type == "delay") {
				var dl = setTimeout(function () {
					img.each(function () {
						var imgPath=$(this).attr(imgTag);
						if (imgPath){
						$(this).attr("src",imgPath).removeAttr(imgTag);
						}
					});
				},o.defDelay);
			}
			return _self;
		}
	});

})(jQuery);
