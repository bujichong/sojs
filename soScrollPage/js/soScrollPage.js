jQuery.extend(jQuery.easing,{easeInOutExpo:function(a,b,c,d,e){return 0==b?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c}}),function(a){a.fn.soScrollTo=function(b){var c;b=a.extend({direction:"y",speed:800,easeType:"easeInOutExpo"},b||{}),c=a(this),c.click(function(){var d,c=a(this).attr("href");return c=a("#"!=c?c:"body"),c.length&&(d={t:c.offset().top||0,l:c.offset().left||0},"x"==b.direction?a("html,body").stop().animate({scrollLeft:d.l},b.speed,b.easeType):a("html,body").stop().animate({scrollTop:d.t},b.speed,b.easeType)),!1})}}(jQuery);
/* jquery.mousewheel */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

(function ($) {

	function F(opt) {
		this.$box = $(opt.box);
		this.$scrollbox = $(opt.scrollbox);
		this.$page = $(opt.page);
		this.$thumb = null;

		this.pageClsH = opt.pageClsH;
		this.thumbCls = opt.thumbCls;
		this.minDuring = opt.minDuring;
		this.anOpt = opt.animateOpt;

		this.prev = null;//上一页指针
		this.now = 0;//当前页指针
		this.wh = null;//存放window高度
		this.lock = 0;//是否锁定页面，直至动画执行完
	}

	F.prototype ={
		init : function () {
			var t = this;
			t.addThumb();//添加thumb
			t.addPageCls();//给每个page添加独有的class，方便dom查找
			t.setH();//设置page高度为页面高度
			t.resize();//绑定window resize事件
			t.mosuewheel();//绑定滚轮事件
			t.clickThumb();//绑定thumb点击事件
			t.animatePage(t.now);//初始执行第一页进入动画
		},
		setH : function () {
			var t = this;
			var wh = $(window).height();
			t.wh = wh;
			t.$box.height(wh);
			t.$page.height(wh);
		},
		addThumb : function () {
			var t = this;
			var pl = t.$page.length;
			var $thumb = '<p class="p-pageThumb">';
			for (i = 0; i < pl; i++) {
				$thumb += '<span class="'+t.thumbCls+'"></span>';
			}
			$thumb += '</p>';
			t.$box.append($thumb);
			t.$thumb = t.$box.find('.'+t.thumbCls);
		},
		resize : function () {
			var t = this;
			$(window).resize(function () {
				t.setH();
				t.prev = null;//避免执行离开动画
				t.animatePage(t.now);
			});
		},
		addPageCls : function () {
			var t = this;
			t.$page.each(function (i,v) {
				$(this).addClass(t.pageClsH+i);
			});
		},
		setThumb : function (i) {
			var t = this;
			t.$thumb.removeClass('now').eq(i).addClass('now');
		},
		clickThumb : function () {
			var t = this;
			t.$thumb.click(function () {
				ix = t.$thumb.index(this);
				ix!==t.now&&t.animatePage(ix);
			});
		},
		mosuewheel : function () {
			var  t = this;
			$('body').mousewheel(function (e,d) {
				if (t.lock==0&&d<0) {t.nextPage();}
				if (t.lock==0&&d>0) {t.prevPage();}
			});
		},
		nextPage : function () {//下一页
			var t = this;
			var pl = t.$page.length;
			ix = t.now>(pl-2)?(pl-1):(t.now+1);
			ix!==t.prev&&t.animatePage(ix);
		},
		prevPage : function () {//上一页
			var t = this;
			ix = t.now>0?(t.now-1):0;
			ix!==t.prev&&t.animatePage(ix);
		},
		animatePage : function (ix) {
			var t = this;
			t.lock = 1;//锁定页面
			t.now = ix;
			t.cellsAnimate(t.prev,'out',function () {//先执行prev退出事件
				t.setThumb(t.now);
				t.$scrollbox.animate({top:-t.wh*t.now+'px'},800,'easeInOutExpo',function () {//页面切换事件
					t.cellsAnimate(t.now,'in',function () {//再执行now进入事件
						t.lock = 0;//解除锁定
					});
				});
			});
			t.prev = t.now;
		},
		cellsAnimate : function (ix,style,callback) {//切换页面元素动画函数
			var t = this;
			if (ix===null) {//指针为null，直接跳过返回
				callback();
				return;
			}
			var anIx = (style==='in') ? t.anOpt[ix]["in"]: t.anOpt[ix]["out"];//in or out
			//window.console && console.log(anIx);
			if (anIx) {
				var $pageIx = $('.'+t.pageClsH+ix);//指到指定页
				var allDuring = t.minDuring;//当前总动画执行完时间

				$.each(anIx,function (i,v) {
					var $o = $pageIx.find(v.o);
					v.fn&&$.each(v.fn,function (k,opt) {
						$o[k](opt);
					});
					var nowAllDuring = 0;//当前元素总执行完动画时间
					v.fx&&$.each(v.fx,function (j,w) {
						var during = w.during||400;
						var delayTime = w.delay||0;
						var ex = w.ex || 'easeInOutExpo';
						nowAllDuring = nowAllDuring+during+delayTime;//当前元素动画累计时间(累计执行时间+当前执行时间+当前停顿时间)
						$o.delay(delayTime).animate(w.animate,during,ex,function () {
							w.callback&&w.callback($o,$pageIx);
						});
					});
					allDuring = nowAllDuring>allDuring?nowAllDuring:allDuring;//当前页动画执行完总时间,取所有元素执行时间的最大值
				});
				setTimeout(function () {
					callback();
				},(allDuring-100));
			}
		}
	}

	$.fn.extend({
		soScrollPage : function (o) {
			var o = $.extend({
				box : $(this),//包裹对象为自身
				scrollbox : '#pageScrollbox',//滚动包裹对象
				page : '.page',//页
				pageClsH : 'soScrollPage-',//为每页单独定义的cls头，会生成 soScrollPage-0 , soScrollPage-1 这样的class，方便每页dom查找，如无冲突，一般不用修改
				thumbCls : 's-pageThumb',//thumb class
				minDuring : 300,//每页离开时最少停留时间
				animateOpt : null//动画参数对象
			},o||{});

			var f = new F(o);
			f.init();
			return f;
		}
	});

})(jQuery);