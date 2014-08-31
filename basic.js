/*function 区域*/
(function ($) {
//鼠标经过离开改变class
//使用如： $(".ul_nav li").hoverClass("over");

$.fn.hoverClass=function(b){var a=this;a.each(function(c){a.eq(c).mouseenter(function(){$(this).addClass(b)});a.eq(c).mouseleave(function(){$(this).removeClass(b)})});return a};


//鼠标经过使当前对象添加class，兄弟元素清除class
//使用如： $(".ul_nav li").overOnlyClass("over");

$.fn.overOnlyClass=function(b){var a=this;a.each(function(c){a.eq(c).mouseenter(function(){a.removeClass(b);$(this).addClass(b)})});return a};


// 盒子内的图片超过盒子宽度时自动适应宽度，并添加在新窗口打开的链接，
//可设置自定义宽度，不设置宽度时，所限宽度为盒子的宽度
//$("#imgBox").autoImgW();
//$("#imgBox").autoImgW(650);

$.fn.autoImgW=function(d){var a=this;var b=(d==null)?a.width():d;var c=a.find("img");c.each(function(f){var e=$(this).width();var g=$(this).height();var h=$(this).attr("src");if(e>=b){$(this).css({width:b,height:g*(b/e)}).wrap("<a href="+h+" target='_blank' title='点击查看大图' ></a>")}});return a};

//input 获得焦点时input里的文字内容，
//可自定义input内容，空时默认为本身文字内容
//使用如：
//$(".it_booking").foucsText();
//$(".it_booking").foucsText('请输入关键字');

$.fn.foucsText=function(c){var a=this;var b=(c==null)?$(a).val():c;a.val(b);a.focus(function(){if(a.val()==b){a.val("")}});a.blur(function(){if(a.val()==""){a.val(b)}});return a};

/* textFocus */
$.fn.textFocus = function (o) {
	var o = $.extend({
		val :null,
		focusCls : 'txt-focus',
		changeCls : 'txt-change',
		keyback: function(){}
	},o||{});
	var fc = o.focusCls, cc = o.changeCls;
	this.each(function () {
		var _self = $(this);
		var v=(o.val==null)?$(_self).val():o.val;
		 _self.val(v);
		_self.focus(function () {
			(_self.val()==v)&&_self.val("");
			fc&&_self.addClass(fc);
		});
		_self.blur(function(){
			(_self.val()=="")&&_self.val(v);
			fc&&_self.removeClass(fc);
		});
		cc&&_self.keyup(function(){
			if(_self.val()!=v&&_self.val()!=''){
				_self.addClass(cc);
			}else {
				_self.removeClass(cc);
			}
			o.keyback(_self);
		});
	});
	return this;
}

//input 获得焦点时input样式改变，
//可自定义input焦点class，空时默认为it_focus
//使用如：
//$(".it_booking").focusChangeStyle();
//$(".it_booking").focusChangeStyle('focus');

$.fn.focusChangeStyle=function(b){var a=this;var b=(b==null)?"txt_focus":b;a.focus(function(){$(this).addClass(b)});a.blur(function(){$(this).removeClass(b)});return a};


// select在新页面打开友情链接
//使用如： $("#selFriendLink").openSelVal();
//在当前窗口打开select框的链接：
// $("#selFriendLink").openSelVal('self');

$.fn.openSelVal=function(b){var a=this;a.change(function(){if(a.val()!=0){if(b=="self"){window.location=a.val()}else{window.open(a.val())}}});return a};

//等高
//$(".a").sameH();
//$(".a").sameH(300);
$.fn.sameH = function (b) {if (b) {return $(this).height(b);}var a = this,mH = 0;$(a).each(function () {var tH = $(this).height();mH = tH>mH?tH:mH;}).height(mH);return a;}

//平滑滚动到锚点
//$('.a').slideScroll(); 某链接执行平滑滚动，默认时间500ms
//$.slideScroll(1000); 页面所有锚点链接执行滚动，1000ms
$.fn.slideScroll = function (b) {
	var a = this,b = b||500,mark =$(this).attr('href');
	$(a).click(function () {
		if ($(mark).length) {
			$("html, body").animate({scrollTop: $(mark).offset().top + "px"}, {duration: b,easing: "swing"});
			return false;
		}
	});
	return a;
}
$.slideScroll = function (b) {
	$('a[href*=#]').slideScroll(b);
}

//屏蔽右键菜单
//$.delRightMenu();
$.delRightMenu=function(){document.oncontextmenu=function(event){if(window.event){event=window.event;};try{var the=event.srcElement;if(!((the.tagName=="INPUT"&&the.type.toLowerCase()=="text")||the.tagName=="TEXTAREA")){return false;}
return true;}catch(e){return false;}}}






})(jQuery);
