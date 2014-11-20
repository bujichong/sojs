$.soUpload = function(opt) {
    var opt = $.extend({
        action: '',
        params: {},
        upBtn: null,
        fileName : null,
        submitBrn: null,
        nameText: null,
        emptyMsg: '',
        msgPos : null,
        dataType: 'JSON',
        accept:[ ".jpg", ".png" ],
        errAcceptMsg:"上传文件格式不正确！",
        submit: function() { //提交之前
        },
        complete: function() { //上传完成
        }
    }, opt || {});

    var rand = Math.floor(Math.random() * 10000);
    var iframeName = 'iframeF_' + rand;
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
    var $paramsBox = $("<div class='paramsBox_"+rand+"'></div>");
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
        $paramsBox.append($hidden);
    }
    upForm.append($paramsBox);

    $(opt.upBtn).click(function() {
        $upInput.click();
    });

    var $nameText = $(opt.nameText).attr('readonly', 'readonly');
    $upInput.change(function() {
        $nameText.val(this.value);
    });

    function updateParams(updateParams) {
        $paramsBox.empty();
        for (var param in updateParams) {
            var $hidden = $("<input type='hidden'/>").attr({
                name: param,
                value: updateParams[param]
            });
            $paramsBox.append($hidden);
        }
    }

    function errMsgF(err,$text,msg) {
        if (err) {//如果err为真需要显示msg
            if (opt.msgPos) {//如果指定了msgPos
                $(opt.msgPos).html(msg);
            }else{
                var $par = $text.parent();
                var $err = $par.find('.em-errMes');
                if ($err.length) {
                    $err.html(msg);
                } else {
                    $par.append('<em class="em-errMes">' + msg + '</em>');
                };
            };
        }else{//如果没有错误，移除msg
            if (opt.msgPos) {//如果指定了msgPos
                $(opt.msgPos).empty();
            }else{
                var $par = $text.parent();
                var $err = $par.find('.em-errMes');
                if ($err.length) {
                    $err.remove();
                };
            }
        };
    }

    $(opt.submitBrn).click(function() {
        //window.console && console.log('click',$nameText.val());
        var val = $nameText.val();
        if ($.trim(val) == '') {
            errMsgF(true,$nameText,opt.emptyMsg);//为空提示
        } else {
            if (opt.accept.length) {
                var f = false;
                $.each(opt.accept,function (i,v) {
                    if (val.indexOf(v)>0) {f = true;return false;};
                });
                if (!f) {
                    errMsgF(true,$nameText,opt.errAcceptMsg);//格式不正确提示
                    return false;
                };
            };

            errMsgF(false,$nameText);//全都ok移除msg
            opt.submit(upForm);
            upForm.submit();
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
        $upInput.val('');
        $nameText.val('');
        opt.complete.call(null, text);
    });
    return {upForm:upForm,iframe:$iframe,upinput:$upInput,updateParams:updateParams}

};
