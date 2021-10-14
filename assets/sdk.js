;
(function(undefined) {

    var _initBridge = false;

    function SmartCity() {}

    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                return callback(WebViewJavascriptBridge);
            }, false);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }

    function callHandler(api, param, callback) {
        if (!isSmartCity()) {
            alert('请在app中打开');
            return;
        }
        setupWebViewJavascriptBridge(function(bridge) {
            if (typeof bridge.init != 'undefined' && bridge.init instanceof Function) {
                if (!_initBridge) {
                    bridge.init(function(message, responseCallback) {});
                    _initBridge = true;
                }
            }
            if (api == 'getLocation') {
                bridge.registerHandler('getLocation', function(response, responseCallback) {
                    response = typeof response === 'string' ? JSON.parse(response) : response;
                    callback && callback(response);
                    responseCallback('success');
                });
            }
            bridge.callHandler(api, param, function(response) {
                response = typeof response === 'string' ? JSON.parse(response) : response;
                callback && callback(response);
            });
        });
    }

    function getMobileDevice() {
        var mbldevice = navigator.userAgent.toLowerCase()
        if (/iphone|ipod|ipad/gi.test(mbldevice)) {
            return 'iOS'
        } else if (/android/gi.test(mbldevice)) {
            return 'Android'
        } else {
            return 'other'
        }
    }

    function isSmartCity() {
        var mbldevice = navigator.userAgent.toLowerCase();
        if (/m2osmartcity/gi.test(mbldevice)) {
            return true;
        } else {
            return false;
        }
    }

    SmartCity.prototype = {

        constructor: this,

        //判断是否在厚建客户端
        isSmartCityApp: function() {
            return isSmartCity();
        },

        //获取用户信息
        getUserInfo: function(callback) {
            callHandler('getUserInfo', null, function(response) {
                callback && callback(response);
            })
        },

        //获取设备信息
        getSystemInfo: function(callback) {
            callHandler('getSystemInfo', null, function(response) {
                callback && callback(response);
            })
        },

        //获取位置信息
        getLocation: function(callback) {
            callHandler('getLocation', null, function(response) {
                callback && callback(response);
            })
        },

        //去登录页
        goLogin: function() {
            callHandler('goLogin', null, null);
        },

        //回到上一页
        goBack: function() {
            callHandler('goBack', null, null);
        },

        //打电话
        makeCall: function(param) {
            callHandler('makeCall', param, null);
        },

        //发邮件
        sendMail: function(param) {
            callHandler('sendMail', param, null);
        },

        //发短信
        makeMsm: function(param) {
            callHandler('makeMsm', param, null);
        },

        //去用户中心
        goUcenter: function() {
            callHandler('goUcenter', null, null);
        },

        //退出当前页面        
        goAbort: function() {
            callHandler('goAbort', null, null);
        },

        //返回首页
        goRoot: function() {
            callHandler('goRoot', null, null);
        },

        //分享
        shareTo: function(param) {
            callHandler('shareTo', param, null);
        },

        //分享成功
        onShareSuccess: function(callback) {
            callHandler('onShareSuccess', null, function(response) {
                callback && callback(response);
            })
        },

        //内链跳转
        linkTo: function(param) {
            callHandler('linkTo', param, null);
        },

        //去地图
        goMap: function(param) {
            callHandler('goMap', param, null);
        },

        //大图预览（单张）
        clickImage: function(param) {
            callHandler('clickImage', param, null);
        },

        //大图预览（单张）
        showBigImage: function(param) {
            callHandler('showBigImage', param, null);
        },

        //图片保存
        saveImage: function(param) {
            callHandler('saveImage', param, null);
        },

        //显示分享按钮
        showShareBtn: function(param) {
            callHandler('showShareBtn', param, null);
        },

        //隐藏导航栏
        hideTopView: function(param) {
            callHandler('hideTopView', param, null);
        },

        //全屏播放
        fullScreenPlay: function(param) {
            callHandler('fullScreenPlay', param, null);
        },

        //清空历史信息
        clearHistory: function() {
            callHandler('clearHistory', null, null);
        },

        //获取头加密信息
        getRequestHeader: function(callback) {
            callHandler('getRequestHeader', null, function(response) {
                callback && callback(response);
            })
        },

        //选择图片
        chooseImage: function(param, callback) {
            callHandler('chooseImage', param, function(response) {
                callback && callback(response);
            })
        },

        //图片预览
        previewImage: function(param) {
            callHandler('previewImage', param, null);
        },

        //扫描二维码
        scanQRCode: function(callback) {
            callHandler('scanQRCode', null, function(response) {
                callback && callback(response);
            })
        },

        //跳转绑定手机号页面
        goBind: function() {
            callHandler('goBind', null, null);
        },

        //跳转人脸识别实名认证组件
        goToAuthentication: function(callback) {
            callHandler('goToAuthentication', null, function(response) {
                callback && callback(response);
            })
        },

        //跳转拍照页面
        goToCamera: function(param, callback) {
            callHandler('goToCamera', param, function(response) {
                callback && callback(response);
            })
        },

        //跳转活体认证页面
        goToLivingStyle: function(callback) {
            callHandler('goToLivingStyle', null, function(response) {
                callback && callback(response);
            })
        },

        //请求接口数据
        requestApi: function(param, callback) {
            callHandler('requestApi', param, function(response) {
                callback && callback(response);
            })
        },

        //是否禁止侧滑返回
        interactivePopDisabled: function(param) {
            callHandler('interactivePopDisabled', param, null);
        },

        //发送云统计数据
        sendAnalysisData: function(param) {
            callHandler('sendAnalysisData', param, null);
        },

        //请求跳转子app
        linkToSubApp: function(param) {
            callHandler('linkToSubApp', param, null);
        },

        //播放vr视频
        goVRPlayer: function(param) {
            callHandler('goVRPlayer', param, null);
        },

        //加载播放器
        embedVideoPlayer: function(param) {
            callHandler('embedVideoPlayer', param, null);
        },

        //销毁播放器
        destroyVideoPlayer: function() {
            callHandler('destroyVideoPlayer', null, null);
        },

        //加载弹幕
        loadBarrageData: function(param) {
            callHandler('loadBarrageData', param, null);
        },

        //请求接口数据
        getRelateNews: function(callback) {
            callHandler('getRelateNews', null, function(response) {
                callback && callback(response);
            })
        },

        goSubscription: function(param, callback) {
            callHandler('goSubscription', param, function(response) {
                callback && callback(response);
            })
        },

        getPraiseInfo: function(callback) {
            callHandler('getPraiseInfo', null, function(response) {
                callback && callback(response);
            })
        },

        goPraise: function() {
            callHandler('goPraise', null, null)
        },

        getMyPraise: function(callback) {
            callHandler('getMyPraise', null, function(response) {
                callback && callback(response);
            })
        },

        getDiggInfo: function(callback) {
            callHandler('getDiggInfo', null, function(response) {
                callback && callback(response);
            })
        },

        getCommentList: function(callback) {
            callHandler('getCommentList', null, function(response) {
                callback && callback(response);
            })
        },

        getCommentCount: function(callback) {
            callHandler('getCommentCount', null, function(response) {
                callback && callback(response);
            })
        },

        getMoreComment: function() {
            callHandler('getMoreComment', null, null)
        },

        showCommentInput: function(param) {
            callHandler('showCommentInput', param, null)
        },

        getSubsInfo: function(callback) {
            callHandler('getSubsInfo', null, function(response) {
                callback && callback(response);
            })
        },

        newsZan: function(callback) {
            callHandler('newsZan', null, function(response) {
                callback && callback(response);
            })
        },

        commentZan: function(param, callback) {
            callHandler('commentZan', param, function(response) {
                callback && callback(response);
            })
        },

        commentReply: function(param) {
            callHandler('commentReply', param, null)
        },

        digg: function(param, callback) {
            callHandler('digg', param, function(response) {
                callback && callback(response);
            })
        },

        //获取电讯广告
        getNewsDetailCDSPAd: function(callback) {
            callHandler('getNewsDetailCDSPAd', null, function(response) {
                callback && callback(response);
            })
        },

        //读新闻
        readNewsContent: function(param) {
            callHandler('readNewsContent', param, null)
        },

        //设置字体大小
        setFontSize: function(param) {
            callHandler('setFontSize', param, null)
        },

        //获取夜间模式状态
        getNightStatus: function(callback) {
            callHandler('getNightStatus', null, function(response) {
                callback && callback(response);
            })
        },

        //融合号跳转
        getSubsInfoOfPlus: function(param) {
            callHandler('getSubsInfoOfPlus', param, null)
        },

        //订阅"订阅状态：0或者1"
        goSubscriptionOfPlus: function(param, callback) {
            callHandler('goSubscriptionOfPlus', param, function(response) {
                callback && callback(response);
            })
        },

        //获取网易信息流点赞数量
        getPraiseNum: function(callback) {
            callHandler('getPraiseNum', null, function(response) {
                callback && callback(response);
            })
        },

        //获取网易信息流点击量
        getPraiseNum: function(callback) {
            callHandler('getClickNum', null, function(response) {
                callback && callback(response);
            })
        },

        //打赏
        goToReward: function() {
            callHandler('goToReward', null, null);
        },

        getViewPagerInfo: function(param) {
            callHandler('getViewPagerInfo', param, null);
        }
    }
    window.SmartCity = new SmartCity();
}());
