/**
 * 弹出提示框插件
 * 提供{关闭函数$.jClose，简单提示$.jAlert，按钮提示$.jConfirm}
 * 修改$.jAert=>$.jAlert.tips
 * 新增$.jAlert.loading，$.jAlert.error，$.jAlert.success，$.jAlert.waring
 * v2.0
 * 修改日期2017-05-04
 * xjq
 */
;
(function ($) {
    var _IMG_ = {};
    var _default_location = "img/jBox/";
    var _default_images = [{
        src: "jAlert.png",
        id: "alert"
    }, {
        src: "jError.png",
        id: "error"
    }, {
        src: "jSuccess.png",
        id: "success"
    }, {
        src: "jLoading.gif",
        id: "load"
    }];
    //清除定时
    var _timer_ = 0;
    clearTimeout(_timer_);

    /**
     * 重新设置元素的模块
     * @param ele
     * @param w
     * @param h
     * @returns {boolean}
     * @private
     */
    function _setBoxLayout(ele, w, h) {
        if (!ele) return false;
        $(ele).css({
            "width": w + "px",
            "height": h + "px",
            "marginTop": -h / 2 + "px",
            "marginLeft": -w / 2 + "px"
        });
    }

    /**
     * 加载图片
     * @param src
     * @param LoadedCallback
     * @param ErrorCallback
     * @private
     */
    function _loadImages(src, LoadedCallback, ErrorCallback) {
        var realWidth, realHeight;
        var image = new Image();
        if (src) {
            image.src = src;
        }
        image.onload = function () {
            realWidth = image.width;
            realHeight = image.height;
            image.width = 30;
            image.height = 30;
            if (LoadedCallback) LoadedCallback.call(image, image.src, realWidth, realHeight);
        };

        image.onerror = function () {
            if (ErrorCallback) ErrorCallback.call(image);
        };
        return image;
    }

    /**
     * 加载图片执行函数
     * @param images  3种模式 数组-单一字符，数组-对象包含id,src,loction,loaded,error，单一字符
     * @param id
     * @param path
     * @param loadedFun
     * @param errorFun
     * @returns {*}
     * @private
     */
    function _loadIMG_(images, id, path, loadedFun, errorFun) {
        var img, ID, location, loaded, error;
        if (Object.prototype.toString.call(images) == '[object Array]') {
            for (var i = 0; i < images.length; i++) {
                if ((typeof images[i]).toString().toLowerCase() == "string") {
                    ID = id ? id[i] : "";
                    location = path ? (typeof path).toString().toLowerCase() == "string" ? path :
                        path[i] ? path[i] : _default_location :
                        _default_location;
                    loaded = loadedFun ? loadedFun[i] : "";
                    error = errorFun ? errorFun[i] : "";
                    img = _loadImages(location + images[i], loaded, error);
                    _IMG_[ID] = {img: location + images[i], src: img.src, successBack: loaded, errorBack: error};
                } else {
                    ID = images[i].id ? images[i].id : "";
                    location = images[i].location ? images[i].location : _default_location;
                    loaded = images[i].loaded ? images[i].loaded : "";
                    error = images[i].error ? images[i].error : "";
                    img = _loadImages(location + images[i].src, loaded, error);
                    _IMG_[ID] = {img: location + images[i].src, src: img.src, successBack: loaded, errorBack: error};
                }
            }
        } else {
            ID = id ? id : "";
            location = path ? path : _default_location;
            img = _loadImages(location + images, loadedFun, errorFun);
            _IMG_[ID] = {img: location + images, src: img.src, successBack: loadedFun, errorBack: errorFun};

        }
        return images;
    }

    //初始化加载默认图标
    _IMG_._imgsAry = _loadIMG_(_default_images);

    $.extend({
        jAlert: {
            /**
             * 预先加载默认小图标
             * @param images  图片组[{id:"",src:"",location:"",loaded:function(){},error:function(){}}]
             */
            loadImage: function (images) {
                if (images) {
                    var imgs = _loadIMG_(images);
                    for (var i = 0; i < imgs.length; i++) {
                        if (imgs[i].id != "alert" && imgs[i].id != "error" && imgs[i].id != "success" && imgs[i].id != "load") {
                            _IMG_._imgsAry.push(imgs[i]);
                        }
                    }
                }
            },
            /**
             * 通过ID获取图片
             * @param id
             * @returns {*}
             */
            getImage: function (id) {
                if (!id) return false;
                var image = _IMG_[id];
                if (!image) return false;
                return image;
            },
            /**
             * 初始化弹窗
             * @param text
             * @param icon
             * @param obj
             */
            init: function (text, icon, obj) {
                var opts = {};
                var w = opts.w = obj ? obj.width ? parseInt(obj.width) : 150 : 150;
                var h = opts.h = obj ? obj.height ? parseInt(obj.height) : 50 : 50;
                var ani = opts.ani = obj ? obj.animate ? obj.animate : "j-alert-ani" : "j-alert-ani";
                var iconType = opts.iconType = obj ? obj.iconType ? obj.iconType : "H" : "H";
                var isFull = opts.isFull = obj ? obj.isFull ? obj.isFull : false : false;
                var iconCSS = opts.iconCSS = obj ? obj.iconCSS ? obj.iconCSS : "" : "";
                var textCSS = opts.textCSS = obj ? obj.textCSS ? obj.textCSS : "" : "";
                //判断是否全屏
                var fullCls = isFull ? "j-alert-full" : "";
                //判断是否含有小图标
                var iconHTML = "", iconCls = "", iconTypeCls = "";
                if (icon) {
                    iconCls = "j-alert-hasIcon";
                    iconTypeCls = (iconType.toLowerCase() == "h") ? "j-alert-iconH" : "j-alert-iconV";
                    iconHTML = '<label class="j-alert-icon"><img width="30px" height="30px" src="' + icon + '"></label>';
                } else {
                    iconCls = "j-alert-noneIcon";
                    iconTypeCls = "";
                }
                var html = '\
                    <div id="jDisk" class="j-alert-box">\
                        <div class="j-alert ' + ani + ' animated ' + fullCls + '">\
                            <div class="j-alert-cont ' + iconCls + " " + iconTypeCls + '">\
                                <div class="j-alert-intro">\
                                    ' + iconHTML + '\
                                    <span class="j-alert-text">' + text + '</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    ';
                $(document.body).append(html);

                //变量
                var $box = $(".j-alert-box"),
                    $cont = $(".j-alert-cont"),
                    $intro = $(".j-alert-intro"),
                    $icon = $(".j-alert-icon"),
                    $text = $(".j-alert-text");

                //添加样式
                if (obj && obj.className) {
                    $cont.addClass(obj.className);
                }

                $icon.css(iconCSS);
                $text.css(textCSS);
                //重新计算
                if (!isFull) {
                    var $countEle = $cont;
                    $countEle.css("padding", "0");
                    var _newHeight = $countEle.outerHeight(true);
                    var _newWidth = $countEle.outerWidth(true);
                    if (obj) {
                        if (!obj.width && obj.height) {
                            w = _newWidth >= 200 ? 200 : _newWidth;
                        } else if (!obj.height && obj.width) {
                            h = $countEle.css("width", w).outerHeight(true);
                            $countEle.removeAttr("style");
                        } else if (obj.width && obj.height) {
                            $countEle.css("padding", "0 15px");
                        } else if (!obj.width && !obj.height) {
                            w = _newWidth >= 200 ? 200 : _newWidth + 30;
                            h = _newHeight + 30;
                            $countEle.css("padding", "15px");
                        }
                    } else {
                        w = _newWidth >= 200 ? 200 : _newWidth + 30;
                        h = _newHeight + 30;
                        $countEle.css("padding", "15px");
                    }
                    _setBoxLayout("#jDisk .j-alert", w, h);
                } else {
                    var $body = $("html,body");
                    if (!$body.hasClass("isHide")) {
                        $body.addClass("isHide");
                    }
                    var $fullEle = $intro;
                    $fullEle.parents(".j-alert-cont").css("width", "auto");
                    var fullWidth = $fullEle.css("width", "auto").outerWidth(true);
                    fullWidth = fullWidth >= 200 ? 200 : fullWidth;
                    var fullHeight = $fullEle.css("width", fullWidth).outerHeight(true);
                    $fullEle.removeAttr("style");
                    $fullEle.parents(".j-alert-cont").removeAttr("style");
                    if (iconCSS.height && parseInt(iconCSS.height) != 30) {
                        $icon.css("margin-top", "-" + parseInt(iconCSS.height) / 2 + "px");
                    }
                    if (iconCSS.width && parseInt(iconCSS.width) != 30) {
                        $fullEle.css("padding-left", "" + (parseInt(iconCSS.width) + 5) + "px");
                        fullWidth += parseInt(iconCSS.width) - 30 + 5;
                    }
                    _setBoxLayout("#jDisk .j-alert-intro", fullWidth, fullHeight);
                }
                if (obj && obj.showCallBack) obj.showCallBack.call($box[0], obj);
                //关闭
                $.jClose({
                    ele: obj ? obj.ele ? obj.ele : $box : $box,
                    time: obj ? obj.time ? parseInt(obj.time) : 1000 : 1000,
                    type: obj ? obj.type ? parseInt(obj.type) : 1 : 1,
                    callback: obj ? obj.callback ? obj.callback : null : null
                });

                return $box;
            },
            tips: function (text, obj) {
                $.jAlert.init(text, "", obj);
            },
            success: function (text, icon, obj) {
                $.jAlert.init(text, icon ? icon : _IMG_["success"].src, obj);
            },
            error: function (text, icon, obj) {
                $.jAlert.init(text, icon ? icon : _IMG_["error"].src, obj);
            },
            waring: function (text, icon, obj) {
                $.jAlert.init(text, icon ? icon : _IMG_["alert"].src, obj);
            },
            loading: function (text, icon, obj) {
                var new_obj = $.extend({}, obj, {type: 3});
                return $.jAlert.init(text, icon ? icon : _IMG_["load"].src, new_obj);
            }
        },
        /**
         * 确认框
         * 回调函数支持两种，默认寻找btnAry.callback，其次寻找callbacks
         * @param textObj  提示信息 {title,intro}或者"intro"
         * @param btnAry    按钮组 [{id,text,src,callback,css}]
         * @param btnType   按钮类型  V/H
         * @param callbacks 回掉函数组
         * @param css  样式
         * css格式说明：
         * css:{
         *        width:"",
         *        height:"",
         *        animate:"",
         *       titleCss:{},
          *     tipsBarCss:{},
          *     tipsCss:{},
          *     btnCss:[{},{},{}.....{}]
         * }
         */
        jConfirm: function (textObj, btnAry, btnType, callbacks, css) {
            var _w = !css ? 210 : !css.width ? 210 : parseInt(css.width);
            var _h = !css ? 70 : !css.height ? 70 : parseInt(css.height);
            var _a = !css ? "j-alert-ani" : !css.animate ? "j-alert-ani" : css.animate;
            var _type = !btnType ? "H" : btnType;
            var intro = (typeof textObj).toString().toLowerCase() == "string" ? textObj : textObj.intro;
            var title = textObj ? textObj.title : "";
            var intro_cls = textObj.title ? "j-intro-normal" : "j-intro-big";
            var _html = "", btnStr = "", titleStr = "";

            //判断按钮形式
            var btn_cls = _type.toString().toLowerCase() == "v" ? "j-confirm-v" : "j-confirm-h";
            btnStr += '<div class="j-confirm-btn ' + btn_cls + '">';
            for (var i = 0; i < btnAry.length; i++) {
                var src = !btnAry[i].src ? "javascript:;" : btnAry[i].src;
                var bnt_id = !btnAry[i].id ? "" : btnAry[i].id;
                btnStr += '<a id="' + bnt_id + '" class="j-btn" href="' + src + '">' + btnAry[i].text + '</a>';
            }
            btnStr += '</div>';

            //判断是否含有标题
            var title_cls = "";
            var closeStr = textObj.close ? "<a class='j-close' href='javascript:;'>&times</a>" : "";
            if (textObj.title) {
                title_cls = "j-confirm-hasTitle";
                titleStr += '<label class="j-confirm-title"><span>' + title + '</span>' + closeStr + '</label>';
            } else {
                title_cls = "j-confirm-noTitle";
                titleStr = closeStr;
            }

            _html += '<div id="jDisk" class="j-confirm-box">';
            _html += '<div class="j-confirm ' + _a + ' animated" style="height: ' + _h + 'px; width: ' + _w + 'px; margin: -' + _h / 2 + 'px 0 0 -' + _w / 2 + 'px;">';

            _html += titleStr;
            _html += '<div class="j-confirm-text ' + title_cls + '">';
            _html += '<div class="' + intro_cls + '">' + intro + '</div>';
            _html += '</div>';
            _html += btnStr;
            _html += '</div>';
            _html += '</div>';
            $(document.body).append(_html);

            //添加样式
            var $box = $(".j-confirm-box");
            var textBar = $(".j-confirm-text"), btnBar = $(".j-confirm-btn"), titleBar = $(".j-confirm-title"),
                btnBox = $(".j-btn");
            //按钮加样式-首先读取按钮组中设置的样式，
            //其次读取css中btnCss数组
            btnBox.each(function (i) {
                //如果btnAry中包含cls样式名称，添加样式名称cls
                if (btnAry[i].cls) {
                    $(this).addClass(btnAry[i].cls);
                } else {
                    //没有cls样式名称，添加css样式
                    if (btnAry[i].css) {
                        $(this).css(btnAry[i].css);
                    } else {
                        if (css) {
                            if (css.btnCss) $(this).css(css.btnCss[i]);
                        }
                    }
                }
            });
            if (css) {
                //默认先读取样式名称css.cls对象
                //名有设置样式名称读取设置的样式文件
                if (css.cls) {
                    if (css.cls.boxCls) $(".j-confirm").addClass(css.cls.boxCls);
                    if (css.cls.titleCls) titleBar.addClass(css.cls.titleCls);
                    if (css.cls.tipsBarCls) textBar.addClass(css.cls.tipsBarCls);
                    if (css.cls.tipsCls) textBar.find("div").addClass(css.cls.tipsCls);
                } else {
                    if (css.titleCss) titleBar.css(css.titleCss);
                    if (css.tipsBarCss) textBar.css(css.tipsBarCss);
                    if (css.tipsCss) textBar.find("div").css(css.tipsCss);
                }
            }

            //重新计算
            var padHeight = (!titleBar || titleBar.length == 0) ? 30 : 15;
            var _tipsHeight = textBar.find("span").outerHeight(true);
            var _textHeight = css ? (css.height ? parseInt(css.height) : _tipsHeight) : _tipsHeight;
            var __h = css ? (css.height ? parseInt(css.height) + padHeight : textBar.outerHeight(true)) : textBar.outerHeight(true);
            var _newHeight = btnBar.outerHeight(true);
            textBar.height(_textHeight);
            _setBoxLayout("#jDisk .j-confirm", _w, __h + _newHeight + ((!titleBar || titleBar.length == 0) ? 0 : titleBar.outerHeight(true)));

            //绑定函数
            $(document).on("click", ".j-close", function () {
                $.jClose({
                    type: 2,
                    time: 300
                });
            });

            btnBar.find("a.j-btn").each(function (i) {
                if (btnAry[i].callback) {
                    $(this).click(function () {
                        $.jClose({
                            ele: $box,
                            type: btnAry[i].type || 2,
                            time: 300,
                            callback: btnAry[i].callback
                        });
                    });
                } else if (callbacks && Object.prototype.toString.call(callbacks) == '[object Array]') {
                    $(this).click(function () {
                        $.jClose({
                            ele: $(".j-confirm-box"),
                            type: 2,
                            time: 300,
                            callback: callbacks[i].call(this)
                        });
                    });
                } else {
                    $(this).click(function () {
                        $.jClose({
                            ele: $(".j-confirm-box"),
                            type: 2,
                            time: 300,
                            callback: function () {
                                console.log("没有回调函数")
                            }
                        });
                    });
                }
            });
        },
        /**
         * 关闭弹窗
         * @param opt {type,time,callback}
         * @returns {boolean}
         */
        jClose: function (opt) {
            var $box = $("#jDisk");
            var _time = opt ? (!opt.time ? 1000 : opt.time) : 1000;
            var _type = opt ? (!opt.type ? 1 : opt.type) : 1;
            var _callback = opt ? (!opt.callback ? null : opt.callback) : null;
            var ele = opt ? opt.ele ? opt.ele : $box : $box;
            var $body = $("html,body");
            if (!ele || ele.length == 0) {
                console.error("找不到元素：'jDisk'");
                return false;
            }
            switch (_type) {
                case 1:
                    clearTimeout(_timer_);
                    _timer_ = setTimeout(function () {
                        if ($body.hasClass("isHide")) {
                            $body.removeClass("isHide");
                        }
                        ele.fadeOut(function () {
                            $(this).remove();
                            if (_callback) _callback.call(ele[0]);
                        });
                    }, _time);
                    break;
                case 2:
                    if ($body.hasClass("isHide")) {
                        $body.removeClass("isHide");
                    }
                    ele.fadeOut(300, function () {
                        $(this).remove();
                        if (_callback) _callback.call(ele[0]);
                    });
                    break;
                case 3:
                    if (_callback) _callback.call(ele[0]);
                    break;
            }
        }
    });

    //添加样式到页面
    (function _setBoxCss() {
        var str = "\
            .isHide{position: relative;  display: block;  width: 100%; height: 100%; overflow: hidden;}\
            .j-alert-box{position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10000;}\
            .j-alert{display: block; position: absolute; top: 50%; left: 50%; z-index: 1000; background: rgba(0,0,0,0.8); text-align: center; border-radius: 3px;}\
            .j-alert.j-alert-full{width: 100%; height: 100%; top: 0; left: 0;}\
            .j-alert-cont{position: relative;display: table; width: 100%; height: 100%; padding: 15px;}\
            .j-alert-intro{position: relative; display: table-cell; width: 100%; vertical-align: middle;}\
            .j-alert-icon{display: block; width: 24px; height: 24px;}\
            .j-alert-icon img{display: block; width: 100%; height: 100%;}\
            .j-alert-text{display: block; width: 100%; line-height: 24px; font-size: 14px; color: #ffffff; text-align: center; white-space: nowrap;}\
            .j-alert-hasIcon.j-alert-iconH .j-alert-icon{position: absolute; top:50%; left:0; margin-top: -12px; }\
            .j-alert-hasIcon.j-alert-iconH .j-alert-intro{padding-left: 30px;}\
            .j-alert-hasIcon.j-alert-iconH .j-alert-text{text-align: left;}\
            .j-alert-hasIcon.j-alert-iconV .j-alert-icon{margin: 0 auto 5px;}\
            .j-alert.j-alert-full .j-alert-intro{position: absolute; top: 50%; left: 50%; display: table;}\
             .j-alert.j-alert-full .j-alert-iconH .j-alert-intro .j-alert-text{display: table-cell; vertical-align: middle;}\
            .j-confirm-box{position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 10000; background: rgba(0,0,0,0.5);}\
            .j-confirm{position: absolute;  top: 50%; left: 50%; z-index: 1000; background: #FFF; text-align: center; border-radius: 5px; box-shadow: 2px 2px 8px rgba(68, 64, 64, 0.3)}\
            .j-confirm-text{display: table; margin: 0; padding: 15px; width: 100%;}\
            .j-confirm-text.j-confirm-hasTitle{padding-top: 0;}\
            .j-confirm-title{position: relative; display: block; width: 100%; margin: 15px 0 5px 0; padding: 0; font-weight: bold; font-size: 14px; text-align: center; color: #3c3c3c;}\
            .j-confirm-title.j-text-hide span{visibility:hidden}\
            .j-close{position: absolute; top: 50%; right: 7px; display: block; width: 30px; height: 30px; line-height: 30px; text-align: center; font-size: 26px; color: #999999; margin-top: -15px; font-weight: normal; font-family:\"宋体\", arial, helvetica, sans-serif}\
            .j-confirm-text >div{display: table-cell; width: 100%; font-weight: normal; vertical-align: middle; font-size: 12px; color: #3c3c3c;}\
            .j-confirm-text >div.j-intro-big{font-weight: bold; font-size: 14px;}\
            .j-confirm-btn{width: 100%; overflow: hidden;}\
            .j-confirm-btn.j-confirm-h{border-top: 1px solid #dcdcdc;}\
            .j-confirm-v .j-btn{display: block; width: 100%; height: 38px; line-height: 38px; font-size: 14px; color: #f56423; text-align: center; border-top: 1px solid #dcdcdc;}\
            .j-confirm-h .j-btn{display: block; width: 50%; float: left; height: 38px; line-height: 38px; font-size: 14px; color: #f56423; text-align: center; border-right: 1px solid #dcdcdc;}\
            .j-confirm-h .j-btn:last-child{border-right: 0 none;}\
            ";
        var style = document.createElement("style");
        style.type = "text/css";
        if (style.styleSheet) {
            style.styleSheet.cssText = str;
        } else {
            style.innerHTML = str;
        }
        document.getElementsByTagName("head")[0].appendChild(style);
    })();
})(jQuery);
