var vm = new Vue({
    el: '#app',
    data: {
        host: 'http://bbssc.cloud.hoge.cn/',
        flag: true,
        count: 10,
        page: 1,
        tipicsList: [],
        access_token: undefined,
        hasLogin: undefined,
        storage: window.localStorage
    },
    methods: {
        // 我的关注
        getMyfollowData() {
            const _this = this;
            console.log(_this.access_token, 'token');
            console.log(this.hasLogin, 'hailogin');
            if (!this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            param = {
                m: "Apibbs",
                c: "care",
                a: "showMyCareForum",
                access_token: _this.storage.getItem('access_token'),
                offset: (_this.page - 1) * _this.count,
                count: _this.count,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            axios.get(url, {
                params: param
            })
            .then(
                res => {
                    console.log(res.data, 'res.data');
                    
                    if (res.data.ErrorCode || res.data.ErrorText) {
                        return
                    }
                    _this.tipicsList = res.data;
                    _this.flag = true;
                    res.data.forEach((ele) => {
                        ele.indexpic.filename = _this.imgAdaptation(ele.indexpic.filename,
                            '114', '114')
                    })
                }
            )
        },
        imgAdaptation(filename, w, h) {
            var reg = RegExp(/\{\$hgPicSizeStart\}/);
            if (filename.match(reg)) {
                filename = filename.replace("{$hgPicSizeStart}", "");
                filename = filename.replace("{$hgPicSizeEnd}", "");
                filename = filename.replace("{$hgPicSizeWidth}", w);
                filename = filename.replace("{$hgPicSizeHeight}", h);
            }
            return filename
        },
        // 获取用户信息
        _initUserInfo() {
            var _this = this;
            SmartCity.getUserInfo(function (res) {
                if (res && res.userInfo) {
                    _this.access_token = res.userInfo.userTokenKey;
                    _this.storage.setItem('access_token', _this.access_token);
                    _this.hasLogin = new UserInfo().isLogin(_this.access_token);
                }
                _this.getMyfollowData()
            })
        },
        _hideTop() {
            SmartCity.hideTopView({ 
                isShow: 0
            })
        },
        goBack() {
            SmartCity.goBack();
        }
    },
    created() {
        this._hideTop();
        this._initUserInfo();
       // new VConsole();
    },
})
