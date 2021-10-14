var vm = new Vue({
    el: '#app',
    data: {
        tabsName: [{
            name: "最新动态",
            active: true
        }, {
            name: "好友动态",
            active: false
        }],
        FriendsDataList: [],
        dianzanList: {},
        current: false,
        LunboList: [],
        CityDataList: [],
        videoData: {},
        iconList: [],
        hotData: [],
        cityTipicList: [],
        host: 'http://bbssc.cloud.hoge.cn/',
        forum_id: null,
        user_care: '',
        // 显示数量
        count: 10,
        // 页数
        page: 1,
        flag: false,
        audioFlag: false,
        show: false,
        content: undefined,
        post_id: undefined,
        showTips: false,
        user_id: undefined,
        flagMore: true,
        access_token: undefined,
        avatarFlag: false,
        hasLogin: undefined,
        storage: window.localStorage,
        index: undefined,
        url: 'http://mapi.kangbatv.com/h5/kb_app'
    },
    filters: {
        getTimeData(dataTime) {
            var currentTime = new Date().getTime();
            var forwardTime;
            // var dataTime = parseInt(val.publish_time_stamp) * 1000;
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
        },
    },

    methods: {
        //获取url的参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
            return null;
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
        goTipics() {
            // window.location.href = 'tipics.html?_ddtarget=push';
            SmartCity.linkTo({
                innerLink: `${this.url}/tipics.html`
            });
        },
        goPost() {
            // window.location.href = 'post.html';
            SmartCity.linkTo({
                innerLink: `${this.url}/post.html`
            });
        },
        goHotTipics() {
            window.location.href = 'hotTipics.html?_ddtarget=push';
        },
        goTipicsAll() {
            SmartCity.linkTo({
                innerlink: "tipics_all.html?_ddtarget=push"
            });
            //window.location.href = 'tipics_all.html?_ddtarget=push';
        },
        // 轮播图接口(已完成)
        getLunBo() {
            const _this = this;
            param = {
                appkey: "ab05d20a85b75f1c8db9013f080a10db",
                appid: "m2o1rygvev0ntmif9c",
            }
            url = "http://mapi.kangbatv.com/api/open/kangba/shequ_lunbo";
            return new Promise((resolve, reject) => {
                axios.get(url, {
                        params: param
                    })
                    .then(
                        (res) => {
                            if (res.data.ErrorCode || res.data.ErrorText) {
                                return
                            }
                            // _this.LunboList = res.data.data;
                            // _this.getIconData();
                            setTimeout(() => {
                                    _this.getSlider();
                                }, 100),
                                resolve(res.data.data)
                        },
                        (err) => {
                            reject(err.data)
                        }
                    )
            });
        },
        // icon-帖子类别列表（已完成）  ?m=Apibbs&c=forum&a=index&fid=0
        getIconData() {
            const _this = this;
            param = {
                m: "Apibbs",
                a: "index",
                c: "forum",
                fid: 2526,
                // is_activity:1,
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
                        (res) => {
                            if (res.data.ErrorCode || res.data.ErrorText) {
                                return
                            }
                            // console.log(res.data);
                            // _this.iconList = res.data;
                            _this.forum_id = res.data[3].id;
                            // _this.getHotData();
                            // _this.getCityTipic()
                            resolve(res.data)
                        },
                        (err) => {
                            reject(err.data)
                        }
                    )
            })

        },

        // 列表展示功能 
        // ?m=Apibbs&c=post&a=postList     
        getCityData() {
            const _this = this;
            param = {
                m: "Apibbs",
                a: "postList",
                c: "post",
                fid: 0,
                count: _this.count,
                offset: (_this.page - 1) * _this.count,
                user_care: _this.user_care,
                // is_activity:1,
                // site_Id: 10188,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                // access_token:'ab47875ec2355ddf24516b94e8037cfe',
                access_token: _this.storage.getItem('access_token')
            }
            url = _this.host;
            return new Promise((resolve, reject) => {
                axios.get(url, {
                        params: param
                    })
                    .then(
                        (res) => {
                            if (res.data.ErrorCode || res.data.ErrorText) {
                                return
                            }
                            resolve(res.data)
                            if (_this.CityDataList) {
                                res.data.forEach(element => {
                                    if (element.pics_num == 1) {
                                        element.pics[0].filename = _this.imgAdaptation(element.pics[0].filename, '702', '400')
                                    } else if (element.pics_num == 2) {
                                        element.pics.forEach(key => {
                                            key.filename = _this.imgAdaptation(key.filename, '344', '350')
                                        })
                                    } else if (element.pics_num >= 3) {
                                        element.pics.forEach(key => {
                                            key.filename = _this.imgAdaptation(key.filename, '226', '226')
                                        })
                                    }
                                    _this.CityDataList.push(element)
                                });
                                if (_this.CityDataList.length < (_this.page) * _this.count) {
                                    _this.flagMore = false
                                }
                            }
                        },
                        (err) => {
                            reject(err.data)
                        }
                    )
            })


        },


        // getmore() {
        //     this.page++;
        //     this.getCityData()
        // },
        // 热门话题（已完成）  ?m=Apibbs&c=forum&a=index
        getCityTipic() {
            const _this = this;
            param = {
                m: "Apibbs",
                c: "forum",
                a: "index",
                weight: 100,
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
                        (res) => {
                            if (res.data.ErrorCode || res.data.ErrorText) {
                                return
                            }
                            // _this.cityTipicList = res.data;
                            res.data.forEach(element => {
                                element.indexpic.filename = _this.imgAdaptation(element.indexpic.filename, '270', '167')
                            });
                            resolve(res.data)
                            // console.log(_this.cityTipicList);
                        },
                        (err) => {
                            reject(err.data)
                        }
                    )

            })

        },
        // 热帖推荐（已完成） ?m=Apibbs&c=post&a=index    is_hot=1
        getHotData() {
            const _this = this;
            param = {
                m: "Apibbs",
                c: "post",
                a: "index",
                is_hot: "1",
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
                        (res) => {
                            if (res.data.ErrorCode || res.data.ErrorText) {
                                return
                            }
                            console.log(res.data, '123');
                            // _this.hotData = res.data
                            res.data.forEach(element => {
                                element.indexpic.filename = _this.imgAdaptation(element.indexpic.filename, '270', '270')
                            });
                            resolve(res.data)
                        },
                        (err) => {
                            reject(err.data)
                        }
                    )
            })

        },

        // 添加关注 
        getFollowed(index, user_id) {
            event.preventDefault();
            this.followData(index, user_id)
        },
        followData(index, user_id) {
            var user_id = user_id;
            console.log(this.hasLogin, 'this.haslogin');

            const _this = this;
            if (!_this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            param = {
                m: "Apibbs",
                c: "care",
                a: "care",
                access_token: _this.access_token,
                // 关注帖子1   关注人2
                care_type: 2,
                // 被关注的用户ID
                uorf_id: user_id,

                is_second: 1,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        if (res.data.ErrorCode || res.data.ErrorText) {
                            return
                        }
                        _this.CityDataList[index].user_care = 1;
                    }
                )
        },
        // 取消关注   base_url?m=Apibbs&c=care&a=deleteCare
        deleteFollowed(index, user_id) {
            event.preventDefault();
            this.deleteFollowData(index, user_id)
        },

        deleteFollowData(index, user_id) {
            const _this = this;
            if (!_this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            param = {
                m: "Apibbs",
                c: "care",
                a: "deleteCare",
                access_token: _this.access_token,
                // 关注帖子1   关注人2
                care_type: 2,
                // 被关注的用户ID
                uorf_id: user_id,

                is_second: 1,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        if (res.data.ErrorCode || res.data.ErrorText) {
                            return
                        }
                        _this.CityDataList[index].user_care = 0;
                    }
                )
        },
        // 好友动态   ?m=Apibbs&c=post&a=postsForCarePeople
        getFriendsData() {
            const _this = this;
            // if (!_this.hasLogin) {
            //     console.log('login')
            //     SmartCity.goLogin();
            //     return
            // }
            // const access_token = _this.getCookie('access_token');
            param = {
                m: "Apibbs",
                c: "post",
                a: "postsForCarePeople",
                offset: (_this.page - 1) * _this.count,
                count: _this.count,
                // site_Id: 10188,
                custom_appid: 462,
                access_token: _this.access_token,
                // access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        if (res.data.ErrorCode || res.data.ErrorText) {
                            return
                        }
                        console.log(res.data, '好友动态');
                        if (_this.FriendsDataList.length == 0) {
                            _this.FriendsDataList = res.data;
                        } else if (_this.FriendsDataList.length != 0 && res.data.length != 0) {
                            res.data.forEach(element => {
                                if (element.pics_num == 1) {
                                    element.pics[0].filename = _this.imgAdaptation(element.pics[0].filename, '702', '400')
                                } else if (element.pics_num == 2) {
                                    element.pics.forEach(key => {
                                        key.filename = _this.imgAdaptation(key.filename, '344', '350')
                                    })
                                } else if (element.pics_num >= 3) {
                                    element.pics.forEach(key => {
                                        key.filename = _this.imgAdaptation(key.filename, '226', '226')
                                    })
                                }

                                _this.FriendsDataList.push(element)
                            });
                        }
                    }
                )

        },

        // 点赞功能 完成
        dianzan(index, id) {
            event.preventDefault();
            this.getDianzanData(index, id);
            // console.log(id)
        },
        // 点赞功能   ?m=Apibbs&c=post&a=praise   ?m=Apibbs&c=post&a=postPraise
        // post_id  帖子ID
        getDianzanData(index, id) {
            const _this = this;
            if (!_this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            // const access_token = _this.getCookie('access_token');
            param = {
                m: "Apibbs",
                c: "post",
                a: "postPraise",
                // access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                access_token: _this.access_token,
                post_id: id,
                // site_Id: 10188,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',

            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        if (res.data.ErrorCode || res.data.ErrorText) {
                            return
                        }
                        let praise_userinfoList = _this.CityDataList[index].praise_userinfo;
                        praise_userinfoList.unshift(res.data);
                        _this.CityDataList[index].is_praise = 1;
                        _this.CityDataList[index].praise_num++;
                        // console.log(_this.CityDataList[index].praise_userinfo[0].user_id)
                        _this.user_id = _this.CityDataList[index].praise_userinfo[0].user_id
                        // _this.getCityData();
                    }
                )
        },
        // 取消点赞 ?m=Apibbs&c=post&a=praise 
        deleteDianzan(index, id) {
            event.preventDefault();
            // console.log(index)
            this.deleteDianzanData(index, id);
        },
        deleteDianzanData(index, id) {
            // ?m=Apibbs&c=post&a=postPraise
            const _this = this;
            if (!_this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            // const access_token = _this.getCookie('access_token');
            param = {
                m: "Apibbs",
                c: "post",
                a: "postPraise",
                op: "del",
                access_token: _this.access_token,
                // access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                post_id: id,
                // site_Id: 10188,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        if (res.data.ErrorCode || res.data.ErrorText) {
                            return
                        }
                        // console.log(res.data.user_id)
                        _this.CityDataList[index].is_praise = 0;
                        _this.CityDataList[index].praise_num--;
                        _this.CityDataList[index].praise_userinfo.forEach((key, index1) => {
                            if (key.user_id == res.data.user_id) {
                                _this.CityDataList[index].praise_userinfo.splice(index1, 1)
                            }
                        })
                    }
                )
        },

        // 我关注的人发的帖子  ?m=Apibbs&c=post&a=postsForCarePeople
        // 空数组
        getMyFollowData() {
            const _this = this;
            // const access_token = _this.getCookie('access_token');
            param = {
                m: "Apibbs",
                c: "post",
                a: "postsForCarePeople",
                // site_Id: 10188,
                access_token: _this.access_token,
                // access_token: 'ab47875ec2355ddf24516b94e8037cfe',
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        console.log(res.data);

                    }
                )
        },
        changeColor() {
            if (this.content.length > 0) {
                this.$refs.sendBtn.style.color = "#333";
            } else {
                this.$refs.sendBtn.style.color = "#999";
            }

        },

        getAllPeople(index, id) {
            event.preventDefault();
            window.location.href = `index_detail.html?_ddtarget=push&post_id=${id}`;
        },

        // 音频播放
        playVideo() {
            const _this = this;
            event.preventDefault();
            // var duration = _this.$refs.audio[0].duration * 1000;
            // var current = _this.$refs.audio[0].duration * 1000;
            var audioEle = _this.$refs.audio[0];
            if (audioEle.paused) {
                audioEle.play(); //audioEle.play();// 这个就是播放 
                _this.audioFlag = true;
            } else {
                audioEle.pause(); // 这个就是暂停
                _this.audioFlag = false;
            }
            if (audioEle) {
                audioEle.loop = false;
                audioEle.addEventListener('ended', function () {
                    _this.audioFlag = false;
                    //在这个方法里写相应的逻辑就可以了

                }, false);
            }


        },
        showCont() {
            this.show = !this.show;
        },
        // 发表评论---弹出框
        getComment(index, id) {
            event.preventDefault();
            if (!this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            this.show = !this.show;
            this.post_id = id;

            this.$nextTick(function () {
                this.$refs.textareaBox.focus()
            })
        },
        // 创建评论  m=Apibbs&c=post&a=comment
        sendComment() {
            this.show = !this.show;
            const _this = this;
            // const access_token = _this.getCookie('access_token');
            param = {
                m: "Apibbs",
                a: "comment",
                c: "post",
                post_id: _this.post_id,
                content: _this.content,
                // site_Id: 10188,
                custom_appid: 462,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                access_token: _this.access_token,
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
            }
            url = _this.host;
            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        setTimeout(() => {
                            _this.showTips = false;
                        }, 1500)

                        _this.showTips = true;

                        if (res.data.ErrorCode || res.data.ErrorText) {
                            _this.tipMessage = res.data.ErrorText
                            _this.content = '';
                            return
                        }
                        _this.content = '';
                        _this.tipMessage = "发布成功"
                    }
                )
        },
        // 轮播图
        getSlider() {
            this.mySwiper = new Swiper(this.$refs.swiperContainer, {
                // autoplay: true, //可选选项，自动滑动
                pagination: {
                    el: '.swiper-pagination',
                },
                loop: true,
                loopAdditionalSlides: 4,
                autoplay: {
                    delay: 1500,
                    stopOnLastSlide: false,
                    disableOnInteraction: false,
                },
            })
        },
        // tab切换
        tabsSwitch(tabIndex) {
            this.index = tabIndex;
            var tabCardCollection = document.querySelectorAll(".tab-card"),
                len = tabCardCollection.length;
            for (var i = 0; i < len; i++) {
                tabCardCollection[i].style.display = "none";
                this.tabsName[i].active = false;
            }
            this.tabsName[tabIndex].active = true;
            tabCardCollection[tabIndex].style.display = "block";
        },


        // 分享功能
        shareAll(index, id) {
            event.preventDefault();
            const _this = this;
            if (!_this.hasLogin) {
                console.log('login')
                SmartCity.goLogin();
                return
            }
            if (_this.CityDataList[index].video.is_have_video != 0 && _this.CityDataList[index].video.mtype) {
                imgLink = _this.CityDataList[index].video.m3u8;
            } else if (_this.CityDataList[index].is_have_video != 0 && _this.CityDataList[index].video.is_audio == 1) {
                imgLink = `${item.video.host}${item.video.dir}${item.video.filepath}${item.video.filename}`
            } else {
                imgLink = `${_this.CityDataList[index].indexpic.host}${_this.CityDataList[index].indexpic.dir}${_this.CityDataList[index].indexpic.filepath}${_this.CityDataList[index].indexpic.filename}`
            }
            var param = {
                title: _this.CityDataList[index].title,
                brief: _this.CityDataList[index].brief,
                contentURL: _this.CityDataList[index].content_url,
                imgLink: imgLink,
            }
            SmartCity.shareTo(param);
        },
        // 获取用户信息
        _initUserInfo() {
            var _this = this;
            SmartCity.getUserInfo(function (res) {
                if (res && res.userInfo) {
                    _this.access_token = res.userInfo.userTokenKey;
                    _this.storage.setItem('access_token', _this.access_token)
                }
                _this.promiseAll();
                _this.getFriendsData();
            })

        },
        goDetail(index, id) {
            let link = `xiangqing/NewsDetailStyle6?id=${id}`
            SmartCity.linkTo({
                innerLink: link
            })
        },
        _hideTop() {
            SmartCity.hideTopView({
                isShow: 0
            })
        },
        promiseAll() {
            const _this = this;
            Promise.all([_this.getIconData(), _this.getCityData(), _this.getCityTipic(), _this.getHotData(), _this.getLunBo()])
                .then(function (result) {
                    _this.iconList = result[0];
                    _this.CityDataList = result[1];
                    _this.cityTipicList = result[2];
                    _this.hotData = result[3];
                    _this.LunboList = result[4];
                    _this.flag = true;
                    _this.hasLogin = new UserInfo().isLogin(_this.storage.getItem('access_token'));
                    console.log(_this.hasLogin, 'haslogin')
                    console.log(_this.storage.getItem('access_token'), 'access_token')
                });
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
        goBack() {
            SmartCity.goBack();
        }


    },
    created() {
        this._initUserInfo();
        this.promiseAll();
        this._hideTop();
        //new VConsole();

        window.addEventListener('scroll', () => {
            if (this.getScrollTop() + this.getClientHeight() == this.getScrollHeight()) {
                if (this.index == 1) {
                    this.page++;
                    this.getFriendsData();
                    if (this.FriendsDataList.length < (this.page) * this.count) {
                        return
                    }
                } else {
                    this.page++;
                    this.getCityData();
                    if (this.CityDataList.length < (this.page) * this.count) {
                        return
                    }
                }

            }

        });

    }
});