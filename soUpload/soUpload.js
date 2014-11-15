$.soUpload = function(opt) {
    var opt = $.extend({
        action: '',
        params: {},
        upBtn: null,
        fileName : null,
        submitBrn: null,
        nameText: null,
        emptyMsg: '',
        dataType: 'JSON',
        accept : ['.jpg','.png'],
		errAcceptMsg : '上传文件格式不正确！',
        submit: function() { //提交之前
        },
        complete: function() { //上传完成
        }
    }, opt || {});

    var iframeName = 'iframeF_' + Math.floor(Math.random() * 10000);
    // var $iframe = $('<iframe id="' + iframeName + '" name="' + iframeName + '" src="'+opt.action+'" style="display:none;"></iframe>');
     var $iframe = $('<iframe id="' + iframeName + '" name="' + iframeName + '" style="display:none;"></iframe>');

    var upForm = $('<form></form>');
    upForm.attr({
        target: iframeName,
        action: opt.action,
        method: "post",
        enctype: "multipart/form-data"
    }).css({
        position: 'absolute',
        top: '-3000px',
        left: '-3000px',
        width: '0px',
        height: '0px'
    });

    var $upInput = $("<input type='file'/>");
    $upInput.css({
        position: "absolute",
        top: '-3000px',
        left: '-3000px',
        opacity: 0,
        width: '0px',
        height: '0px'
    });

    $upInput.attr({
      //  accept: opt.accept,
        name: opt.fileName
    });

    upForm.append($upInput);
    $('body').append(upForm);
    $('body').append($iframe);

    for (var param in opt.params) {
        var $hidden = $("<input type='hidden'/>").attr({
            name: param,
            value: opt.params[param]
        });
        upForm.append($hidden);
    }

    $(opt.upBtn).click(function() {
        $upInput.click();
    });

    var $nameText = $(opt.nameText).attr('readonly', 'readonly');
    $upInput.change(function() {
        $nameText.val(this.value);
    });

    $(opt.submitBrn).click(function() {
        var val = $nameText.val();
		var $par = $nameText.parent();
        if (val == '') {
			var $err = $par.find('.em-errMes');
            if ($err.length) {
                $err.html(opt.emptyMsg);
            } else {
                $par.append('<em class="em-errMes">' + opt.emptyMsg + '</em>');
            };
        } else {
            var can = false;
            if(opt.accept.length){
                $.each(opt.accept,function (i,v) {
                    if (val.indexOf(v)>-1) {can = true;return false;};
                });
            }else {
				can = true;
            }
			if (can) {
				var $par = $nameText.parent();
				var $err = $par.find('.em-errMes');
				if ($err.length) {
					$err.remove();
				};
				opt.submit(upForm);
				upForm.submit();
			}else {
				var $err = $par.find('.em-errMes');
				if ($err.length) {
					$err.html(opt.errAcceptMsg);
				} else {
					$par.append('<em class="em-errMes">'+opt.errAcceptMsg+'</em>');
				};
			}

        };
    });


    $iframe.load(function() {
        var im = document.getElementById(iframeName);
        var text = $(im.contentWindow.document.body).text();
        //window.console && console.log(text);
        if (text) {
            try {
                if (typeof text == "string"){
                    text = $.parseJSON(text);
                }
            } catch (e) {
                text = "error";
            }
        }
        opt.complete.call(null, text);
    });

};
