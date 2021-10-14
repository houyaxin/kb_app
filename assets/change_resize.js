  ;(function(doc,win){
	// 单位换算(rem 和 px)
	var docEl = doc.documentElement,
//            resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                    docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
            };
    if (!doc.addEventListener) return;
    win.addEventListener('resize', recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window)