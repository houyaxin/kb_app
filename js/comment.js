var vm = new Vue({
    el: '#app',
    data: {
        count: 100,
        page: 1,
        allCommentList: []
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
        }
    },

    methods: {
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
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
            };
            url = 'http://bbssc.cloud.hoge.cn';

            axios.get(url, {
                    params: param
                })
                .then(
                    res => {
                        _this.allCommentList = res.data;
                        console.log(res.data, 'data');
                    }
                )
        },
        dianzan(index, id) {
            const _this = this;
            const access_token = _this.getCookie('access_token')
            param = {
                id: id,
                custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
                access_token: access_token
            }
            axios.get('http://mapi.kangbatv.com/api/v1/comment_vote.php', {
                    params: param
                })
                .then(
                    res => {
                        _this.getAllComment()
                    }
                )
        },
        // 获取url上的参数
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
            if (r != null) return r[2];
            return null;
        },
        goBack() {
            SmartCity.goBack();
        },
        _hideTop() {
            SmartCity.hideTopView({
                isShow: 0
            })
        }
    },
    created() {
        this.getAllComment();
        this._hideTop();
        // console.log(this.GetQueryString("id"))

    },
})