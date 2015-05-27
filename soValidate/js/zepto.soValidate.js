/* soValidate1.0
* 作者： bujichong
* 邮箱 ：bujichong@163.com
* 附 serializeObject


一、使用：
html ---------------------
<!-- 使用默认		{required:true}	 -->
<input type="text" id="username" class="txt" validate="{required:true}" name="nicename" value="" />

<!-- 只自定义提示信息		{required:'请填写联系方式'}	 -->
<input type="text" class="txt" validate="{required:'请填写联系方式'}" name="address" value="" />

<!-- 高级自定义传参和提示信息 -->
<!-- {len:{opt:[3,17],msg:'请设置4到16位的密码'}}	opt：参数，msg：提示信息 -->
<input type="text" id="password" class="txt" validate="{len:{opt:[3,17],msg:'请设置4到16位的密码'}}" name="password" value="" />

<!-- 高级自定义错误信息形式 将自定义属性放在指定的标签内 -->

<!-- {errorCls:'txt-err',msgCls:'msg-err',msgPos:'#msgWrap'}	errorCls：错误input添加class，msgCls：提示信息class，msgPos：提示信息放置位置 -->
<input type="text" id="password" class="txt" errorDiy="{errorCls:'txt-err',msgCls:'msg-err',msgPos:'#msgWrap'}" name="password" value="" />


js 使用----------------------------
// 使用1 ： 如果参数与预设参数相同(参考下面注释)
$(form).soValidate();

// 使用2 ： 异步提交验证示例
$(form).soValidate({
	submitBtn : '.submitBtn',
	submit : function (form) {
		var formData = form.serializeObject();
		window.console && console.log(formData);
		$.ajax({
			url : 'xxx',
			data : formData,
			success : function (){

			}
		});
	},
	fail : function (form,failInputArr) {
		window.console && console.log(failInputArr);//验证不成功的inputs数组
	}
});

// 使用3 ： 验证时排除当前form区域里的某些inputs(即存在不验证区域)，或添加当前form范围之外的某些inputs
$(form).soValidate({
	exInputs : '#exArea :input',
	inInputs : '#inArea :input'
});

// 使用4 ： 提供方法交互验证
var $formV = $(form).soValidate();
$(aBtn).click(function(){	$formV.addInputs('#inArea :input');	 }); //增加验证inputs
$(bBtn).click(function(){	$formV.removeInputs('#exArea :input');	 }); //移除验证inputs
$(cBtn).click(function(){	$formV.addArea('#inArea');	 }); //增加验证区域，即增加验证指定区域里的inputs
$(dBtn).click(function(){	$formV.clearArea('#exArea');	 }); //移除验证区域，即移除验证指定区域里的inputs，并清理验证残留的样式
$(eBtn).click(function(){	$formV.destroy();	 }); //销毁验证
$(fBtn).click(function(){	$formV.validate({});	 }); //启动验证，并可以修改已定义各项参数



二、验证扩展
默认包含的验证方法，参考$.soValidate.rules
使用以下方法扩展一个新的验证规则或覆盖已有规则
$.soValidate.addRex({
	rulename : {
		rule : function (val,param){//param为传入的参数

		},
		msg : function (val,param){

		}
	}
});


*/

;(function () {
	/* serializeObject ** 表单属性对象化 */
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	}

	/* soValidate ** 表单验证 */
	$.fn.soValidate = function (o) {
		var o = $.extend({
			attr : 'validate',//获取验证的标签，默认是 validate
			quickAttr : 'class',//获取快捷验证的标签，默认采用 class
			errorCls : 'txt-err',//input出错时，添加的class，默认是txt-err
			msgCls : 'em-errMes',//错误提示信息的class
			msgPos : null,//用来显示错误信息的盒子
			inputPar : '.p-item',//如果不设置具体的msgPos，就将错误信息放在inputPar标签内,当前input的父级对象
			errDiyAttr : 'errorDiy',//自定义验证错误属性标签，注：一旦自定义错误的样式属性，clearArea清除样式方法会失效
			trim : true,//是否对验证填写框做tirm截取，默认为是
			inInputs : null,//添加额外的验证对象
			exInputs :null,//排除已包含的验证对象
			validate : true,//默认开启验证
			submitBtn : '.btn-submit',//提交按钮，zepto版必须指定提交按钮，默认不设定
			submit : function (form) {//默认验证成功提交submit事件
				form.submit();
			},
			fail : function (form,failInputArr) {//验证失败事件(返回form和验证失败的inputs)
			}
		},o||{});
		var _self = $(this);
		var $inputs,$submitBtn,$rules = $.soValidate.rules;
		var vv = {
			validate : function (opt) {//主验证函数
				o = $.extend(o,opt||{});
				$inputs&&$inputs.off('blur');//重置验证
				$submitBtn&&$submitBtn.off('touchend');//重置验证
				//_self.unbind('submit.validate');//重置验证
				$inputs = _self.find('input,select,textarea');//初次或再次获得$inputs对象
				if(o.inInputs){$inputs.add(o.inInputs)}
				if(o.exInputs){$inputs.not(o.exInputs)}
				$submitBtn = $(o.submitBtn);
				if (o.validate) {
					$submitBtn.on('touchend',function (e) {//开启提交验证
						e.preventDefault();
						vv._submitValidate();
					});
					$inputs.on('blur',function () {
						vv._blurValidate(this);
					});//重新绑定
					// _self.bind('submit.validate',function () {
					// 	vv._submitValidate();
					// 	return false;
					// });
				}
			},
			_blurValidate : function (obj) {//blur事件函数
				vv._inputCheck(obj);
			},
			_submitValidate : function () {//submit验证函数
				var state = true;
				var $failInputs = [];
				$inputs.each(function () {
					var s =  vv._inputCheck(this);
					!s.state&&$failInputs.push(this);
					state = state && s.state;
				});
				if (state) {
					o.submit(_self);
				}else {
					o.fail(_self,$failInputs);
				}
			},
			_inputCheck : function (obj) {//单条验证方法
				var $o =$(obj);
				o.trim && $o.val($.trim($o.val()));//trim
				var val = $o.val();
				var attr = $o.attr(o.attr),errDiyAttr = $o.attr(o.errDiyAttr),quickAttr = $o.attr(o.quickAttr);
				var r = $rules , state = true;
				/* 处理自定义错误参数 */
				var tE = {//初始参数
					errorCls : o.errorCls,
					msgPos : o.msgPos,
					msgCls : o.msgCls,
					inputPar : o.inputPar
				}
				if (errDiyAttr) {//如果存在自定义错误属性
					var errDiyO = eval('('+errDiyAttr+')');
					$.extend(tE,errDiyO||{});
				}

				/* 处理验证 */
				if (quickAttr) {//class快捷方式 class= "type[msg] type['msg']"
					var quickArr = quickAttr.split(' ');//以空格方式隔开
					$.each(quickArr,function (k,v) {
						vArr = v.split(/\['|\["|"\]|'\]|\[|\]/);// type[msg] || type['msg'] || type["msg"]
						var type = vArr[0];
						var msg = (vArr[1])?vArr[1]:null;
						state = eachValid($o,val,type,null,msg);//执行单个验证
						if (!state) {return false;}//跳出循环
					});

					if (!state) {return {state:false}};//不满足当前验证直接返回状态，不进行下一步验证
				}

				if (attr) {//高级验证方式  validate = {type : true, type:'msg', type :{opt:opt , msg:msg}}
					try{
						var attrO = eval('('+attr+')');//转为对象
					}catch(e){
						window.console?(console.log(attr+' 验证格式不正确，必须为JSON！')):(alert(attr+' 验证格式不正确，必须为JSON！'));//错误反馈
						return {state:false};
					}
					$.each(attrO,function (k,v) {//循环所有验证属性
						var type = k,opt = null,msg = null;
						if (typeof v == 'boolean') {}//形式1：{type : true}
						if (typeof v=='string') {msg = v;}//形式2：{type : 'msg'}
						if (typeof v == "object") {//形式3：type :{opt:opt , msg:msg}
							if (v.msg) {msg = v.msg}
							if (v.opt) {opt = v.opt}
						}
						state = eachValid($o,val,type,opt,msg);//执行单个验证
						if (!state) {return false;}
					});
					if (!state) {return {state:false}};
				}

				function eachValid($o,val,type,opt,msg) {//each验证函数
					var re =true;
					if (type == "required") {//验证必填
						re = r['required'].rule(val);
					}
					if (r[type]&&val) {//验证其他
						re = r[type].rule(val,opt);
					}

					if (re) {//如果当前验证通过
						$o.removeClass(tE.errorCls);
						vv._byTip($o,false,tE.msgCls,tE.inputPar,tE.msgPos);//修改提示状态
					}else {//如果验证失败
						msg = msg || (r[type].msg(val,opt));
						$o.addClass(tE.errorCls);
						vv._byTip($o,msg,tE.msgCls,tE.inputPar,tE.msgPos);//修改提示状态
					}
					return re;
				}

				return {state:true};
			},
			_byTip : function(obj,msg,msgCls,inputPar,msgPos) {//验证提示方法
				var $p = msgPos?$(msgPos):($(obj).parents(inputPar)?$(obj).parents(inputPar):$(obj).parent());//定义放置错误信息的盒子
				if (msg) {//错误状态
					if ($p.find('.'+msgCls+'').length<1) {
						$p.append('<em class="'+msgCls+'">'+msg+'</em>');
					}
					$p.find('.'+msgCls+'').html(msg);
				}else {//正确状态
					$p.find('.'+msgCls+'').remove();
				}
			},
			getInputs : function () {//返回inputs
				return $inputs;
			},
			addInputs : function (inputs) {//增加inputs
				$inputs.unbind('blur.validate');//移除绑定
				$inputs = $inputs.add(inputs);
				$inputs.bind('blur.validate',function () {
					vv._blurValidate(this);//内部私有
				});//重新绑定
				return $inputs;
			},
			removeInputs : function (inputs) {//移除inputs
				$inputs.unbind('blur.validate');
				$inputs = $inputs.not(inputs);
				$inputs.bind('blur.validate',function () {
					vv._blurValidate(this);
				});
				return $inputs;
			},
			addArea : function (area) {//增加area范围内的inputs验证
				$inputs.unbind('blur.validate');
				$inputs = $inputs.add(area+' :input');
				$inputs.bind('blur.validate',function () {
					vv._blurValidate(this);
				});
				return $inputs;
			},
			clearArea : function (area) {//移除area范围内的inputs验证，并清除验证样式
				$inputs.unbind('blur.validate');
				$inputs = $inputs.not(area+' :input');
				$(area+' :input').removeClass(o.errorCls);
				$(area).find('.'+o.msgCls).remove();
				$inputs.bind('blur.validate',function () {
					vv._blurValidate(this);
				});
				return $inputs;
			},
			destroy : function () {//销毁验证
				$inputs&&$inputs.unbind('blur.validate');
				$submitBtn&&$submitBtn.unbind('click.validate');
				_self.find(':input').removeClass(o.errorCls);//销毁验证，清除默认区域里的残留样式和信息
				_self.find('.'+o.msgCls).remove();
			}
		}

		vv.validate();//初始化

		return {
			validate : vv.validate,
			getInputs : vv.getInputs,
			addInputs : vv.addInputs,
			removeInputs : vv.removeInputs,
			addArea : vv.addArea,
			clearArea : vv.clearArea,
			destroy : vv.destroy
		};
	}

	$.soValidate = {
		rules : {},//验证规则
		addRex : function (rule) {//扩展验证
			$.extend(this.rules,rule);
		}
	};

	/* 扩展验证规则 */
	$.soValidate.addRex({
		required:{
			rule : function (val) {
				return val!='';
			},
			msg:function () {
				return '请填写必填字段！';
			}
		},

		baseChar : {
			rule : function (val) {
				return /^\w+$/.test(val);
			},
			msg:function () {
				return '只能用英文字母、数字和下划线';
			}
		},
		baseCnChar : {
			rule : function (val) {
				return /^[\u0391-\uFFE5\w]+$/.test(val);
			},
			msg:function () {
				return '只能用中文、英文字母、数字和下划线';
			}
		},
		number : {
			rule : function (val) {
				return /^[\d]+([\.][\d]+){0,1}$/.test(val);
			},
			msg:function () {
				return '请填写正确的数字！';
			}
		},
		email : {
			rule : function (val) {
				return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val);
			},
			msg:function () {
				return '请填写正确的电子邮箱！';
			}
		},
		phone : {
			rule : function (val) {
				return /^(0\d{2,3})-(\d{7,8})(-(\d{2,}))?$/.test(val);
			},
			msg:function () {
				return '请填写正确的电话号码！如：010-62392951';
			}
		},
		mobile : {
			rule : function (val) {
				return /^((1)+\d{10})$/.test(val);
			},
			msg:function () {
				return '请填写正确的手机号！';
			}
		},
		equalTo : {
			rule : function (val,param) {// param : 'dom'
				return val == $(param).val();
			},
			msg:function () {
				return '两次填写的值不一致，请重新填写！';
			}
		},
		zipCode : {
			rule : function (val) {
				return /^[0-9]{6}$/.test(val);
			},
			msg:function () {
				return '请填写正确的邮政编码！';
			}
		},
		len : {
			rule : function (val,param) {// param : [number1,number2]
				return val.length>param[0]&&val.length<param[1];
			},
			msg:function (val,param) {
				return '请填写一个长度大于'+param[0]+'小于'+param[1]+'的字符';
			}
		},
		max : {
			rule : function (val,param) {// param : number
				return val<param;
			},
			msg:function (val,param) {
				return '请填写一个小于'+param+'的数字';
			}
		},
		min : {
			rule : function (val,param) {// param : number
				return val>param;
			},
			msg:function (val,param) {
				return '请填写一个大于'+param+'的数字';
			}
		},
		plateNum :{//车牌号码，不包括中文，只验证后6位
			rule : function (val) {
				return /^[A-Za-z0-9]{6}$/.test(val);
			},
			msg:function () {
				return '请填写正确的车牌号码！';
			}
		},
		remote : {//远程验证
			rule : function (val,param) {// param : {url : xx, key: xxx,data :{}}
				var d={};
				d[param.key] = val;
				var data = $.extend(d,param.data||{});
				var b = false;
				$.ajax({
					url : param.url,
					data : data,
					async : false,
					success : function (data) {
						b = data.success;
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						alert('向服务器请求验证失败！');
					}
				});
				return b;
			},
			msg:function (val,param) {
				return '您的填写不正确！';
			}
		}
	});


})(window.jQuery||window.Zepto);
