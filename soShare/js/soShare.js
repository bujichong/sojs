/* soShare */
(function($){
	$.fn.extend({
		"soShare": function(o){
			o= $.extend({
				space : ['sina','qq','qZone','renren','kaixin','douban'],//['sina','qq','qZone','renren','kaixin','douban']  || 'all'
				url : location.href,
				title : encodeURIComponent($('title').text()),
				pic : null,
				content :null
			}, o || {});
			var _self = $(this);
			if (o.space ==='all') {o.space = ['sina','qq','qZone','renren','kaixin','douban'];}
			var shareHtml ='';
			$.each(o.space,function (i,v) {
				switch (v) {
					case 'sina' :
						shareHtml += '<a class="a-share a-share-sina"href="http://v.t.sina.com.cn/share/share.php?url='+o.url+'&title='+o.content+'&rcontent='+o.content+'&pic='+o.pic+'" title="分享到新浪微博" target="_blank">新浪微博</a>';
						break;
					case 'qq' :
						shareHtml += '<a class="a-share a-share-qqZone" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+o.url+'&title='+o.title+'&pics='+o.pic+'&summary='+o.content+'" title="分享到QQ空间" target="_blank">QQ空间</a>';
						break;
					case 'qZone' :
						shareHtml += '<a class="a-share a-share-qqwb" href="http://share.v.t.qq.com/index.php?c=share&a=index&url='+o.url+'&title='+o.content+'&pic='+o.pic+'" title="分享到腾讯微博" target="_blank">腾讯微博</a>';
						break;
					case 'renren' :
						shareHtml += '<a class="a-share a-share-renren" href="http://widget.renren.com/dialog/share?resourceUrl='+o.url+'&srcUrl='+o.url+'&title='+o.content+'&pic='+o.pic+'&description=" title="分享到人人网" target="_blank">人人网</a>';
						break;
					case 'kaixin' :
						shareHtml += '<a class="a-share a-share-kaixin" href="http://www.kaixin001.com/rest/records.php?url='+o.url+'?sid=&style=11&content='+o.content+'&stime=&sig=" title="分享到开心网" target="_blank">开心网</a>';
						break;
					case 'douban' :
						shareHtml += '<a class="a-share a-share-douban" href="http://shuo.douban.com/!service/share?image='+o.pic+'&href='+o.url+'?sid=&name='+o.title+'" title="分享到豆瓣" target="_blank">豆瓣</a>';
						break;
				}
			});
			_self.append(shareHtml);
			return _self;
		}
	});
})(jQuery);