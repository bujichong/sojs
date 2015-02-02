/*
 *	soColorPacker 1.0 
 *	made by bujichong 2012-01-04
 *	作者：不羁虫  2012-01-04
 *百度空间： http://www.bujichong.com/
 *邮件地址：bujichong@163.com
 */
(function ($) {
	$.fn.extend({
		'soColorPacker':function (o) {
			o= $.extend({
				changeTarget:null,//颜色选择后填入改变对象，默认null为当前引用方法对象
				textChange:true,//是否将颜色值填入target对象
				colorChange:1,//值：0,1,2 ，0：不改变，1：改变文字颜色，2：改变背景颜色
				selfBgChange:false,//改变自身背景颜色
				size:2,//值：1,2,3，改变颜色选择器表现大小，1：小，2：中，3：大
				x:0,//颜色选择器坐标x轴偏移量
				y:20,//颜色选择器坐标y轴偏移量
				styleClass:null,//自定义添加class名
				callback:function(){}//点击颜色单元返回事件
			}, o || {});

			function newColorHtml() {//创建选色器函数
				var colorPackH =$('<div class="colorPackerBox"></div>');
				var colorArrCell = ['FF','CC','99','66','33','00'];
				var colorArr=[],colorCell = '';
				for (var i = 0; i < 6; i++) {//循环生成选色器
					colorCell +='<div class="div_cellBox">';
					for (var j = 0; j < 6; j++) {
						for (var k = 0; k < 6; k++) {
							var co = colorArrCell[i]+colorArrCell[j]+colorArrCell[k];
							colorCell += '<span class="span_colorCell" style="background-color:#'+co+'" rel="#'+co+'"></span>';
						}
					}
					colorCell += '</div>';
				}
				colorCell += '<div class="overShowbox"><span class="span_overBg"></span><span class="span_overValue"></span><span class="span_close">关闭</span></div>';//添加辅助栏
				colorPackH.append(colorCell);
				return colorPackH;
			}

			return this.each(function() {
				var colorPack;
				$.data($(this).get(0), "colorPackSa", {hasColorPacker:false});
				$(this).click(function (ev) {//引用对象点击事件
					var $this = $(ev.target);
					if (false == $.data($this.get(0), "colorPackSa").hasColorPacker) {
						$.data($this.get(0), "colorPackSa", {hasColorPacker:true});
						colorPack = newColorHtml();
						$("body").append(colorPack);
						if ($.fn.bgIframe) {//ie6添加bgiframe
							$(colorPack).bgiframe();
						}
						if (o.styleClass) {//添加自定义类名
							$(colorPack).addClass(o.styleClass);
						};
						if (o.size==1) {//小尺寸
							$(colorPack).width(162);
							$('.div_cellBox',colorPack).width(54);
							$('.span_colorCell',colorPack).css({'width':'8px','height':'8px'});
						};
						if (o.size==3) {//大尺寸
							$(colorPack).width(270);
							$('.div_cellBox',colorPack).width(90);
							$('.span_colorCell',colorPack).css({'width':'14px','height':'14px'});
						};

						var elPos = $this.findPosition();//定位选色器
						var x = (parseInt(o.x) ? parseInt(o.x) : 0) + elPos[0];
						var y = (parseInt(o.y) ? parseInt(o.y) : 0) + elPos[1];
						$(colorPack).css({position:'absolute',left:x,top:y});

						var $target;
						$target = (o.changeTarget)?$(o.changeTarget):$this;//是否有target对象，null则为引用对象自身
						if ($target.val().indexOf('#')==0) {//初始化辅助栏
							var colorV = $target.val();
							$('.span_overBg',colorPack).css('backgroundColor',colorV);
							$('.span_overValue',colorPack).text(colorV);
						}
						$(".span_colorCell", colorPack).bind('click', function () {//点击颜色单元事件
							var colorP = $(this).attr('rel');
							if (o.colorChange==1) {$target.css('color',colorP);}
							if (o.colorChange ==2) {$target.css('backgroundColor',colorP);}
							if (o.selfBgChange) {$this.css('backgroundColor',colorP);}
							if (o.textChange) {
								if ( $target.is('input') && 'text' == $target.attr('type')) {
									$target.val(colorP);
								}else {
									$target.text(colorP);
								}
							}
							//var returnData = {color:colorP};
							o.callback({color:colorP});
							colorP = null;
							colorPack.remove();
							colorPack = null;
							$.data($this.get(0),"colorPackSa",{hasColorPacker:false});
							//if (o.callback) {return o.callback();}//返回自定义点击颜色单元事件
						})
							.bind('mouseover', function () {//鼠标经过单元事件
							var colorP = $(this).attr('rel');
							$('.span_overBg',colorPack).css('backgroundColor',colorP);
							$('.span_overValue',colorPack).text(colorP);
							colorP = null;
						});
						$(".span_close", colorPack).bind('click', function () {//辅助栏关闭按钮事件
							colorPack.remove();
							colorPack = null;
							$.data($this.get(0),"colorPackSa",{hasColorPacker:false});
						});
					}
				})
			})
		},
		'findPosition':function () {//定位函数
			var $this = $(this).get(0);
			var curleft = curtop = 0;
			if ($this.offsetParent) {
				do { 
					curleft += $this.offsetLeft;
					curtop += $this.offsetTop;
				} while ($this = $this.offsetParent);
				return [curleft,curtop];
			} else {
				return false;
			}
		}
	});

})(jQuery);