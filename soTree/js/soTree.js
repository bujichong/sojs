;(function ($) {
	$.fn.extend({
		'soTree':function (o) {
			var o= $.extend({
				type : 'json',//json,stepJson,html
				id : null,
				cls : null,//自定义class
				url : null,//当url不为空，则tree以json格式调入数据，否则tree为html格式
				rootId:'0',//根节点id，只在stepJson方式中开启
				rootText:'根节点',//根节点文本，只在stepJson方式中开启
				rootHide:false,//根节点是否隐藏，只在stepJson方式中开启
				rootExpand:true,//根节点是否默认展开，只在stepJson方式中开启
				slide : false,//是否开启收缩动画
				expand : true,//默认展开
				liExtendHtml : '', //每个节点扩充的html内容
				checkbox : false,//默认不带选择框
				checked : false,//默认不处于选择状态
				dataSet : true,//是否接收数据对节点状态的控制
				hideId:[],//设置隐藏节点，以id为标识，数组的形式分开，如[10,22],表示当前id为10与22的节点被隐藏
				collapsePar:[],//默认单独收缩的父节点
				expandPar:[],//默认单独展开的父节点
				onSuccess : function () {},//数据加载成功事件
				onStepSuccess : function () {},//分步时数据加载成功事件
				onRenderAfter : function (){},//树渲染完成后执行事件
				onChecked : function () {},//被选中事件
				onCancelChecked : function () {},//取消选中事件
				onCheck : function () {},//选中事件
				onExpand : function () {},//节点展开事件
				onCollapse : function () {},//节点收缩事件
				onSelect : function () {},//被点选事件
				onClick : function () {}//点击事件（所有节点）
			}, o || {});

			var $this=$(this),url = o.url;
			var timestamp =Date.parse(new Date());
			var treeId = o.id || 'ul_soTree_'+timestamp+'_'+$('.ul_tree').length;

			var $E = {
				afterLoadData : function (obj,parChecked,topObj) {//加载tree表现及事件函数
					var that = this;
					//obj = obj.tagName;
					//alert();
					var $allLi = $('li',obj);
					$allLi.data('isleaf',true);
					$('li:has(ul)',obj).addClass('li_par').data('isexpand',true).data('isleaf',false).data('incomplete',false);//有ul子节点添加 li_par 类名标识
					$('li.li_par>.em_op',obj).addClass('em_par');//有ul子节点的li对应em添加class，添加加减号操作图标
					$('li.li_par>.span_t',obj).addClass('span_par');//有ul子节点的li对应span添加class，添加文件夹图标
					if (o.type != 'stepJson') {
						$('li:last',obj).addClass('li_last');
					}//末尾li添加 li_last 类名标识
					$('ul',obj).each(function () {
						//if (o.type != 'stepJson') {
							$(this).find('li:last').addClass('li_last');//每个ul末尾li添加 li_last 类名标识
						//}
						if ($('>li:last',this).hasClass('li_par')) {//查找到有子节点ul的末尾li，添加class，采用不同图标，去除虚线背景
							$('>li:last',this).addClass('li_parLast');//采用不同图标
							$('>li:last>ul',this).addClass('ul_chiLast');//去除虚线背景
						}
					});

					$('.em_par',obj).bind('click',function () {//点击十字图标，切换操作图标、文件夹图标、子ul状态
						var $lipar = $(this).parent();
						if (!$(this).hasClass('em_in')) {
							$lipar.data('isexpand',false);
							$(this).addClass('em_in').siblings('.span_par').addClass('span_in');
							if (o.slide) {$(this).siblings('ul').slideUp('fast');}else {$(this).siblings('ul').hide();}
						}else {
							$lipar.data('isexpand',true);
							$(this).removeClass('em_in').siblings('.span_par').removeClass('span_in').siblings('ul');
							if (o.slide) {$(this).siblings('ul').slideDown('fast');}else {$(this).siblings('ul').show();}
						}
					});

					$('.span_t',obj).bind('click',function () {
						var $lipar = $(this).parent();
						$allLi.data('isselected',false);
						$lipar.data('isselected',true);
						$('.span_t',obj).removeClass('span_t_selected');
						$(this).addClass('span_t_selected');
					});


					if (!o.expand) {//如果设置菜单为整体收缩
						$('.em_par',obj).addClass('em_in');
						$('.span_par',obj).addClass('span_in');
						$('.li_par',obj).data('isexpand',false);
						$('ul',obj).hide();
						if (o.expandPar.length) {//默认单独展开的父节点
							$.each(o.expandPar,function (i,v) {
								if ($('#'+v,obj).length) {
									$('#'+v,obj).data('isexpand',true);
									$('#'+v+'>.em_par:first',obj).removeClass('em_in');
									$('#'+v+'>.span_par:first',obj).removeClass('span_in');
									$('#'+v+'>ul',obj).show();
								}
							});
						}
					}else {
						if (o.collapsePar.length) {//默认单独收缩的父节点
							//window.console && console.log(o.collapsePar);
							$.each(o.collapsePar,function (i,v) {
								if ($('#'+v,obj).length) {
									$('#'+v,obj).data('isexpand',false);
									$('#'+v+'>.em_par:first',obj).addClass('em_in');
									$('#'+v+'>.span_par:first',obj).addClass('span_in');
									$('#'+v+'>ul',obj).hide();
								}
							});
						}
					}

					if (o.checkbox) {//如果有选择框
						var $b_chk = $('.b_chk',obj);
						$b_chk.css('display','inline');
						if (parChecked) {$b_chk.addClass('b_checked');}//如果父节点已勾选
						$b_chk.bind('click',function () {//选择框事件
							var $lipar = $(this).parent();
							if ($(this).hasClass('b_checked')) {
								$lipar.data('ischecked',false);
								$(this).removeClass('b_incomplete').removeClass('b_checked').parent('li').find('ul .b_chk').removeClass('b_checked');
							}else {
								$lipar.data('ischecked',true);
								$(this).addClass('b_checked').data('ischecked','true').parent('li').find('ul .b_chk').removeClass('b_incomplete').addClass('b_checked');
							}
							//巡检选择状态 start
							var parU = $(this).parents('ul');
							that.setUlCheckState(parU);
							//巡检选择状态 over
						});
					}

					$(obj).click(function (e) {
						var topObj = topObj?topObj:obj;//是否设定了顶级操作ul
						var oo = (e.target || e.srcElement);
						//console.log(oo.nodeName.toLowerCase());
						var cellInfo  = that.funReturnInfo(oo,topObj);
						return false;
					});
				},
				setUlCheckState : function (ul) {//判断父节点的选中状态
					var $ul = ul?$(ul):$('ul',$this);
					$ul.each(function () {
						var $that = $(this);
						var cLen = $that.find('.b_chk').length;
						var dLen = $that.find('.b_checked').length;
						if (cLen == dLen) {//比较 b_chk与b_checked长度以获得状态
							$that.siblings('.b_chk').removeClass('b_incomplete').addClass('b_checked');
							$that.parent().data('incomplete',false);
						}else if (dLen>0&&cLen != dLen) {
							$that.siblings('.b_chk').removeClass('b_checked').addClass('b_incomplete');
							$that.parent().data('incomplete',true);
						}else if (dLen==0){
							$that.siblings('.b_chk').removeClass('b_checked').removeClass('b_incomplete');
							$that.parent().data('incomplete',false);
						}
					});
				},
				funReturnInfo : function (obj,topObj) {//点击事件返回数据函数
					var that = this;
					var obj = $(obj);
					var pLi = obj.parent('li');
					pLi = (pLi.length)?pLi : obj;//顶级li无父节点情况就为自身
					var cellInfo = $.extend({
						childInfo : null
					},pLi.data()||{});

					if (!cellInfo.isleaf) {//非叶子节点，获得子对象信息并存于数组中
						var childInfo = [];
						//var $thisUl = $('>ul',pLi);
						var $thisULi = $('li',pLi);
						cellInfo.isexpand = !($('>em.em_par',pLi).hasClass('em_in'));
						$thisULi.each(function () {
							childInfo.push($(this).data());
						});
						cellInfo.childInfo = childInfo;
					}

					if (obj.hasClass('b_chk')) {//当前节点为b
						if (cellInfo.ischecked) {
							o.onChecked(cellInfo);
						} else {
							o.onCancelChecked(cellInfo);
						}
						o.onCheck(cellInfo);
					}

					if (obj.hasClass('span_t')) {//当前节点为span
						o.onSelect(cellInfo);
					}

					if (obj.hasClass('em_par')) {//当前节点为em
						if (obj.hasClass('em_in')) {
							o.onCollapse(cellInfo);
						}else {
							o.onExpand(cellInfo);
						}
					}
					o.onClick(cellInfo);
					return cellInfo;
				},
				checkAexpend : function (obj) {
					var that = this;
					if (o.hideId.length>0) {
						$.each(o.hideId,function () {$('#'+this).hide();});
					}
					if (o.dataSet) {
						$('li',obj).each(function () {
							$(this).attr('data-ischecked')=='true'?($('.b_chk',this).addClass('b_checked')):($('.b_chk',this).removeClass('b_checked'));
							$(this).attr('hide')=='true'&&($(this).hide());
							if ($(this).attr('data-isexpand')=='true') {
								$('>.em_par',this).removeClass('em_in');
								$('>.span_par',this).removeClass('span_in');
								$('>ul',this).show();
							}else if ($(this).attr('data-isexpand')=='false') {
								$('>.em_par',this).addClass('em_in');
								$('>.span_par',this).addClass('span_in');
								$('>ul',this).hide();
							}
						});
					}

					that.setUlCheckState();//初始化判断父节点的选中状态
				},
				getNodesParam : function (opt) {//返回对应类型节点(checked,unchecked,all)(justleaf?)对应的属性数组(attr)
					if (typeof(opt) === 'string') {
						opt = {
						node : 'checked',
						justleaf : true,
						data : opt 
						};
					}
					var o = $.extend({
						node : 'checked',//checked,unchecked,all
						justleaf : true,
						data : 'id' 
					},opt||{});
					var $li = $('li','#'+treeId);
					if (o.justleaf) {
						$li = $li.filter(function () {
							return !$(this).hasClass('li_par');
						});
					}
					if (!(o.node == 'all')) {
						$li = $li.filter(function () {
							var ed = $('>.b_chk',this).hasClass('b_checked');
							return (o.node=='unchecked')?!ed:ed;
						});
					}
					var backData = [];
					$li.each(function () {
						backData.push($(this).data(o.data));
					});
					return backData;
				},
				getTreeAllData : function () {//返回当前树所有节点的数据，包括状态值(展开状态、是否子节点、是否选中、是否勾选)
					var allData = [];
					var $li = $('li','#'+treeId);
					$li.each(function () {
						allData.push($(this).data());
					});
					return allData;
				}
			}

			//加载tree数据
			if (o.type== 'json') {//json格式数据
				$.getJSON(url, function(data) {
					var data = data;
					var len  = data.length;
					var ul_tree = $('<ul class="ul_tree"></ul>');
					ul_tree.attr('id',treeId);
					o.cls&&ul_tree.addClass(o.cls);
					var checked = o.checked;
					o.onSuccess(data);
					for (var i = 0; i < len; i++) {
						var dataCell = {
							id:data[i].id,
							pid:data[i].pid,
							text:data[i].text,
							state : data[i].state,
							//ischecked:data[i].ischecked,
							//isexpand:data[i].isexpand,
							isHide:data[i].hide
						};
						var dataHtml = '';
						for (k in data[i]) {
							dataHtml += 'data-'+k+'="'+data[i][k]+'" ';
						}
						dataHtml += 'data-isselected=false ';
						var ulLi = $(ul_tree).find('li'),lkey =1;
						var isHideS = '',liStateCls='',sStateCls = '';
						//console.log(dataCell.ischecked=='false');
						isHideS = dataCell.isHide===true?' style="display:none;"':'';
						liStateCls = (dataCell.state===1)?'': (dataCell.state===2?'li_break':'li_off');
						sStateCls = (dataCell.state===1)?'': (dataCell.state===2?'span_break':'span_off');
						for (var j = 0; j < ulLi.length; j++) {
							if ( dataCell.pid == ulLi.eq(j).attr('id')) {//是否有父节点pid，如果有，添加到对应父节点下
								if (ulLi.eq(j).find('>ul').length) {//如果已经有了ul
									ulLi.eq(j).find('>ul').append('<li id="'+dataCell.id+'" pid="'+dataCell.pid+'"'+isHideS+dataHtml+' class="'+liStateCls+'"><em class="em_op"></em><b class="b_chk"></b><span class="span_t '+sStateCls+'">'+dataCell.text+'</span>'+o.liExtendHtml+'</li>');
								}else {
									ulLi.eq(j).append('<ul><li id="'+dataCell.id+'" pid="'+dataCell.pid+'"'+isHideS+dataHtml+' class="'+liStateCls+'"><em class="em_op"></em><b class="b_chk"></b><span class="span_t '+sStateCls+'">'+dataCell.text+'</span>'+o.liExtendHtml+'</li></ul>');
								}
								lkey = 0;//添加到已有节点下则lkey = 0
							}
						}
						if (lkey) {//如果没有找到父节点pid，添加到根节点下
							ul_tree.append('<li id="'+dataCell.id+'" pid="'+dataCell.pid+'"'+isHideS+dataHtml+' class="'+liStateCls+'"><em class="em_op"></em><b class="b_chk"></b><span class="span_t '+sStateCls+'">'+dataCell.text+'</span>'+o.liExtendHtml+'</li>');
						}
					}//循环判断生成树

					/*<ul class="ul_tree">
						<li><em class="em_op"></em><span class="span_t">节点1</span></li>
					</ul> json生成树的基元结构*/
					$E.afterLoadData(ul_tree,checked);
					$this.append(ul_tree);
					$E.checkAexpend($this);
					o.onRenderAfter(data);
				});
			}else if (o.type == 'stepJson') {//分布json格式数据载入
				o.expand = false;
				var checked = o.checked;
				var ul_tree,rootBox;
				if (o.rootHide) {//根节点隐藏，则tree父盒子不同
					ul_tree = $('<ul class="ul_tree"></ul>');
					ul_tree.attr('id',treeId);
					o.cls&&ul_tree.addClass(o.cls);
					rootBox = $(ul_tree);
				}else {
					ul_tree = $('<ul class="ul_tree"></ul>');
					var rootHtml = '<li id='+o.rootId+' class="li_par"><em class="em_op em_par"></em><b class="b_chk"></b><span class="span_t span_par">'+o.rootText+'</span><ul></ul></li>';
					ul_tree.append(rootHtml);
					rootBox = $('ul',ul_tree);
				}

				var rootUrl = url+'?id='+o.rootId;
				$.getJSON(rootUrl, function(data) {//初次加载
					var data = data;
					var len  = data.length;
					o.onSuccess(data);
					for (var i = 0; i < len; i++) {
						var dataCell = {
							id:data[i].id,
							pid:data[i].pid,
							text:data[i].text,
							nodetype:data[i].nodetype,
							ischecked:data[i].ischecked,
							isHide:data[i].hide
						};
						var nodeClass = dataCell.nodetype?'class="li_par"':'';
						var ischeckedS = '',isHideS = '';
						//if (dataCell.ischecked===true) {ischeckedS = ' ischecked="true"';}else if(dataCell.ischecked===false){ischeckedS = ' ischecked="false"';}
						if (dataCell.isHide===true) {isHideS = ' style="display:none;"';}
						rootBox.append('<li id="'+dataCell.id+'" pid="'+dataCell.pid+'" '+nodeClass+ischeckedS+isHideS+'><em class="em_op"></em><b class="b_chk"></b><span class="span_t">'+dataCell.text+'</span></li>');
					}
					$E.afterLoadData(ul_tree,checked);
					$this.append(ul_tree);
					$E.checkAexpend(ul_tree);
					if ((!o.rootHide)&&o.rootExpand) {//如果节点收缩并且根节点不隐藏
						rootBox.show();
						$('.em_op:first',ul_tree).removeClass('em_in');
					}
					$('.em_par',ul_tree).live('click',function () {//点击可扩展节点，进行异步请求数据
						var loadLi = $(this).parent();
						if (loadLi.find('ul').length==0) {//如果未加载过，进行加载
							var checked = o.checked,topUl = ul_tree;
							if ($('.b_chk:first',loadLi).hasClass('b_checked')) {checked = true;}//判断当前可扩展节点是否被勾选，如果是，扩展后的子对象也被勾选
							var stepUrl = o.url +'?id='+loadLi.attr('id');//对应当前节点json链接
							$.getJSON(stepUrl, function(stepData) {//请求json数据
								var stepData = stepData;
								var stepLen = stepData.length;
								var stepTree = $('<ul></ul>');
								o.onStepSuccess(stepData);
								for (i = 0; i < stepLen; i++) {
									var dataCell = {
										id:stepData[i].id,
										pid:stepData[i].pid,
										text:stepData[i].text,
										nodetype:stepData[i].nodetype,
										ischecked:stepData[i].ischecked,
										isHide:data[i].hide
									};
									var nodeClass = dataCell.nodetype?' class="li_par"':'';
									var ischeckedS = '',isHideS = '';
									if (dataCell.ischecked===true) {ischeckedS = ' ischecked="true"';}else if(dataCell.ischecked===false){ischeckedS = ' ischecked="false"';}
									if (dataCell.isHide===true) {isHideS = ' style="display:none;"';}
									stepTree.append('<li id="'+dataCell.id+'" pid="'+dataCell.pid+'"'+nodeClass+ischeckedS+isHideS+'><em class="em_op"></em><b class="b_chk"></b><span class="span_t">'+dataCell.text+'</span></li>');
								}//生成ul树
								$E.afterLoadData(stepTree,checked,topUl);//加载新添加节点树所有事件
								$(stepTree).hide();//先隐藏，以便slide动画执行
								loadLi.append(stepTree);
								$E.checkAexpend(stepTree);
								if (o.slide) {$(stepTree).slideDown('fast');}else {$(stepTree).show();}
							});
						}
					});
					o.onRenderAfter(data);
				});
			}else if (o.type == 'html') {//页面已有html dom结构
				/*<ul>
					<li><span>节点1</span></li>
				</ul> html树的基元结构*/
				if ($('span',$this).length>0) {
					$('ul',$this).addClass('ul_tree');
					$('span',$this).addClass('span_t').before('<em class="em_op"></em><b class="b_chk"></b>');
					$E.afterLoadData($('.ul_tree',$this),o.checked);
					$E.checkAexpend($this);
				}else {
					alert('html树结构不正确，参考结构：<ul><li><span>节点1</span></li></ul>');
				}
			}
			return {getNodesParam:$E.getNodesParam , getTreeAllData:$E.getTreeAllData};
		},
		'soSelTree' : function (o) {// 下拉菜单树
			var o =$.extend({
				cls : null,
				url : null,//url
				treeW : 180,//树盒子宽
				treeMaxH : 300,//树盒子高
				offset : [0,25],//相对对其元素偏移量
				slide : true,//是否slide显示树下拉
				valOpt : 'sid',//value取对应树的值
				txtOpt : 'text',//text取对应树的值
				defaultVal : null,//默认选择值
				checkbox : true,//是否显示checkbox
				checked : false,
				dataSet : true,
				//justBackLeaf : true,//是否只是点击叶子节点返回事件
				//selectHide : true,//点选隐藏树下拉菜单
				//mergeSelChk : false,//是否合并点选和勾选事件
				multiCheck : true,//是否多选，ture为返回多选结果，false为返回单选结果，此时check事件合并到select事件里

				onRenderAfter : function(){},//点击节点自定义事件
				onSelect : function(){},//点击节点自定义事件
				onCheck : function(){},//选择节点自定义事件

				onSuccess : function () {},//数据加载成功事件
				onChecked : function () {},//被选中事件
				onCancelChecked : function () {},//取消选中事件
				onExpand : function () {},//节点展开事件
				onCollapse : function () {},//节点收缩事件
				onClick : function () {}//点击事件（所有节点）
			},o||{});
			var _self  = $(this);
			var url = o.url || _self.attr('data-url');
			var $sTxt = $('<span class="s-treeTxt"></span>');
			var treeboxId = 'selTreeBox_'+$('.selTreeBox').length;
			var $treebox = $('<div id="'+treeboxId+'" class="selTreeBox" style="width:'+o.treeW+'px;max-height:'+o.treeMaxH+'px;_height:'+o.treeMaxH+'px;"></div>');
			var $close = $('<span class="s-treeClose"></span>');
			_self.hide().after($sTxt);
			$treebox.append($close);
			$('body').append($treebox);
			$treebox.setOffset($sTxt,o.offset).hide();
			if (url) {
				var v = o.defaultVal || _self.val();
				if (v==='') {$sTxt.text('请选择...');}
				$treebox.soTree({
					cls : o.cls,
					url:url,
					checked: o.checked,
					dataSet : o.dataSet,
					checkbox : o.checkbox,
					onRenderAfter : function (data) {
						if (v!=='') {// 有默认值时trigger点击默认值的节点
							window.console && console.log(v);
							$('li[data-'+o.valOpt+'="'+v+'"]').find('.span_t').trigger('click');
						}
						o.onRenderAfter(data);
					},
					onCheck : function (node) {
						// window.console && console.log(node);
						if (o.multiCheck) {
							var data = multiBack();
							o.onCheck(node,data);
							//o.selectHide&&$treebox.hide();
						}else {
							singleBack(node);
							o.onCheck(node);
						}
					},
					onSelect : function (node) {
						$('>.b_chk','#'+node.id).trigger('click');
					},
					onSuccess : function (data) {o.onSuccess(data)},//数据加载成功事件
					onChecked : function (node) {o.onChecked(node)},//被选中事件
					onCancelChecked : function (node) {o.onCancelChecked(node)},//取消选中事件
					onExpand : function (node) {o.onExpand(node);},//节点展开事件
					onCollapse : function (node) {o.onCollapse(node)},//节点收缩事件
					onClick : function (node) {o.onClick(node)}//点击事件（所有节点）
				});

				$sTxt.click(function () {
					if (o.slide) {
						$treebox.slideDown('fast');
					}else {
						$treebox.show();
					}
				});
				$close.click(function () {
					$treebox.hide();
				});
				// 不选择，自动隐藏树
				var st = null;
				$treebox.mouseenter(function () {
					clearTimeout(st);
				}).mouseleave(function () {
					st = setTimeout(function () {
						$treebox.hide();
					},1000);
				});

			}

			function multiBack() {
				var $chked = $('.b_checked','#'+treeboxId);
				var backData = {
					node : [],
					id : [],
					sid : [],
					text : []
				};
				$chked.each(function () {
					var $par = $(this).parent();
					if (!$par.hasClass('li_par')) {
						backData.node.push($par);
						backData.id.push($par.attr('id'));
						backData.sid.push($par.attr('data-sid'));
						backData.text.push($par.find('.span_t').text());
					}
				});
				$sTxt.text(backData.text.join(','));
				_self.val(backData.sid.join(','));
				return backData;
			}

			function singleBack(node) {
				var $chk = $('.b_chk','#'+treeboxId);
				$chk.removeClass('b_checked');
				$('>.span_t','#'+node.id).trigger('click');
				$sTxt.text(node.text);
				_self.val(node.sid);
			}
			return _self;
		},
		'setOffset' : function (obj,offset) {// 元素绝对定位到 位置对象 的位置，obj: 位置对象 , offset : 偏移量 [left,top]
			var _self = $(this);
			var $o = $(obj);
			var ss = offset || [0,0];
			var os = {l:$o.offset().left,t:$o.offset().top};
			_self.css({
				'position':'absolute',
				'left':(os.l+ss[0]*1)+'px',
				'top':(os.t+ss[1]*1)+'px'
			});
			return _self;
		}
	});

})(jQuery);







