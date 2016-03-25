/* sobox 2.0 */
/*
*通用方法
*$.sobox.pop({
	* 弹出类型及类型参数 *
	type : 'content',//弹窗内容模式:'content','target','ajax','iframe'，每个模式分别对应每个参量@
	target : null,//target方式，target目标，如 '.detail','#contbox'@
	content : null,//content方式，支持html@
	iframe : null,//iframe方式，值为iframe目标页链接，如：http://www.baidu.com/@
	ajax:{url:null,data:null,callback:function(){}},//ajax事件@

	* 位置信息 *
	posType:'center',//'center,win,doc,tc,bc' 位置类型，居中模式 / 距离window顶部坐标设定 / 距离doucment顶部坐标设定 / top水平居中 / bottom水平居中，默认居中显示，可自定义坐标@
	pos:[0,0],//[x,y] 距离document左上角坐标,set模式使用@
	offset:[0,0],//[x,y] 弹窗相对本来设定位置偏移量,center模式只改变y轴@

	* 自定义参数 *
	cls : null,//添加自定义类名@
	width:360,height:null,//宽高属性,iframe模式下，height为iframe高度@
	defaultShow:true,//直接显示pop
	visibility:true,//默认pop执行后显示（用于部分复杂处理场景）@
	title : '提示',//默认标题@
	showTitle:true,//标题栏隐藏：默认显示@
	outCloseBtn : false, //标题上的关闭按钮是否外置 ：默认内置@
	showMask : true,//显示遮罩@
	onlyOne : false,//同一状态下只显示一个pop
	drag :true,
	maskClick : true,//点击背景关闭内容@
	btn : [],//{cls:,text:'确定',link:,closePop: true,callback:}@

	* 返回事件 *
	beforePop:function(){},//窗口打开之前返回事件@
	onPop: function(){},//窗口打开返回事件@
	closePop: function(){}//窗口关闭返回事件@
*});

*btn参数说明：
*默认每个btn元素由一个.a-sopop-btn 的a元素内置一个.s-sopop-btn span元素组成，
*cls 为按钮a自定义类名，
*link 为a添加链接，
*returnFlase 默认不返回链接事件，
*closePop 点击按钮默认关闭对应pop窗口,
*callback 点击此按钮返回事件
*
*
*快捷 alert 弹窗
*$.sobox.alert(title,content,callback);
 alert 弹窗标题，内容，点击确定返回事件
*
*
*快捷 confirm 弹窗
*$.sobox.alert(title,content,successBack,cancelBack);
*confirm 弹窗标题，内容，确定返回事件，中断返回事件（点取消按钮返回此事件，点背景或标题上的关闭按钮不返回此事件）
*
*
*/

(function ($,document) {
	$.sobox = {
		maskIndex:0,//层次index
		showMask : function (state) {//显示mask
			var that = this;
			if (state) {
				var $mask = $('.so-openmask');
				if (!$mask.length){
					$mask = $('<div class="so-openmask"></div>');
					$('body').append($mask);
					that.maskIndex = 1;
				}else{
					that.maskIndex++;
				}
				var par = (typeof document.body.style.maxHeight == "undefined")?document:window;//ie6设置为document高度，其他设置为window高度
				var dh = $(par).height()-18;
				$mask.height(state?dh+20:0);
				$(window).resize(function () {
					var dh = $(par).height()-18;
					$mask.height(state?dh+20:0);
				});
				$mask.css("z-index",(1000+that.maskIndex*10));
			}else {
				$mask = null;
			}
			return $mask;
		},
		show:function (opt,maskState,fn) {//显示弹出框和mask,fn返回事件
			var that = this,obj = $(opt.obj);
			var $mask = that.showMask(maskState);
			that.setPos(opt);
			if (opt.onlyOne) {//body上data onlyOne属性
				$('body').data('soonlyone',true);
			}
			obj.css("z-index",(1002+that.maskIndex*10)).fadeIn();
//			var w = obj.width(),h = obj.height();
//			obj.css({'width':0,'height':0,'marginLeft':0,'marginTop':0}).show().animate({'width':w,'height':h,'marginLeft':-w/2,'marginTop':-h/2},'fast');
			obj.find('.s-close').bind('click',function () {that.hide(obj);});
			if (fn) {fn();}
			return $mask;//返回背景层对象
		},
		hide:function (obj,maskState,fn) {//隐藏弹出框和mask,fn返回事件
			var that = this,$mask=$('.so-openmask');
			$(obj).fadeOut("fast",function () {
				//$('select').show();
				if (fn) {fn();}
			});
			if (maskState) {
				that.maskIndex--;
				$mask.css("z-index",(1000+that.maskIndex*10));
				if (that.maskIndex==0) {$mask.remove();}
			}
			$(obj).find('.s-close').unbind('click');
		},
		drag : function (obj,title) {
			var $o = $(obj),$title = $(title);
			$title.mousedown(function (e) {
				if(!e) e = window.event;  //IE
				posX = e.clientX - parseInt($o.css('left'));
				posY = e.clientY - parseInt($o.css('top'));
				$(document).bind('mousemove.drag',function (e) {
					mousemove(e);
				});
			});
			//document.body.onselectstart=function(e){return false;};
			$(document).mouseup(function (e) {
				if (e.target== $title.get(0)) {
					$(document).unbind('mousemove.drag');
					$o.css({'opacity':'1'});
				}
			});

			function mousemove(ev){
				if(ev==null) ev = window.event;//IE
				$o.css({'opacity':'0.4','left':(ev.clientX - posX)+"px",'top':(ev.clientY - posY)+"px"});
			}
		},
		setPos:function(o) {//位置函数
			var that = this;
			var o = $.extend({
				mode : 'center',//'center,win,doc,tc,bc' 居中模式 / 距离window顶部坐标设定 / 距离doucment顶部坐标设定 / top水平居中 / bottom水平居中
				obj: null,
				pos : [0,0],//[x,y] 距离document左上角坐标
				offset:[0,0]//[x,y] 偏移量
			},o);
			var $o = $(o.obj);
			var t=Math.floor($o.height()/2), l=Math.floor($o.width()/2);
			var scrollY=$(window).scrollTop(),wh = $(window).height();
			var posX = o.pos[0],posY = o.pos[1];
			var offX = o.offset[0],offY = o.offset[1];
			$o.css({'position':'fixed'});
			if(typeof document.body.style.maxHeight == "undefined") {//ie6处理select控件z轴问题
				var this_sel = $o.find('select');
				$('select').not(this_sel).hide();
			}
			switch (o.mode) {
				case 'win' ://距离window顶部坐标设定
					$o.css({'left':(posX+offX),'top':(posY+offY)});
					if (typeof document.body.style.maxHeight == "undefined") {//ie6设置为absolute定位，其他为fixed定位
						$o.css({'position':'absolute','top':(scrollY+posY+offY)});
					}
					break;
				case 'doc' ://距离doucment顶部坐标设定
					$o.css({'position':'absolute','left':(posX+offX),'top':(posY+offY)});
					break;
				case 'tc' ://x轴居中，定位在window top，不兼容ie6随屏幕滚动
					$o.css({'left':'50%','top':offY,'marginLeft':-l+offX});
					if (typeof document.body.style.maxHeight == "undefined") {
						$o.css({'position':'absolute','top':(scrollY+offY)});
					}
				break;
				case 'bc' ://x轴居中，定位在window bottom，不兼容ie6随屏幕滚动
					$o.css({'left':'50%','bottom':offY,'marginLeft':-l+offX});
					if (typeof document.body.style.maxHeight == "undefined") {
						$o.css({'position':'absolute','top':(scrollY+offY+wh)});
					}
				break;
				default ://center
					$o.css({'top':'50%','left':'50%','marginTop':(-t-10+offY),'marginLeft':-l+offX});
					if(typeof document.body.style.maxHeight == "undefined") {
						$o.css({'position':'absolute','top':(scrollY+wh/2)});
					}
			}
		},
		pop : function (o) {
			var that = this;
			var o = $.extend({
				/* 弹出类型及类型参数 */
				type : 'content',//弹窗内容模式:'content','target','ajax','iframe'，每个模式分别对应每个参量@
				target : null,//target方式，target目标，如 '.detail','#contbox'@
				content : null,//content方式，支持html@
				iframe : null,//iframe方式，值为iframe目标页链接，如：http://www.baidu.com/@
				iframeID : 'sopop-iframe',
				ajax:{url:null,data:null,callback:function(){}},//ajax事件@

				/* 位置信息 */
				posType:'center',//'center,win,doc,tc,bc' 位置类型，居中模式 / 距离window顶部坐标设定 / 距离doucment顶部坐标设定 / top水平居中 / bottom水平居中，默认居中显示，可自定义坐标@
				pos:[0,0],//[x,y] 距离document左上角坐标,set模式使用@
				offset:[0,0],//[x,y] 弹窗相对本来设定位置偏移量,center模式只改变y轴@

				/* 自定义参数 */
				cls : null,//添加自定义类名@
				width:400,height:null,//宽高属性,iframe模式下，height为iframe高度@
				defaultShow:true,//直接显示pop@
				visibility:true,//默认pop执行后显示（用于部分复杂处理场景）@
				title : '提示',//默认标题@
				showTitle:true,//标题栏隐藏：默认显示@
				outCloseBtn : false, //标题上的关闭按钮是否外置 ：默认内置@
				showMask : true,//显示遮罩@
				onlyOne : false,//为true时，同一状态下只显示一个pop@
				drag :true,
				maskClick : true,//点击背景关闭内容@
				btn : [],//{cls:,text:'确定',link:,closePop: true,callback:}@

				/* 返回事件 */
				beforePop:function(){},//窗口打开之前返回事件@
				onPop: function(){},//窗口打开返回事件@
				closePop: function(){}//窗口关闭返回事件@
			}, o || {});

			var $mask;//在base.show事件中设置
			var $wrap = $('<div class="so-popbox '+(o.cls?o.cls:"")+'" style="width:'+o.width+'px;display:none;"></div>');
			var $title = $('<h2 class="h2-sopop"><span class="s-sopop-title">'+o.title+'</span></h2>');
			var $close = $('<span class="s-sopop-close">[关闭]</span>');
			var  $cont = $('<div class="so-popbox-cont"></div>');
			var onlyOne = $('body').data('soonlyone');
			if (o.defaultShow&&!onlyOne) {showPop();}//默认直接显示，,否则通过手动事件执行showPop，初始化显示pop

			function showPop(opt) {//showPop
				o = $.extend(o,opt||{});
				o.showTitle&&$wrap.append($title);//添加标题
				o.outCloseBtn&&$close.addClass('s-sopop-out-close');//添加 无标题时 close按钮样式

				$wrap.append($close).append($cont);//添加内容盒子

				if (o.height&&(o.type!='iframe')) {$wrap.css('height',o.height+'px');}//添加自定义高
				$wrap.css({'visibility':(o.visibility?'visible':'hidden')});//visibility为false

				if (o.type == 'content') {$cont.html(o.content);}//content模式
				if (o.type == 'target') {//target模式
					var $target= $(o.target).show();
					$cont.append($target);
				}
				if (o.type == 'iframe') {//iframe模式
					//var scrollState = (o.iframeScroll)?'auto':'no';
					var iframeHtml = $('<iframe id="'+o.iframeID+'" name="'+o.iframeID+'" src="'+o.iframe+'" width="100%" height="'+o.height+'" frameborder="0" scrolling="auto"></iframe>');
					$cont.html(iframeHtml);
				}
				if (o.type == 'ajax'){//ajax模式
					$cont.load(o.ajax.url,o.ajax.data,function () {
						that.setPos({//重新定位
							mode : o.posType,
							obj : $wrap,
							pos : o.pos,
							offset: o.offset
						});
						if (o.ajax.callback) {o.ajax.callback();}
					});
				}
				if (o.btn.length>0) {//添加按钮
					var $popBtn = $('<p class="p-so-popBtn"></p>');
					$.each(o.btn,function () {
						var param = $.extend({//btn param
							cls:null,//添加类名
							text:'确定',//默认按钮文字
							link:'#',//链接（按钮由a标签定义，定义link，btn可以链接到地址）
							removePop: true,//默认点击按钮关闭弹出层
							callback:function (removePop){}//返回事件
						},this);
						var thisBtn = $('<a class="a-sopop-btn" href="'+param.link+'"><span class="s-sopop-btn">'+param.text+'</span></a>');
						if (param.cls!==null) {thisBtn.addClass(param.cls);}
						thisBtn.bind('click',function () {
							if (param.callback) {
								param.callback(removePop)&&removePop();
							}
							if (param.removePop) {removePop();}
							return (param.link==="#")?false:true;
						});
						$popBtn.append(thisBtn);
					});
					$wrap.append($popBtn);
				}

				$('body').append($wrap);//所有元素初始化完毕，添加到body中
				if (o.showTitle&&o.drag) {
					$title.addClass('h2-sopop-move');
					that.drag($wrap,$title);
				}

				o.beforePop($wrap,$title,$close,$cont);//赋予before事件所有可操作对象
				 $mask = that.show({
					mode : o.posType,//'center,win,doc,tc,bc' 居中模式 / 距离window顶部坐标设定 / 距离doucment顶部坐标设定 / top水平居中 / bottom水平居中
					obj : $wrap,
					pos : o.pos,
					offset: o.offset,
					onlyOne : o.onlyOne
				},o.showMask,o.onPop($wrap));//显示弹出层，并设置$mask为背景层
				$close.bind('click',function () {removePop();});
				if ($mask&&o.maskClick) {$mask.bind('click',function () {removePop();});}//点击背景层关闭事件
			}

			function removePop(opt) {//关闭pop
				o = $.extend(o,opt||{});
				that.hide($wrap,o.showMask);
				$('body').removeData('soonlyone');//关闭窗口移除onlyOne data属性
				if (o.target!=null) {//非生成对象，目标盒子重新放回dom
					$(o.target).appendTo('body').hide();
				}
				$wrap.remove();
				o.closePop();
			}
			return {wrap:$wrap,mask:$mask,opt:o,removePop:removePop,showPop:showPop};
		},
		alert : function (title,content,callback,width,cls) {//提示框：快捷5个参数：标题、正文、点击确定返回事件、提示框宽度、类名
			var that = this;
			var showTitle = title?true:false;
			var width = width?width:320;//默认宽度320
			var cls = cls?cls:'so-popAlert';//默认cls 为 so-popAlert
			that.pop({
				cls:cls,
				title:title,
				width:width,
				content:content,
				showTitle : showTitle,
				btn:[{text:'确定'}],
				closePop : callback
			});
		},
		err : function (content,callback) {//基于alert延展
			var that = this;
			that.alert(null,content,callback,310,'so-popError');
		},
		warning : function (content,callback) {//基于alert延展
			var that = this;
			that.alert(null,content,callback,310,'so-popWarning');
		},
		confirm : function (title,content,success,cancel) {//确认框：快捷4个参数：标题、正文、点击确定返回事件、点击取消返回事件
			var that = this;
			that.pop({
				cls:'so-popConfirm',
				title :title,width:360,content :content,
				btn:[{text:'确定',callback:function () {if (success) {success();}}},
					{text:'取消',cls:'a-sopop-cancel',callback:function () {if (cancel) {cancel();}}}]
			});
		},
		tip : function (o) {
			var that = this;
			var timer = null;
			var o = $.extend({
				cls:'so-popTip',//添加tip私有class
				showTitle : false,//tip共有属性
				posType : 'tc',
				showMask :false,
				width:250,
				stayTime : 5000,//停留显示时间，不自动关闭设置为小于0
				offset:[0,5],
				closePop : function () {
					timer&&clearTimeout(timer);
				}
			},o||{});
			var sotip = that.pop(o);
			if (o.stayTime>0) {//不自动关闭设置为小于0
				timer = setTimeout(function () {
					sotip.removePop();
				},o.stayTime)
			}
			return sotip;
		},
		loading : function (o) {
			var that = this;
			var o = $.extend({
				type : 'content',
				cls:'so-loading',
				showTitle :false,
				maskClick:false,
				width:80,height:36,
				content : '',
				stayTime:0//默认不自动关闭
			},o||{});
			var soLoading = that.pop(o);
			if (o.stayTime>0) {//不自动关闭设置为小于0
				setTimeout(function () {
					soLoading.removePop();
				},o.stayTime)
			}
			return {open:soLoading.showPop,close:soLoading.removePop};
		}
	}


	$.fn.extend({
		/*
		通过链接方式设定直接打开iframe
		html:
		<a class="a-iframePop" href="1.html?hs#soIframe?width=300&height=160&title=百度&showTitle=0">链接</a>
		以 #soIframe? 参数隔开

		js:
		var showIframe = $('.a-iframePop').soIframePop();

		可以在iframe中使用 parent.showIframe.removePop() 来关闭当前弹窗

		*/
		'soIframePop' : function (opt) {
			var o = $.extend({
				type: 'iframe',
				targetTag:'href',//选择设定目标的tag标签
				splitString:'#soIframe?',
				width :800,//修改几个pop默认参数
				height:480,
				showTitle: false
			},opt||{});
			var returnFn = [];

			this.each(function () {
				var _self = $(this);
				var tar = _self.attr(o.targetTag).split(o.splitString);
				var url = tar[0];par = tar[1]?tar[1].split('&'):'';
				var o2 = {};
				$.each(par,function () {
					var s = this.split('=');
					o2[s[0]]=s[1];
				});
				o = $.extend(o,o2||{});
				o.showTitle = (o.showTitle == 'true')? 1: +o.showTitle;
				o.iframe = url;
				o.defaultShow = false;
				var iframePop = $.sobox.pop(o);
				returnFn.push(iframePop);
				_self.click(function () {
					iframePop.showPop();
					$(this).data('iframePop',iframePop);
					return false;
				});
			});
			return returnFn;
		},
		/*
		*======= 侧边pop ========
		$('.a-thumb').soSidePop({
			type:'target',target:'.demo-box-2'
		});
		*/
		'soSidePop' : function (opt) {
			var _self = $(this);
			var ev = opt.event || 'click';//默认鼠标点击触发显示
			var sidepop = null;
			//var  delayTime = opt.delayTime || 120;

			_self.bind(ev,function (e) {
				var p = $(this).offset();
				var pos = (opt.por =='mouse')?[e.pageX,e.pageY]:[p.left,p.top];//前鼠标坐标或对象位置
				var o = $.extend({
					showMask:false,
					posType : 'doc',//以距离页面顶部方式定位
					por : 'mouse',
					pos:pos,
					offset:[10,10],//默认x,y轴均偏移10px
					onlyOne:true,//无论触发多少次，只弹出一个pop
					returnFalse: true//默认鼠标点击中断正常事件
				},opt||{});

				//delayTime = setTimeout(function () {
					sidepop = $.sobox.pop(o);
				//},delayTime);

				if (o.returnFalse) {
					return false;
				}
			});

			if (opt.leaveHide == true) {
				_self.bind('mouseout',function (e) {
					sidepop&&sidepop.removePop();
				});
			}
			return _self;
		},

		'soOverTip' : function (opt) {
			var _self = $(this);
			var o = $.extend({
				cls:'so-overTip',
				showMask:false,
				posType : 'doc',//以距离页面顶部方式定位
				offset:[10,10],//默认x,y轴均偏移10px
				showTitle:false,
				onlyOne:true//无论触发多少次，只弹出一个pop
			},opt||{});
			var soTTOverTip = null;
			_self.mouseenter(function (e) {
				o.pos = [e.pageX,e.pageY];//取当前鼠标坐标为定位坐标
				soTTOverTip = $.sobox.pop(o);
			}).mouseleave(function () {
				soTTOverTip.removePop();
			});
			return _self;
		},

		'clickPop' : function (o) { // 点击pop，sobox参数extend 从 optAll[aim] 中
			var o = $.extend({
				optAll : null
			},o||{});
			var _self = $(this);
			_self.click(function () {// handler设置事件
				var aim =$(this).attr('rel'),that=this;
				var popType = $(this).attr('popType') || 'target'; // 获取popType，默认target模式打开弹窗
				if (aim) {
					var opt =o.optAll;
					var aimArr = aim.split('.');
					var aimLen = aimArr.length;
					for (i = 0; i < aimLen; i++) {
						opt = opt[aimArr[i]];
					}
					// opt = o.optAll[aim]||{};//extend自定义参数
					var tg=aim.replace(".","_");
					optT = $.extend({
						title : $(this).text(),
						type : popType,
						target : $('#'+tg),
						iframe : $(this).attr('href')
					},opt);
					optT.beforePop = function(a,b,c,d){
						opt.beforePop&&opt.beforePop.call(that,a,b,c,d);
					}
					o.optAll.$pop = $.sobox.pop(optT);// 将当前pop对象返回暂存到optAll的$pop上
				}
			});
		}
	});

})(jQuery,document);
