//倒计时引用
(function cutDown(ele) {
    $(ele).each(function () {
        FB.dayTimeDown(this);
    });
}(".time-down"));

//窗口改变
function resizeInit(callback) {
    $(window).resize(function () {
        var width = $(this).width();
        var height = $(this).height();
        if (callback) callback.call(this, width, height);
    }).trigger("resize");
}

//设置滚动条
function setProgress(ele, start, end) {
    $(ele).each(function () {
        var that = this;
        FB.progressBox({
            element: {
                container: $(that).find(".fb-progress"),
                text: $(that).find(".meter"),
                runner: $(that).find(".runner")
            },
            number: $(that).find(".meter").text().split("%")[0],
            time: 1000,
            textMove: true,
            startFun: function (opt) {
                if (start) start.call(this, opt);
            },
            endFun: function (opt) {
                if (end) end.call(this, opt);
            }
        });
    });
}

//页面滚动
function pageScroll(opt) {
    var defaults = {
        element: window,
        top: "#goTop",
        hasTop: true,
        scrollFun: null,
        ajaxFun: null,
        topFun: null
    };
    var opts = $.extend({}, defaults, opt);
    var $top = $(opts.top), $ele = $(opts.element);
    var _isTop = false;
    var isWindow = opts.element == window;
    var beforeScrollTop = $ele.scrollTop();
    $ele.scroll(function () {
        var pageHeight = isWindow ? $(document).height() : $(this).find(".overflow-box").eq(0).height();
        var windowHeight = $(this).height();
        var afterScrollTop = $(this).scrollTop();
        var delta = afterScrollTop - beforeScrollTop;
        var _dir_ = (delta > 0 ? "down" : "up");
        if (opts.hasTop) {
            afterScrollTop > 100 ? $top.fadeIn() : $top.fadeOut();
        }

        if (opts.scrollFun) opts.scrollFun.call(this, afterScrollTop, _dir_, _isTop);

        if ((afterScrollTop + windowHeight) >= pageHeight) {
            if (opts.ajaxFun) opts.ajaxFun.call(this, afterScrollTop, _dir_, _isTop);
        }

        beforeScrollTop = afterScrollTop;
    }).data("scroll", true);

    $top.click(function () {
        _isTop = true;
        var scrollEle = isWindow ? "html,body" : opts.element;
        scrollToEle(scrollEle, 0, function () {
            _isTop = false;
            if (opts.topFun) opts.topFun.call($ele[0], _isTop);
        });
    });

    opts.scrollToElement = function (ele, top, callback) {
        scrollToEle(ele, top, callback);
    };

    return opts;
}

/**
 * 滚动距离
 * @param ele   需要滚动元素 默认：“html，body”
 * @param top   滚动距离
 * @param callback  回调函数
 */
function scrollToEle(ele, top, callback) {
    $(ele).animate({"scrollTop": top + "px"}, 300, function () {
        if (callback) callback.call(this);
    });
}

//产品图片懒加载
function proImgLazyLoad(ele, cont, sucFuns, eroFuns) {
    $(ele).find("img").lazyload({
        placeholder: "img/loading.gif",
        effect: "show",
        threshold: 50,
        container: cont,
        load: function () {
            $(this).addClass("load-success").removeAttr("data-original");
            $(this).parents(ele).find(".pro-img-loading").hide();
            if (sucFuns) sucFuns.call(this, $(this).parents(ele));
        },
        error: function () {
            $(this).addClass("load-error");
            $(this).parents(ele).find(".pro-img-loading").hide();
            if (eroFuns) eroFuns.call(this, $(this).parents(ele));
        }
    });
}

//左侧菜单
function popLeftMenu(option) {
    var self = this;
    var defaults = {
        clickEle: "",
        diskEle: "",
        closeEle: ".fb-disk-close",
        animateEle: "",
        isSwiper: false,
        swiperID: "",
        isShowEle: true,
        isDiskClose: true,
        clickCallback: "",
        openCallback: "",
        closeCallback: ""
    };
    var opt = self.opt = $.extend({}, defaults, option);
    var _timer_ = 0,
        mySwiper,
        $clickEle = $(opt.clickEle),
        $diskEle = $(opt.diskEle),
        $closeEle = $(opt.closeEle),
        $animateEle = $(opt.animateEle);

    self.openFun = function () {
        if (opt.isShowEle) {
            if ($animateEle.hasClass("active")) {
                $diskEle.click();
                return false;
            }
            clearTimeout(_timer_);
            if (!FB.isBodyHide) {
                $("html,body").addClass("overflow-hide");
            }
            $diskEle.fadeIn(300);
            _timer_ = setTimeout(function () {
                $animateEle.addClass("active");
                if (opt.openCallback) opt.openCallback.call(this, opt);
            }, 200);
            if (opt.isSwiper) {
                mySwiper = FB.newSwiper("#menuBox", 3);
            }
        } else {
            if (opt.clickCallback) opt.clickCallback.call(this, opt);
        }
    };

    self.closeFun = function (e) {
        FB.propagationFun(e);
        if (!FB.isBodyHide) {
            $("html,body").removeClass("overflow-hide");
        }
        $animateEle.removeClass("active");
        if (opt.closeCallback) opt.closeCallback.call(this, opt);
        setTimeout($.proxy(function () {
            $(this).fadeOut();
        }, $diskEle), 300);
    };

    $clickEle.on("click", self.openFun);

    if (opt.isDiskClose) $diskEle.on("click", self.closeFun);

    if (opt.closeEle) $closeEle.on("click", self.closeFun);

    $animateEle.click(function (e) {
        FB.propagationFun(e);
    });

    return self;
}

//显示隐藏层
function showPopPlayer(option) {
    var defaults = {
        time: 200,
        popEle: "",
        closeEle: "",
        animateEle: "",
        openCallback: "",
        closeCallback: ""
    };
    var that = this;
    var opt = $.extend({}, defaults, option);
    var $popEle = $(opt.popEle);
    var $animateEle = $(opt.animateEle);
    $popEle.fadeIn(opt.time);
    setTimeout(function () {
        $animateEle.addClass("active");
        if (opt.openCallback) opt.openCallback.call(that, opt);
    }, opt.time);

    $(document).on("click", opt.closeEle, closeFun);

    function closeFun() {
        var that = this;
        $(that).parents(opt.animateEle).removeClass("active");
        if (opt.closeCallback) opt.closeCallback.call(that, opt);
        $(document).off("click", opt.closeEle);
        setTimeout(function () {
            $(that).parents(opt.popEle).fadeOut();
        }, opt.time);
    }
}

//购物车相关操作
function shopCarHandle(option) {
    var self = this;
    var defaults = {
        shopItem: ".shop-item",
        quantity: ".item-quantity",
        selectEle: ".shop-img-box",
        editEle: ".edit-btn",
        inputEle: ".num-input input",
        carBtn: ".ft-cart-btn",
        deleteFun: ""
    };
    var opt = self.opt = $.extend({}, defaults, option);
    self.init = function () {

        //绑定选择
        $(opt.selectEle).click(function () {
            $(this).find(".ft-radio").toggleClass("active");
            self.statistics();
        });

        //绑定编辑
        $(document).on("click", opt.editEle, function () {
            var that = $(this).parents(opt.shopItem);
            var _val = that.find(opt.quantity).text();
            var numStr = "\
                    <div class='shop-num-bar'>\
                        <a class='num-cut' href='javascript:;'><i class='ft-sprite'></i></a>\
                        <label class='num-input' data-max='999' data-min='1'>\
                            <input type='number' value='" + _val + "'>\
                        </label>\
                         <a class='num-add' href='javascript:;'><i class='ft-sprite'></i></a>\
                    </div>\
                   ";
            $.jConfirm({
                title: "Quantity",
                intro: numStr
            }, [
                {
                    text: "Cancel",
                    css: {
                        "color": "#666666",
                        "borderRight": "0 none"
                    }
                },
                {
                    text: "Done",
                    css: {
                        "color": "#ffffff",
                        "backgroundColor": "#f56423"
                    },
                    callback: function () {
                        var _num = $(this).find(opt.inputEle).val();
                        that.find(opt.quantity).text(_num);
                        that.find(".ft-radio").addClass("active");
                        self.statistics();
                    }
                }
            ], "H", "", {
                tipsBarCss: {"paddingBottom": "5px"}
            });
        });

        //输入数量-限制输入
        $(document).on("change keyup", opt.inputEle, function () {
            var tag = $(this).parent();
            var _val = $(this).val();
            if (_val >= Number(tag.data("max"))) {
                $(this).val(Number(tag.data("max")));
            } else if (_val <= Number(tag.data("min"))) {
                $(this).val(Number(tag.data("min")));
            }
        });

        //绑定减数量
        $(document).on("click", "a.num-cut", function () {
            var tag = $(this).nextAll(".num-input");
            FB.numberCalculate(tag, Number(tag.data("max")), Number(tag.data("min")), "cut");
        });

        //绑定加数量
        $(document).on("click", "a.num-add", function () {
            var tag = $(this).prevAll(".num-input");
            FB.numberCalculate(tag, Number(tag.data("max")), Number(tag.data("min")), "add");
        });

        //绑定删除
        $(document).on("click", ".delete-btn", function () {
            var that = $(this).parents(opt.shopItem);
            $.jConfirm({title: "Are you sure?", intro: "Do you want to remove this from your cart?"}, [{
                text: "No"
            }, {
                text: "Yes",
                callback: function () {
                    that.animate({"left": "-100%"}, 300, function () {
                        $(this).remove();
                        self.statistics();
                        if (opt.deleteFun) opt.deleteFun.call(that[0], opt);
                    })
                }
            }]);
        });

        self.statistics();
    };

    self.statistics = function () {
        var shopCount = 0;
        $(opt.shopItem).find(".ft-radio").each(function () {
            var item = $(this).parents(opt.shopItem);
            if ($(this).hasClass("active")) {
                if (!$(this).find("input").prop("checked")) {
                    $(this).find("input").prop("checked", true);
                }
                shopCount += Number(item.find(opt.quantity).text());
            } else {
                if ($(this).find("input").prop("checked")) {
                    $(this).find("input").prop("checked", false);
                }
            }
        });
        $(opt.carBtn).find("i").text(shopCount);
    };

    self.init();
}

//顶部横向导航
function slideHorizontalNav(ele, option) {
    var defaults = {
        showLength: 5,
        hasPlaceholder: false,
        leftPlaceholder: ".nav-left-placeholder",
        rightPlaceholder: ".nav-right-placeholder",
        placeholderFun: null,
        initFun: null,
        clickFun: null
    };
    var self = this;
    var opt = self.opt = $.extend({}, defaults, option);
    var navSwiper = opt.swiper = FB.newSwiper(ele, 2);
    var navBox = $(ele),
        navEle = opt.element = navBox.find(".swiper-slide"),
        navActiveEle = navBox.find(".swiper-slide.active"),
        leftPlaceholder = opt.hasPlaceholder ? $(opt.leftPlaceholder) : "",
        rightPlaceholder = opt.hasPlaceholder ? $(opt.rightPlaceholder) : "";
    opt.length = navEle.length;
    self._init = function () {
        opt.navID = [];
        navEle.each(function () {
            opt.navID.push($(this).attr("data-id"));
        });
        if (opt.hasPlaceholder) {
            navEle.length >= opt.showLength ? rightPlaceholder.show() : rightPlaceholder.hide();
            navActiveEle.index() >= (opt.showLength - 1) ? leftPlaceholder.show() : leftPlaceholder.hide();
        }
        var _width = $(window).width();
        var _index = navActiveEle.index();
        var _left = navActiveEle.offset().left + navActiveEle.outerWidth(true);
        if (_left > _width) {
            navSwiper.slideTo((_index - 1), 100, false);
        }
        navEle.on("click", self._click);
        if (opt.initFun) opt.initFun.call(navBox[0], _index, opt);
    };

    self._click = function () {
        if ($(this).hasClass("active")) return false;
        $(this).addClass("active").siblings().removeClass("active");
        var _curBar = navBox.find(".swiper-slide.active");
        var _index = _curBar.index();
        var _width = _curBar.offset().left + _curBar[0].offsetWidth + 60;
        if (_width > $(window).width()) {
            navSwiper.slideNext();
        } else if ((_width - 60) < _curBar[0].offsetWidth * 2) {
            navSwiper.slidePrev();
        }
        if (opt.hasPlaceholder) self._placeholder();
        if (opt.clickFun) opt.clickFun.call(this, _index, opt);
    };

    self._placeholder = function () {
        var index = navBox.find(".swiper-slide.active").index();
        if (navEle.length >= opt.showLength) {
            index >= (opt.showLength - 3) ? leftPlaceholder.show() : leftPlaceholder.hide();
            index <= (navEle.length - (opt.showLength - 1)) ? rightPlaceholder.show() : rightPlaceholder.hide();
        }
        if (opt.placeholderFun) opt.placeholderFun.call(this, opt);
    };
    self._init();


    return opt;
}

//显示大图
function showBigImg(option) {
    var self = this;
    var defaults = {
        swiperEle: null,
        clickEle: "",
        animateEle: ".product-big",
        closeEle: ".fb-disk-close",
        numEle: "#bannerNum",
        allNum: null,
        showNum: "#productLength",
        container: "#productBig",
        loadingEle: ".swiper-loading",
        initFun: null
    };
    var opt = self.opt = $.extend({}, defaults, option);
    var imgSwiper, str = "";
    var clickEle = $(opt.clickEle),
        closeEle = $(opt.closeEle),
        parentsEle = clickEle.parent(),
        activeEle = opt.swiperEle ? clickEle.find(".swiper-slide-active") : clickEle,
        showIndex = $(opt.showNum).find("i").eq(0),
        showAllNum = $(opt.showNum).find("i").eq(1);
    var num = parseInt($(opt.numEle).text()) || parseInt(parentsEle.find("li").length) || opt.allNum;
    var index = opt.swiperEle ? activeEle.data("swiper-slide-index") : clickEle.index();
    var isLoaded = activeEle.find("img").hasClass("swiper-lazy-loaded") || activeEle.find("img").hasClass("load-success");
    showIndex.text(index + 1);
    showAllNum.text(num);

    self.showFun = function () {
        if (!$(opt.container).find(".swiper-wrapper").is(":empty")) return false;
        $(opt.loadingEle).hide();
        for (var i = 0; i < num; i++) {
            var $img = opt.swiperEle ? clickEle.find(".swiper-slide:not('.swiper-slide-duplicate')").eq(i).find("img")
                : parentsEle.find("li").eq(i).find("img");
            if (isLoaded) {
                str += "<div class='swiper-slide'>";
                str += "    <div class='box-cell'>" + $img[0].outerHTML + "</div>";
                str += "</div>";
            } else {
                if (i == index) {
                    $(opt.loadingEle).show();
                    str += "<div class='swiper-slide'>";
                    str += "    <div class='box-cell'>" + $img[0].outerHTML + "</div>";
                    str += "</div>";
                    //此处加载出图片利用swiper  lazy功能
                    //没有用到下面的加载方法
                    self.loadImg(activeEle.find("img"), function () {
                        $(opt.loadingEle).hide();
                    });
                } else {
                    str += "<div class='swiper-slide'>";
                    str += "    <div class='box-cell'>" + $img[0].outerHTML + "</div>";
                    str += "</div>";
                }
            }
        }
        $(opt.container).find(".swiper-wrapper").append(str);
        $(".box-cell img").each(function () {
            var $img = $(this);
            if ($img.data("original")) {
                $img.addClass("swiper-lazy").attr("data-src", $img.data("original")).removeAttr("data-original");
            }
            if ($img.hasClass("swiper-lazy-loading")) {
                $img.removeClass("swiper-lazy-loading");
            }
            $(this).removeAttr("style");
            FB.setImageLayout(this, $(window).width(), $(window).height() - 41);
        });

        imgSwiper = new Swiper(opt.container, {
            autoplay: 0,
            loop: false,
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            initialSlide: index,
            onLazyImageReady: function () {
                $(opt.container).find("img.swiper-lazy-loaded").each(function () {
                    $(this).removeAttr("style");
                    FB.setImageLayout(this, $(window).width(), $(window).height() - 41);
                })
            },
            onSlideNextStart: function (swiper) {
                swiper.update(true);
                showIndex.text(swiper.activeIndex + 1);
            },
            onSlidePrevStart: function (swiper) {
                swiper.update(true);
                showIndex.text(swiper.activeIndex + 1);
            }
        });

        $(opt.container).find(".swiper-wrapper").show();
        $(opt.animateEle).addClass("active");
    };

    self.closeFun = function () {
        str = "";
        $(opt.animateEle).removeClass("active");
        $(opt.container).find(".swiper-wrapper").fadeOut(300, function () {
            if (imgSwiper) {
                imgSwiper.update(true);
                imgSwiper.destroy(false, true);
            }
            $(this).empty();
            closeEle.off("click");
            $(opt.container).off("click");
        });
    };

    self.loadImg = function (img, callback) {
        var image = new Image();
        var imgStr = "";
        image.src = img.data("src") || img.data("original");
        image.onload = function () {
            console.log("image load success!");
            image.width = img[0].width;
            image.height = img[0].height;
            imgStr = "<img class='swiper-lazy swiper-lazy-loaded load-success' src='" + image.src + "'>";
            if (callback) callback.call(image, imgStr);
        };
        image.onerror = function () {
            console.log("image load error!");
        };
    };

    $(opt.container).on("click", function () {
        self.closeFun();
    });

    closeEle.on("click", function () {
        self.closeFun();
    });
    self.showFun();
}

//表单按钮组
function formChecked(ele, callback) {
    var _ele = ele || ".fb-radio-box";
    $(_ele).on("click", function (e) {
        e.stopPropagation();
        var type = $(this).find("input").prop("type");
        switch (type) {
            case "radio":
                if ($(this).hasClass(_ele.split(".")[1])) {
                    var name = $(this).find("input").attr("name");
                    $("input[name='" + name + "']").prop("checked", false).parents(_ele).removeClass("active");
                    $(this).addClass("active").find("input").prop("checked", false);
                } else {
                    var $input = $(this).find("input");
                    var $name = $input.attr("name");
                    $("input[name='" + $name + "']").prop("checked", false).parents(_ele).removeClass("active");
                    $input.prop("checked", true).parents(".fb-radio").addClass("active");
                }
                break;
            case "checkbox":
                var that = this;
                $(that).toggleClass("active");
                if ($(that).hasClass("active")) {
                    $(that).find("input").prop("checked", true);
                } else {
                    $(that).find("input").prop("checked", false);
                }
                break;
        }
        if (callback) callback.call($(_ele)[0], $(_ele).find("input").prop("checked"), $(_ele).hasClass("active"));
    });

    $(_ele).find("span").click(function (e) {
        e.stopPropagation();
    });
}

//手风琴
function slideDownNav(ele, type, time) {
    var _ele = ele || ".ft-slide-bar dt a";
    var _type = type || false;
    var _time = time || "normal";
    $(document).on("click", _ele, function () {
        var $parent = $(this).parent();
        var $parents = $(this).parents(".ft-slide-bar");
        if (_type) {
            if (!$(this).hasClass("active")) {
                $parents.find("dt").removeClass("current");
                $parents.find("dt a").removeClass("active");
                $parents.find("dd").slideUp(_time);
            }
        }
        $(this).toggleClass("active");
        $parent.toggleClass("current");
        $parent.next().stop(true, true).slideToggle(_time);
    });

    $(document).on("click", ".ft-slide-bar dd a", function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });
}

//地址选择
function selectAddressFun(option) {
    var defaultOpts = {
        type: "",
        postURL: "",
        postDATA: "",
        isPopPlayer: true,
        element: {
            current: "",
            cityEle: "#CityText",
            countryEle: "#CountryText"
        },
        areaOverflow: "#areaOverflow",
        areaPopBar: ".fb-area-bar",
        areaPopBox: ".fb-area-box",
        areaPopCloseBtn: "#closeArea",
        areaBox: "#areaBox",
        areaTitle: "#areaTitleText",
        areaTips: "#areaTips",
        areaMenu: "#areaMenu",
        selectCityFun: null,
        selectCountryFun: null
    };
    var opt = $.extend({}, defaultOpts, option);
    opt.elements = option.element ? $.extend({}, defaultOpts.element, option.element) : defaultOpts.element;
    var that = opt.element.current;
    var areaSort = [];
    var id = $(that).data("id");
    var text = $(that).text();
    var $closeBtn = $(opt.areaPopCloseBtn);
    var $areaMenu = $(opt.areaMenu);
    var $box = $(opt.areaBox);
    var $title = $(opt.areaTitle);
    var $tips = $(opt.areaTips);
    $areaMenu.find("a").each(function () {
        areaSort.push($(this).text());
    });
    if (opt.isPopPlayer) {
        showPopPlayer({
            closeEle: opt.areaPopCloseBtn,
            popEle: opt.areaPopBar,
            animateEle: opt.areaPopBox,
            openCallback: function (opts) {
                $areaMenu.show();
                $closeBtn.show();
                $tips.show();
                $title.text(text);
                $(opts.popEle).find(".area-loading").show();
                var html = "", str = "";
                var areaID = [];
                switch (opt.type) {
                    case "city":
                        $.ajax({
                            url: opt.postURL,
                            type: "POST",
                            async: true,
                            data: opt.postDATA,
                            success: function (result) {
                                $(opts.popEle).find(".area-loading").hide();
                                var data = result.locations;
                                for (var j = 0; j < areaSort.length; j++) {
                                    html += '<div class="area-floor">';
                                    html += '<h2>' + areaSort[j] + '</h2>';
                                    html += '<div class="area-list" id="list' + areaSort[j] + '">' + str + '</div>';
                                    html += '</div>';
                                }
                                $box.empty().html(html);

                                for (var i = 0; i < data.length; i++) {
                                    $(".area-list").each(function (k) {
                                        if (data[i].initial == areaSort[k]) {
                                            $(this).append('<a data-address-id="' + data[i].id + '" href="javascript:;">' + data[i].name + '</a>');
                                        }
                                    });
                                }

                                $box.find("a").each(function (i) {
                                    $(this).data("area-id", $(this).attr("data-address-id")).removeAttr("data-address-id").on("click", function () {
                                        opt.cityID = $(this).data("area-id");
                                        opt.cityName = $(this).text();
                                        if (opt.selectCityFun) opt.selectCityFun.call(that, opt);
                                        $(that).text($(this).text()).data("id", $(this).data("area-id"));
                                        $(opt.elements.countryEle).trigger("click");
                                    });
                                });
                                if ($areaMenu) {
                                    areaLetterFloor();
                                }
                            }
                        });
                        break;
                    case "country":
                        $areaMenu.hide();
                        $tips.hide();
                        if (!opt.postDATA.pid) {
                            $(opts.popEle).find(".area-loading").hide();
                            $box.html("<span class='none-area'>暂无数据，请先选择城市</span>")
                        } else {
                            $.ajax({
                                url: opt.postURL,
                                type: "POST",
                                async: true,
                                data: opt.postDATA,
                                success: function (result) {
                                    $(opts.popEle).find(".area-loading").hide();
                                    var data = result.locations;
                                    if (data.length == 0) {
                                        $title.text("请选择区县");
                                        $(that).text("请选择区县").data("id", "");
                                        $box.html("<span class='none-area'>该城市暂无区县选择</span>");
                                        return false;
                                    }
                                    for (var i = 0; i < data.length; i++) {
                                        areaID[i] = data[i].id;
                                        html += '<div class="area-floor">';
                                        html += '<div class="area-list">';
                                        html += '<a href="javascript:;">' + data[i].name + '</a>';
                                        html += '</div>';
                                        html += '</div>';
                                    }
                                    $box.empty().html(html);
                                    $box.find("a").each(function (i) {
                                        $(this).data("area-id", areaID[i]).on("click", function () {
                                            opt.countryID = $(this).data("area-id");
                                            opt.countryName = $(this).text();
                                            if (opt.selectCountryFun) opt.selectCountryFun.call(that, opt);
                                            $(that).text($(this).text()).data("id", $(this).data("area-id"));
                                            $closeBtn.click();
                                        });
                                    });
                                    if ($box.find("a")) {
                                        $title.text($box.find("a").eq(0).text());
                                        $(that).text($box.find("a").eq(0).text()).data("id", $box.find("a").eq(0).data("area-id"));
                                    }
                                }
                            });
                        }
                        break;
                }
                $(opt.areaOverflow).scrollTop(0);
            }
        });
    }


    //字母楼层
    function areaLetterFloor() {
        var $tips = $(opt.areaTips), $list = $(opt.areaBox).find(".area-floor");
        var topAry = [];
        $list.each(function () {
            topAry.push($(this).offset().top);
        });
        var scrollTips = pageScroll({
            element: opt.areaOverflow,
            hasTop: false,
            scrollFun: function (top) {
                if (top >= 0) {
                    topAry.forEach(function (val, key) {
                        if (Math.abs(top + 51) >= val) {
                            $tips.text($list.eq(key).find("h2").text());
                        }
                    });
                } else {
                    $tips.hide();
                }
            }
        });
        $(document).on("click touchend", ".area-menu a", function () {
            var _i = $(this).index();
            $tips.show();
            scrollTips.scrollToElement(scrollTips.element, topAry[_i] - 51);
        });
    }
}

//验证密码
function verifyPwd(ele, sureEle) {
    var opt = {}, _caps = false;
    var val = $(ele).val(), psdType;
    var $box = $(ele).parents(".item"),
        $psdType = $(".password-type>.type");
    var tips = "<div class='form-tips'></div>",
        pwdTip = "<div class='form-tips-pwd'></div>";
    $box.find("label:eq(0)").after(tips + pwdTip);
    var $tip = $(ele).parents(".item").find(".form-tips"),
        $pwdTip = $(ele).parents(".item").find(".form-tips-pwd");

    if (sureEle) {
        $(sureEle).parents(".item>label:eq(0)").after(tips);
    }
    //验证密码
    $(ele).blur(function () {
        val = $(this).val();
        psdType = FB.testForm.password(val);
        if (!psdType.type) {
            $box.addClass("error");
            $tip.empty().html("<label><b class='fb-arrow-dir top'></b>" + psdType.text + "</label>").show();
        } else {
            $box.removeClass("error");
            $tip.empty().hide();
        }
    }).focus(function () {
        $(this).parent().removeClass("error waring success");
        $tip.empty().hide();
        val = $(this).val();
        psdType = FB.testForm.password(val, {isShift: true});
        opt = psdType.options;
        if (_caps) {
            $pwdTip.empty().html("<label><b class='fb-arrow-dir left'></b>" + opt.capsText + "</label>");
        } else {
            $pwdTip.empty();
        }
    }).keyup(function () {
        val = $(this).val();
        psdType = FB.testForm.password(val);
        if (psdType.type == 1) {
            $psdType.attr("class", "type type-r");
        } else if (psdType.type == 2) {
            $psdType.attr("class", "type type-z");
        } else if (psdType.type == 3) {
            $psdType.attr("class", "type type-q");
        } else {
            $psdType.attr("class", "type text");
        }
    });

    //确认密码
    if (sureEle) {
        $(sureEle).blur(function () {
            val = $(this).val();
            var pwdVal = $(ele).val();
            if (val !== pwdVal) {
                $(sureEle).parents(".item").addClass("error");
                $(sureEle).parents(".item").find(".form-tips").empty().html("<label><b class='fb-arrow-dir top'></b>两次密码不一致</label>").show();
            } else {
                $(sureEle).parents(".item").removeClass("error");
                $(sureEle).parents(".item").find(".form-tips").empty().hide();
            }
        }).focus(function () {
            $(sureEle).parents(".item").removeClass("error");
            $(sureEle).parents(".item").find(".form-tips").empty().hide();
        });
    }

    //判断大写按键
    $(document).keydown(function (e) {
        var evt = e || window.event;
        var keyCode = evt.keyCode || evt.which;
        evt.stopPropagation();
        _caps = keyCode == 20;
    });
}

//清除文字
function clearText(tag, clearBox, type) {
    $(tag).click(function () {
        if (clearBox[0].nodeName.toLowerCase() == "input" || clearBox[0].nodeName.toLowerCase() == "textarea") {
            clearBox.val("");
        } else {
            clearBox.html("");
        }
        if (!type) {
            clearBox.keyup();
            clearBox.blur();
            $(this).hide();
        }
    });
    if (!type) {
        $(tag)[0].onmousedown = function (e) {
            var event = e || window.event;
            if (document.all) {
                event.returnValue = false;
            } else {
                event.preventDefault();
            }
        };
    }
}