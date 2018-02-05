//数字滑块
$(function() {
    $("input[name='priece']").picker({
        title: "请选择借款金额",
        toolbarCloseText: '确定',
        cols: [{
            textAlign: 'center',
            values: ['1000元', '2000元', '3000元', '4000元', '5000元'],
            displayValues: ['1000元', '2000元', '3000元', '4000元', '5000元'],
        }]
    });

    $("input[name='sesame_branch']").picker({
        title: "请选择支付宝芝麻分",
        toolbarCloseText: '确定',
        cols: [{
            textAlign: 'center',
            values: ['500~599', '600~649', '650~699', '700~749', '750以上'],
            displayValues: ['500~599', '600~649', '650~699', '700~749', '750以上'],
        }]
    });

    //地址栏
    $("#home-city").cityPicker({
        title: "请选择您的地址"
    });
});

//上传图片
$(function() {
    //多图上传
    $("#idsUrls").change(function(e) {
        idsUrls = getElementByName('idsUrls').val();
        $ids = idsUrls.split(",");
        if ($ids.length >= 3) {
            $.toast("超过上传限制", "cancel");
            return false;
        };
        var files = e.target.files;
        var len = files.length;
        for (var i = 0; i < len; i++) {
            // statements
            lrz(files[i], {
                width: 640,
                fieldName: "file"
            }).then(function(file) {
                $("#submit-loan").addClass('weui_btn_disabled');
                file['action'] = 'upload_ids';
                $data = JSON.parse(JSON.stringify(file));
                $.ajax({
                    type: 'POST',
                    url: MODEST.ajaxurl,
                    data: $data,
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                        xhr.addEventListener('progress', function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                update(percentComplete + '%');
                            }
                        }, false);
                        return xhr;
                    },
                    success: function(res) {
                        if (res.success) {
                            $idsUrls = getElementByName('idsUrls').val();
                            if ($idsUrls != "") {
                                $idsUrls = $idsUrls + "," + res.data;
                            } else {
                                $idsUrls = res.data;
                            }
                            getElementByName('idsUrls').val($idsUrls);
                            $("#submit-loan").removeClass('weui_btn_disabled');
                        };

                    },
                    error: function(err) {
                        $.toast("提交申请失败", "cancel");
                    }
                });
            }).catch(function(err) {
                alert(err);
            }).always(function() { // 不管是成功失败，这里都会执行
            });
        } //for end
    });
})


$(function() {
    $("#submit-loan").click(function(event) {
        //验证表单
        if (validateForm()) {
            $data = $("#publishForm").serialize();
            $.showLoading("正在提交申请...")
            $.ajax({
                url: MODEST.ajaxurl,
                data: $data,
                type: 'POST',
                error: function(request) {
                    $.hideLoading();
                    $.toast("提交申请失败", "forbidden");
                },
                success: function(data) {
                    $.hideLoading();
                    $(".weui_page1").hide();
                    $(".weui_msg").show();
                }
            });
        };
    });
});


//预览图像
function previewImage(file) {
    idsUrls = getElementByName('idsUrls').val();
    $ids = idsUrls.split(",");
    if ($ids.length >= 3) {
        return false;
    };
    var MAXWIDTH = 100;
    var MAXHEIGHT = 200;
    for (var i = 0; i < file.files.length; i++) {
        if (file.files && file.files[i]) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                $('#img2x').append('<li class="weui_uploader_file" style="background-image:url(' + evt.target.result + ')"></li>');
            };
            reader.readAsDataURL(file.files[i]);
        }
    }
}

//验证表单
function validateForm() {
    validate.clearError();
    user_name = getElementByName('user_name');
    if (!validate.isChinaName(user_name.val())) {
        validate.setError(user_name);
        return false;
    };

    cell_phone = getElementByName('cell_phone');
    if (!validate.isPhoneNo(cell_phone.val())) {
        validate.setError(cell_phone);
        return false;
    };

    wechat = getElementByName('wechat');
    if (!validate.isEmpty(wechat.val())) {
        validate.setError(wechat);
        return false;
    };

    qq = getElementByName('qq');
    if (!validate.isEmpty(qq.val())) {
        validate.setError(qq);
        return false;
    };

    address = getElementByName('address');
    if (!validate.isEmpty(address.val())) {
        validate.setError(address);
        return false;
    };

    sesame_branch = getElementByName('sesame_branch');
    if (!validate.isEmpty(sesame_branch.val())) {
        validate.setError(sesame_branch);
        return false;
    };

    flowers = getElementByName('flowers');
    if (!validate.isEmpty(flowers.val())) {
        validate.setError(flowers);
        return false;
    };






    return true;

}


//通过Name获取元素的值
function getElementByName(name) {
    return $("input[name='" + name + "']");
}

//验证
var validate = {
    // 验证中文名称
    isChinaName: function(name) {
        var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
        return pattern.test(name);
    },
    isPhoneNo: function(phone) {
        var pattern = /^1[34578]\d{9}$/;
        return pattern.test(phone);
    },
    isEmpty: function(str) {
        return str == "" ? false : true;
    },
    isNumber: function(str) {
        return !isNaN(str);
    },
    setError: function(obj) {
        weuiCell = $(obj).parents(".weui_cell");
        weuiCell.addClass('weui_cell_warn');
    },
    clearError: function() {
        $(".weui_cell").removeClass('weui_cell_warn');
    }
}


