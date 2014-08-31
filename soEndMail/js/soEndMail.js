/* soEndMail 1.0 
* 为了减少js操作复杂，用来显示mail的列表自行插入到input html代码后，方法直接调用list父盒子 
* 使用：
*		$('.txtUser').soEndMail({
*			mail : ["qq.com","163.com","126.com","sina.com","sina.cn","tom.com"],//默认有最常用的邮箱后缀
*			listWrap :'.ul-mailList'
*		});
*/

(function($){
	$.fn.extend({
		"soEndMail": function(o){
			var o = $.extend({
				mail : ["163.com","qq.com","126.com","sina.com","sohu.com","yahoo.com.cn","hotmail.com","21cn.com","tom.com","yeah.net","gmail.com","yahoo.cn","263.net","msn.com","foxmail.com","haier.com","yahoo.com","sogou.com","eyou.com","139.com","sina.com.cn"],//邮箱列表，以数组的方式存放，如 ['sina.com','163.com','gmail.com']
				listWrap : null//存放mail的盒子
			},o||{});


			this.each(function () {
				var _self = $(this);
				var mailArr = o.mail;
				var $list = $(o.listWrap);
				var nowI = -1;//初始化共享列表index
				var oldVal="";//检查keyup时input value是否有变化

				_self.keyup(function (e) {//keyup事件
					var val = $.trim($(this).val());
					var keycode = e.keyCode;
					if (oldVal!=val) {//如果value有变化重置list index
						nowI = -1;
						oldVal=val;
					}
					//if (val.indexOf('@')>0) {//@存在并在第一个字节之后
					if (/^[0-9a-zA-Z_-]{1,31}@[_.0-9a-zA-Z-]{0,31}$/.test(val)) {//满足格式判断
						var o = val.split('@')[0];//@之前
						var m= val.split('@')[1];//@之后
						var selMailList = $.map(mailArr,function (n) {
							 var r = new RegExp("^" + m + "");
							return r.test(n)?n:null;//返回数组中符合条件的邮箱末尾
						});
						if (selMailList==false) {
							$list.empty().hide();
							return;
						}
						var mailLi = '';
						$.each(selMailList,function (i,v) {//插入html
							mailLi += '<li class="li-soMailList"><a href="#">'+o+'@'+v+'</a></li>';
						});
						$list.html(mailLi).show();
					}else {//不满足条件处理
						$list.empty().hide();
					}

					var len = $list.find('li').length;
					if (len>0&&keycode==38) {//键盘上键事件
						nowI = (nowI>0)?(nowI-1):0;
						$list.find('li').eq(nowI).addClass('li-now');
					}
					if (len>0&&keycode==40) {//键盘下键事件
						nowI = (nowI<(len-1))?(nowI+1):(len-1);
						$list.find('li').eq(nowI).addClass('li-now');
					}
					if (len>0&&keycode==13) {//键盘回车键事件
						_self.val($list.find('li').eq(nowI==-1?0:nowI).text());
						$list.empty().hide();
						nowI = -1;
					}
				});

				$(document).on('click',function () {//用户退出选择处理
					$list.empty().hide();
				});
				
				$(document).on('click',(o.listWrap+' .li-soMailList'),function () {//点击列表处理
					_self.val($(this).text());
					$list.empty().hide();
					nowI = -1;
					return false;
				});

			});
			return this;

		}
	});
})(jQuery);