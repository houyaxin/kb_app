function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
}
if (GetQueryString("show")) {
    var show = true;
} else {
    show = false
}
var vm = new Vue({
    el: "#app",
    data: {
        show: show,
        host: 'http://bbssc.cloud.hoge.cn/',
        CityDataList: {},
        audioFlag: false,
        avatarImg: undefined,
        videoTip: undefined,
        audioTip: undefined,
        content: undefined,
        comentData: [],
        count: 3,
        page: 1,
        avatarFlag: undefined,
        showTips: false,
        tipMessage: undefined,
        flagMore: true,
        hasLogin: undefined,
        access_token: undefined,
        storage: window.localStorage,
        flag: false,
        videoList: [],
    },
    filters: {
        getTimeData(dataTime) {
            var currentTime = new Date().getTime();
            var forwardTime;
            var seconds = parseInt((currentTime - dataTime * 1000) / 60000);
            if (seconds < 1) {
                forwardTime = '1分钟前'
            } else if (seconds < 60 && seconds > 1) {
                forwardTime = seconds + '分钟前'
            } else if (seconds > 60 && seconds < 1440) {
                forwardTime = parseInt(seconds / 60) + '小时前'
            } else if (seconds > 1440) {
                forwardTime = parseInt(seconds / 1440) + '天以前'
            }
            return forwardTime
        }
    },
    methods: {
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        showCont: function() {
            this.show = !this.show;
        },
        getComment() {
            this.show = !this.show;
            this.$nextTick(function() {
                this.$refs.textareaBox.focus()
            })
        },

        getDetailData() {
            const _this = this;
            param = {
                m: "Apibbs",
                // a: "postList",
                a: "detail",
                c: "post",
                // fid: 0,
                post_id: _this.GetQueryString("id"),
                // site_Id: 10188,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            return new Promise((resolve, reject) => {
                axios.get(url, {
                        params: param
                    })
                    .then(
                        res => {
                            console.log(res.data,'data');
                            if (res.data.ErrorCode || res.data.ErrorText) {
                                return
                            }
                            resolve(res.data)

                            // 判断 用户头像的数组是否为空
                            if (res.data.user_info.avatar != 0) {
                                _this.avatarImg = res.data.user_info.avatar;
                            }
                            // 判断 视频的字段mtype是否存在
                            if (res.data.videos != '') {
                                if (res.data.videos[0].mtype != '') {
                                    _this.videoTip = res.data.videos[0].mtype;
                                }
                            }
                            // 判断 音频的字段是否存在
                            if (res.data.videos != '') {
                                if (res.data.videos[0].is_audio != 0) {
                                    _this.audioTip = res.data.videos[0].is_audio;
                                }
                            }
                            // 判断 地址为空的时候  隐藏
                            if (res.data.address == 0 || res.data.address == '') {
                                _this.$refs.address.style.visibility = 'hidden';
                            }
                            // console.log(_this.$refs.address, '...')
                        },
                        err => {
                            reject(err.data)
                        }
                    )
            })

        },

        sendComment() {
            const _this = this;
            if (!_this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            _this.show = !_this.show;
            param = {
                m: "Apibbs",
                a: "comment",
                c: "post",
                post_id: this.GetQueryString("id"),
                content: this.content,
                // site_Id: 10188,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
                access_token: this.storage.getItem('access_token'),
            }
            url = _this.host;
            axios.get(url, {
                params: param
            }).then(
                res => {
		    console.log(res.data,'发布评论')
                    _this.sendCommentData();
                    //setTimeout(() => {
                      //  _this.showTips = false;
                   // }, 1500)

                    _this.showTips = true;

                  //  if (res.data.ErrorCode || res.data.ErrorText) {
                    //    _this.tipMessage = res.data.ErrorText
                      //  _this.content = '';
                       // return
                    //}
                    _this.content = '';
			
                    _this.tipMessage = "发布成功"
		   console.log(_this.tipMessage,'tipmessage')
                }
            )
        },
        sendCommentData() {
            const _this = this;
            // const access_token = _this.getCookie('access_token')
            param = {
                m: 'Apibbs',
                c: 'comment',
                a: 'index',
                post_id: _this.GetQueryString("id"),
                count: _this.count,
                offset: (_this.page - 1) * _this.count,
                // site_Id: 10188,
                custom_appid: 462,
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                access_token: storage.getItem('access_token'),
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            };
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        _this.comentData = res.data;
                    }
                )
        },

        // 获取所有评论 base_url?m=Apibbs&c=comment&a=index
        getAllComment() {
            const _this = this;
            param = {
                m: 'Apibbs',
                c: 'comment',
                a: 'index',
                post_id: _this.GetQueryString("id"),
                count: _this.count,
                offset: (_this.page - 1) * _this.count,
                // site_Id: 10188,
                custom_appid: 462,
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                access_token: this.storage.getItem('access_token'),
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            };
            url = _this.host;
            return new Promise((resolve, reject) => {
                axios.get(url, {
                        params: param
                    })
                    .then(
                        res => {
                            resolve(res.data)
			    console.log(res.data,'评论列表')
                            if (_this.comentData && res.data.length != 0) {

                                res.data.forEach(element => {
                                    _this.comentData.push(element)
                                });
                            }

                            if (_this.comentData.length < (_this.page) * _this.count) {
                                _this.flagMore = false
                            }
                        },
                        err => {
                            reject(err.data)
                        }
                    )
            })
        },
        goAllComment(id, index, ) {
            console.log(id)
            window.location.href = `comment.html?id=${id}`
        },
        // 加载更多评论 
        // getMore() {
        // 	this.page++;
        // 	this.getAllComment()
        // },
        changeColor() {
            if (this.content.length > 0) {
                this.$refs.sendBtn.style.color = "#333";
            } else {
                this.$refs.sendBtn.style.color = "#999";
            }
        },
        // 音频播放
        playVideo() {
            const _this = this;
            event.preventDefault();
            var audioEle = _this.$refs.audio;
            if (audioEle.paused) {
                audioEle.play(); // 这个就是播放 
                _this.audioFlag = true;
            } else {
                audioEle.pause(); // 这个就是暂停
                _this.audioFlag = false;
            }
            if (audioEle) {
                audioEle.loop = false;
                audioEle.addEventListener('ended', function() {
                    _this.audioFlag = false;
                }, false);
            }
        },

        // 获取用户信息
        _initUserInfo() {
            const _this = this;

            SmartCity.getUserInfo(function(res) {
                if (res && res.userInfo) {
                    _this.access_token = res.userInfo.userTokenKey;
                    _this.storage.setItem('access_token', _this.access_token)
                }
                _this.promiseAll()
            })
        },
        promiseAll() {
            const _this = this;
            Promise.all([_this.getDetailData(), _this.getAllComment()])
                .then(function(result) {
                    _this.CityDataList = result[0];
                    _this.videoList = result[0].videos[0]
                        // console.log(result) // 输入应该为 ['fun1','fun2']
                    _this.hasLogin = new UserInfo().isLogin(_this.access_token)
                    _this.flag = true
                })

        },
        //获取滚动条当前的位置 
        getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },

        //获取当前可视范围的高度 
        getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            } else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        },

        //获取文档完整的高度 
        getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        },
    },
    created() {
        this._initUserInfo();
       // this.promiseAll();
       // new VConsole();
        //滚动事件触发
        window.addEventListener('scroll', () => {
            if (this.getScrollTop() + this.getClientHeight() == this.getScrollHeight()) {
                this.page++;
                this.getAllComment()
            }
        })
    },
})
