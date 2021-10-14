// 获取url上的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
}

var post_id = GetQueryString('post_id');
var vm = new Vue({
    el: '#app',
    data: {
        host: "http://bbssc.cloud.hoge.cn/",
        dianzanList: [],
    },
    filters: {
        getTimeData(dataTime) {
            var currentTime = new Date().getTime();
            // var dataTime = parseInt(val.publish_time_stamp) * 1000;
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
        // http://cloud.city.hogesoft.com/index.php?m=Apibbs&c=praise&a=show&post_id=4
        // 获取点赞的列表base_url?m=Apibbs&c=praise&a=show
        getdianzan() {
            const _this = this;
            param = {
                m: "Apibbs",
                a: "show",
                c: "praise",
                post_id: post_id,
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
                        _this.dianzanList = res.data
                        _this.dianzanList.forEach((element, index) => {
                            if (element.avatar.hasOwnProperty('host')) {
                                _this.dianzanList[index].avatarFlag = true;
                            }
                        });
                    }
                )
        },
        _hideTop() {
            SmartCity.hideTopView({
                isShow: 0
            })
        },
    },
    created() {
        this._hideTop()
        this.getdianzan()
    },
})