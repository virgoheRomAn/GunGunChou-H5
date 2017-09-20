var FB = window.Global = window.Global || {
        isBodyHide: false,    //是否限制HTML,BODY
        verifyExp: {
            telephone: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
            telCode: /^[0-9]{6}$/,
            strengthA: {
                number: /^[0-9]+$/,
                letterCaps: /^[A-Z]+$/,
                letterLows: /^[a-z]+$/,
                symbol: /^\W+$/
            },
            strengthB: {
                numLetterA: /^(([0-9]+[a-z]+)|([a-z]+[0-9]+))[0-9a-z]*$/,
                numLetterB: /^(([0-9]+[A-Z]+)|([A-Z]+[0-9]+))[0-9A-Z]*$/,
                numSymbol: /^((\W+[0-9]+)|([0-9]+\W+))[\W0-9]*$/,
                LetterALetterB: /^(([A-Z]+[a-z]+)|([a-z]+[A-Z]+))[A-Za-z]*$/,
                LetterASymbol: /^((\W+[a-z]+)|([a-z]+\W+))[\Wa-z]*$/,
                LetterBSymbol: /^((\W+[A-Z]+)|([A-Z]+\W+))[\WA-Z]*$/
            }
        }
    };
//屏蔽部分默认事件
(function () {
    var touchtime = new Date().getTime();
    document.addEventListener("click", function (e) {
        if (new Date().getTime() - touchtime < 800) {
            FB.preventFun(e)
        } else {
            touchtime = new Date().getTime();
        }
    }, false);
    document.addEventListener("touchmove", function (e) {
        if (e.touches.length >= 2) {
            FB.preventFun(e);
        }
    }, false);
}());
FB.preventFun = function (e) {
    e.preventDefault();
};
//判断body是否滚动
(function (ele) {
    if (!$(ele).hasClass("fb-overflow-hide")) {
        if ($(document.body).hasClass("isHide")) {
            $(ele).addClass("fb-overflow-hide").removeClass("isHide");
            FB.isBodyHide = true;
        } else {
            FB.isBodyHide = false;
        }
    } else {
        FB.isBodyHide = true;
    }
}("html,body"));
/**
 * 显示滑动动画
 * @param dom   触发元素
 * @param tag   显示元素
 */
FB.animateTransform = {
    show: function (dom, tag, callback) {
        $(document).on("click", dom, function () {
            $(tag).addClass("active");
            if (callback) callback.call(tag);
        });
    },
    hide: function (dom, tag, callback) {
        $(document).on("click", dom, function () {
            $(tag).removeClass("active");
            if (callback) callback.call(tag);
        });
    }
};
/**
 * 调用Swiper
 * @param ele   元素
 * @param type  类型，1：轮播，2：横向滑动，3：竖直滑动
 * @param option 自定义参数
 */
FB.newSwiper = function (ele, type, option) {
    var opt = "";
    if (type == 1) {
        opt = {
            autoplay: 4000,
            pagination: ".swiper-pagination",
            loop: true,
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 2) {
        opt = {
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    } else if (type == 3) {
        opt = {
            direction: 'vertical',
            freeMode: true,
            slidesPerView: "auto",
            lazyLoading: true,
            watchSlidesVisibility: true
        }
    } else if (type == 4) {
        opt = {
            pagination: ".swiper-pagination",
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    } else if (type == 5) {
        opt = {
            autoplayDisableOnInteraction: false,
            lazyLoading: true
        }
    }
    var newOpt = $.extend({}, opt, option);
    return new Swiper(ele, newOpt);
};
/**
 * 数字加减法
 * @param tag
 * @param maxNum
 * @param minNum
 * @param type   add加法   cut减法
 * @param callback
 */
FB.numberCalculate = function (tag, maxNum, minNum, type, callback) {
    var _num = parseInt(tag.find("input").val());
    var _max = maxNum;
    if (type == "add") {
        if (tag.find("input").val() == "") {
            tag.find("input").val(minNum);
        } else {
            _num++;
            if (_num == (_max + 1)) {
                tag.find("input").val(_max);
            } else {
                tag.find("input").val(_num);
                if (callback)  callback.call(tag[0], _num, _max);
            }
        }
    } else if (type == "cut") {
        if (tag.find("input").val() == "") {
            tag.find("input").val(minNum);
        } else {
            _num--;
            if (_num == 0) {
                tag.find("input").val(minNum);
            } else {
                tag.find("input").val(_num);
                if (callback)  callback.call(tag[0], _num);
            }
        }
    }
};
/**
 * 倒计时(包含天)
 * @param tags   目标
 * @param time
 * @param Fun
 */
FB.dayTimeDown = function (tags, time, Fun) {
    var boxEle, dayEle, hourEle, minEle, secEle;
    if ((typeof tags) == "string" || $(tags).data("time")) {
        boxEle = $(tags);
        dayEle = ".ft-time-day";
        hourEle = ".ft-time-hour";
        minEle = ".ft-time-minute";
        secEle = ".ft-time-second";
    } else {
        boxEle = $(tags.boxEle);
        dayEle = tags.dayEle;
        hourEle = tags.hourEle;
        minEle = tags.minEle;
        secEle = tags.secEle;
    }

    var dayFormat = (dayEle ? (boxEle.find(dayEle).data("format") ? boxEle.find(dayEle).data("format") : "") : "");
    var hourFormat = (hourEle ? (boxEle.find(hourEle).data("format") ? boxEle.find(hourEle).data("format") : "") : "");
    var minFormat = (minEle ? (boxEle.find(minEle).data("format") ? boxEle.find(minEle).data("format") : "") : "");
    var secFormat = (secEle ? (boxEle.find(secEle).data("format") ? boxEle.find(secEle).data("format") : "") : "");

    var countTime = 0;
    if (time) {
        if ((typeof time) == "number") {
            countTime = time / 1000;
        } else {
            countTime = parseInt((new Date("" + time + "") - new Date()) / 1000);
        }
    } else {
        countTime = parseInt((new Date("" + boxEle.data("time") + "") - new Date()) / 1000);
    }
    var int_day = Math.floor(countTime / 60 / 60 / 24);
    var int_hour = Math.floor(countTime / (60 * 60));
    var int_minute = Math.floor(countTime / 60) - (int_hour * 60);
    var int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
    //初始化
    if (dayEle) boxEle.find(dayEle).html(FB.padZero(int_day, 2) + dayFormat);
    if (hourEle) boxEle.find(hourEle).html(FB.padZero(int_hour % 24, 2) + hourFormat);
    if (minEle) boxEle.find(minEle).html(FB.padZero(int_minute, 2) + minFormat);
    if (secEle) boxEle.find(secEle).html(FB.padZero(int_second, 2) + secFormat);
    var _time;
    _time = setInterval(function () {
        countTime--;
        if (countTime > 0) {
            int_day = Math.floor(countTime / 60 / 60 / 24);
            int_hour = Math.floor(countTime / (60 * 60));
            int_minute = Math.floor(countTime / 60) - (int_hour * 60);
            int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
        } else {
            int_day = 0;
            int_hour = 0;
            int_minute = 0;
            int_second = 0;
            if (Fun) Fun.call(boxEle[0]);
            clearInterval(_time);
        }
        if (dayEle) boxEle.find(dayEle).html(FB.padZero(int_day, 2) + dayFormat);
        if (hourEle) boxEle.find(hourEle).html(FB.padZero(int_hour % 24, 2) + hourFormat);
        if (minEle) boxEle.find(minEle).html(FB.padZero(int_minute, 2) + minFormat);
        if (secEle) boxEle.find(secEle).html(FB.padZero(int_second, 2) + secFormat);
    }, 1000);
    return _time;
};
/**
 * 计算图片大小
 * @param w 获取图片宽度
 * @param h 获取图片的高度
 * @param referW    参考宽度
 * @param referH    参考高度
 * @returns {{w,h}} 返回计算后大小
 */
FB.countImgSize = function (w, h, referW, referH) {
    var _w = referW || $(window).width();
    var _h = referH || $(window).height();
    var __w, __h;
    if (w >= h) {
        __w = _w;
        __h = _w / (w / h);
        if (__h > _h) {
            __h = _h;
            __w = __h * (w / h);
        }
    } else if (w < h) {
        __h = _h;
        __w = _h * (w / h);
        if (__w > _w) {
            __w = _w;
            __h = _w / (w / h);
        }
    }
    return {w: __w, h: __h};
};
/**
 * 设置图片元素的大小
 * @param imgEle
 * @param referW
 * @param referH
 * @param imgW
 * @param imgH
 * @param type
 */
FB.setImageLayout = function (imgEle, referW, referH, imgW, imgH, type) {
    var $img = $(imgEle);
    var ceil_w = Math.ceil(referW);
    var ceil_h = Math.ceil(referH);
    var w = imgW || $img.width();
    var h = imgH || $img.height();
    var width, height, top, left;
    var _type = type || "all";
    if (_type == "width") {
        width = ceil_w;
        height = Math.ceil(ceil_w / w * h);
        top = -Math.floor((height - ceil_h) / 2);
        left = 0;
    } else if (_type == "height") {
        height = ceil_h;
        width = Math.ceil(ceil_h * w / h);
        top = 0;
        left = -Math.floor((width - ceil_w) / 2);
    } else if (_type == "all") {
        var size = FB.countImgSize(w, h, ceil_w, ceil_h);
        width = size.w;
        height = size.h;
        top = -Math.floor((height - ceil_h) / 2);
        left = -Math.floor((width - ceil_w) / 2);
    }
    if (imgEle) {
        $img.css({
            "width": width + "px",
            "height": height + "px",
            "margin-top": top + "px",
            "margin-left": left + "px"
        });
    } else {
        return {
            "width": width + "px",
            "height": height + "px",
            "margin-top": top + "px",
            "margin-left": left + "px"
        }
    }
};
/**
 * 清除文字
 * @param tag   清楚元素
 */
FB.clearText = function (tag) {
    if (tag[0].nodeName.toLowerCase() == "input" || tag[0].nodeName.toLowerCase() == "textarea") {
        $(tag).val("");
    } else {
        $(tag).html("");
    }
};
/**
 * 补零
 * @param num 补零的数字
 * @param n 补零的位数
 * @returns {num}   补零之后的字符
 */
FB.padZero = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
};
//获取当前时间
FB.getNowTime = function (type) {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    var h = myDate.getHours();
    var m = myDate.getMinutes();
    var s = myDate.getSeconds();

    switch (type) {
        case "timeAll":
            return FB.padZero(h, 2) + ':' + FB.padZero(m, 2) + ":" + FB.padZero(s, 2);
            break;
        case "date":
            return year + '-' + FB.padZero(month, 2) + "-" + FB.padZero(date, 2);
            break;
        case "timeSimple":
            return FB.padZero(h, 2) + ':' + FB.padZero(m, 2);
            break;
        default:
            return year + '-' + common.padZero(month, 2) + "-" + common.padZero(date, 2) + " " + common.padZero(h, 2) + ':' + common.padZero(m, 2) + ":" + common.padZero(s, 2);
            break;
    }
};
/**
 *  显示倒计时
 * @param dom   显示文字的元素
 * @param time   倒计时时间
 * @param finishFun   结束回调
 * @param countFun   倒计时回调
 */
var _timer_ = 0;
FB.countDown = function (dom, time, finishFun, countFun) {
    clearInterval(_timer_);
    var that = this;
    var _times = (time == "" || time == null || time == undefined) ? 120 : time;
    var $this = $(dom);
    if (!$this.hasClass("show-time")) {
        if ($this.parents("#codeTextNum").length > 0) {
            $this.text(FB.padZero(_times, 2));
        } else {
            $this.text(FB.padZero(_times, 2) + "秒后重发").addClass("active");
        }
    } else {
        $this.text(FB.padZero(_times, 2));
    }
    _timer_ = setInterval(function () {
        if (countFun) countFun.call(dom, _times);
        _times--;
        if (_times == 0) {
            if (!$this.hasClass("show-time")) {
                $this.text("获取验证码").removeClass("active");
            }
            clearInterval(_timer_);
            finishFun && finishFun.call($this);
        } else {
            if (!$this.hasClass("show-time")) {
                if ($this.parents("#codeTextNum").length > 0) {
                    $this.text(FB.padZero(_times, 2));
                } else {
                    $this.text(FB.padZero(_times, 2) + "秒后重发");
                }
            } else {
                $this.text(FB.padZero(_times, 2));
            }
        }
    }, 1000);

    that.stopTimeFun = function () {
        clearInterval(_timer_);
        $this.text("获取验证码").removeClass("active");
        finishFun & finishFun.call($this);
    }
};
/**
 * 图片加载
 * @param imgElement    图片元素
 * @param checkForComplete  是否需要加载
 * @param src   路径
 * @param callback
 */
FB.loadImages = function (imgElement, checkForComplete, src, callback) {
    var image;
    //回调函数
    function onReady() {
        if (callback) callback();
    }

    //图片加载没完成
    if (!imgElement.complete || !checkForComplete) {
        if (src) {
            image = new window.Image();
            image.onload = function () {
                console.log("图片加载成功！");
                var realWidth = image.width;
                var realHeight = image.height;
                if (callback) callback.call(image, realWidth, realHeight);
            };
            image.onerror = function () {
                console.log("图片加载失败，路径：" + image.src);
                if (callback) callback();
            };
            if (src) {
                image.src = src;
            }
        } else {
            onReady();
        }
    } else {
        onReady();
    }
};
/**
 * 获取页面URL中的参数
 * @param name
 * @returns {null}
 */
FB.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
/**
 * 验证form表单
 * @param val   输入验证的值
 */
FB.testForm = {
    phone: function (val) {
        var _phone = "";
        var _val = val;
        if (_val.length != 0) {
            if (_val.length == 11) {
                _phone = !!eval(FB.verifyExp.telephone).test(_val);
            } else if (_val.length > 0) {
                _phone = false;
            }
        } else {
            _phone = false;
        }
        return _phone;
    },
    password: function (val) {
        var _password = 0;
        var _val = val;
        if (_val.length >= 6) {
            if (eval(FB.verifyExp.strengthA.number).test(_val) ||
                eval(FB.verifyExp.strengthA.letterCaps).test(_val) ||
                eval(FB.verifyExp.strengthA.letterLows).test(_val) ||
                eval(FB.verifyExp.strengthA.symbol).test(_val)) {
                _password = 1;    //密码正确
            } else {
                _password = 0;    //密码不满足正则
            }
        } else {
            _password = 2;        //密码位数太少
        }
        return _password;
    }
};
