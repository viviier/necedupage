/* util */

var Util = (function() {

    /* 使用类 */

    // ajax
   var getXMLHttp = function() {
        if(typeof XMLHttpRequest !== 'undefined') {
                return new XMLHttpRequest();
        } else if(typeof ActiveXObject !== 'undefined'){
                return new ActiveXObject('MSXML2.XMLHttp');
        }
    };
    // event
    var getEvent = function(event) {
        return event ? event:window.event;
    };
    // target
    var getTarget = function(event) {
        return event.getTarget ? event.target : event.srcElement;
    };
    // prevent
    var prevent = function(event) {
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
    // stopPropagation
    var stopPropagation = function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    };
    // localstorage
    var getItem = function(key) {
        return localStorage.getItem('_local' + key);
    };

    var setItem = function(key, val) {
        return localStorage.setItem('_local' + key , val);
    };
    // getElm
    var getElmById = function(id) {
      if(id !== 'undefined') {
          return document.getElementById(id);
      }
    };
    // addHanlder
    var addHandler = function(el, type, handler) {
        var createHandler;
        if(typeof addEventListener !== 'undefined') {
            createHandler = function() {
                return el.addEventListener(type, handler);
                }
            } else if(typeof attachEvent !== 'undefined') {
                createHandler = function() {
                    return el.attachEvent('on' + type, handler);
                    }
                }else {
                    createHandler = function() {
                        return el['on' + type] = handler;
                    }
                }
        return createHandler();
    };

    /* 使用工具 end  */

    /* 添加的一些方法  */
    // 隐藏
    Object.prototype.hide = function() {
        this.style.display = 'none';
    };

    // 显示
    Object.prototype.show = function(showType) {
        this.style.display = showType;
    }

    /* 方法 end */

    return {
        getXMLHttp: getXMLHttp,
        getEvent: getEvent,
        getTarget: getTarget,
        prevent: prevent,
        stopPropagation: stopPropagation,
        getItem: getItem,
        setItem: setItem,
        getElmById: getElmById,
        addHandler: addHandler,
    }
})();

// 节点查找
var DOM = {
    /* ID */
    tips: Util.getElmById('tips'),
    tipsButton: Util.getElmById('tipsButton'),
    shade: Util.getElmById('shade'),
    followBtn: Util.getElmById('followBtn'),
    followedBtn: Util.getElmById('followedBtn'),
    loginPanel: Util.getElmById('loginPanel'),
    loginClose: Util.getElmById('loginClose'),
    loginButton: Util.getElmById('loginButton'),
    courselContent: Util.getElmById('courselContent'),
    productDesign: Util.getElmById('productDesign'),
    programmingLanguage: Util.getElmById('programmingLanguage'),
    productDesignCard: Util.getElmById('productDesignCard'),
    paging: Util.getElmById('paging'),
    pagPrev: Util.getElmById('pagPrev'),
    pagNext: Util.getElmById('pagNext'),
    videoBox: Util.getElmById('videoBox'),
    videoPanel: Util.getElmById('videoPanel'),
    videoClose: Util.getElmById('videoClose'),
    videoContent: Util.getElmById('videoContent'),
    hotCards: Util.getElmById('hotCards'),

    /* class */
    item: document.getElementsByClassName('item'),
    cur: Util.getElmById('current').getElementsByTagName('span'),
    tab: document.getElementsByClassName('tab'),
    pagButton: Util.getElmById('paging').getElementsByTagName('button'),
}


// 方法

/* 关闭顶部通知条 */

function closeTips(e) {
    Util.prevent(e);
    DOM.tips.hide();
    Util.setItem('closeTips', 1);
}

/* 关注检测 */
function getCookie() {
    var cookieList = document.cookie.split(';');
    for(var i = 1;i<cookieList.length;i++) {
        if(cookieList[i].indexOf('followSuc') != '-1') {
            return '1';
        }else {
            return '-1';
        }
    }
}

function setFollowed() {
    DOM.followBtn.hide();
    DOM.followedBtn.show('inline-block');
}

/* 弹出遮罩以及注册框 */
function followDetect() {
    DOM.shade.show('block');
    DOM.loginPanel.show('block');
    document.body.style.overflow = 'hidden';
}

/* 注册框关闭按钮 */
function closeLogin() {
    DOM.loginPanel.hide();
    DOM.shade.hide();
    document.body.style.overflow = 'auto';
}

/* 登录按钮 */
function loginIn() {
    var userName = md5(Util.getElmById('loginUser').value),
        userPwd = md5(Util.getElmById('loginPassword').value);
    if(userName != '' && userPwd != ''){
    var xml = Util.getXMLHttp();
        xml.onreadystatechange = function() {
            if(xml.readyState == 4 && xml.status == 200) {
                var result = xml.responseText;
                if(result == 1) {
                    alert('登录成功！');
                    closeLogin();
                    setFollowed();
                    document.cookie = 'followSuc=yes';
                }else {
                    alert('账号或密码错误！')
                }
            }
        };
        xml.open('get', 'http://study.163.com/webDev/login.htm?userName='+userName+'&&password='+userPwd, true);
        xml.send();
    }
}

/* 轮播图 */
function coursel() {
    var windowWidth = window.screen.width;
    for(var i =0;i<DOM.item.length;i++) {
        DOM.item[i].style.width = windowWidth + 'px';
    }
    DOM.courselContent.style.width = DOM.item[0].offsetWidth * DOM.item.length + 'px';

    index = 0;
    moveRight = true;
    lastOn = DOM.cur[0];
    autoMoveCoursel= setInterval(moveCoursel, 5000);


    for(var i=0;i<DOM.cur.length;i++) {
        DOM.cur[i].index = i;
        Util.addHandler(DOM.cur[i], 'click', function(e) {
            var target = Util.getTarget(e);
            moveCur(target.index);
            DOM.courselContent.style.left = -DOM.item[this.index].offsetLeft + 'px';
        });
    }
}

function moveCoursel() {
        if(index == 0) moveRight = true;
        if(index == DOM.item.length-1) moveRight = false;

        if(moveRight && index<DOM.item.length-1) {
            index+=1;
            moveCur(index);
            DOM.courselContent.style.left = -DOM.item[index].offsetLeft + 'px';
        }else if(!moveRight && index>0) {
            index-=1;
            moveCur(index);
            DOM.courselContent.style.left = -DOM.item[index].offsetLeft + 'px';
        }
}

function moveCur(index) {
    lastOn.className = '';
    DOM.cur[index].className = 'on';
    lastOn = DOM.cur[index];
}

/* 创建课程列表 和分页器  */
function tabChoose(url) {
    var xml = Util.getXMLHttp();
    if(url) {
       var urlLink = url;
    }else {
       var urlLink = 'http://study.163.com/webDev/couresByCategory.htm?pageNo=1&&psize=40&&type=10';
    }
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            var result = JSON.parse(xml.response);
            for(var i=0;i<result.list.length;i++) {
                var card = document.createElement('div');
                card.className = 'card';
                if(result.list[i].price == 0) {result.list[i].price = '免费'}
                card.innerHTML = "<div class='img-box'>" +
                    "<img src=\'" + result.list[i].bigPhotoUrl + "\'/>" +
                    "</div>" +
                    "<div class='content-box'>" +
                    "<div class='title'>" +
                    "<p>" + result.list[i].name +"</p>" +
                    "</div>" +
                    "<div class='author'>" +
                    "<span>" + result.list[i].provider + "</span>" +
                    "</div>" +
                    "<div class='population'>" +
                    "<span><i></i>" + result.list[i].learnerCount + "</span>" +
                    "</div>" +
                    "<div class='price'>" +
                    "<span>￥" + result.list[i].price + " </span>" +
                    "</div>" +
                    "</div>";
                DOM.productDesignCard.appendChild(card);
            }
            for(var j=0;j<result.totalPage;j++) {
                var li = document.createElement('li');
                var button = document.createElement('button');
                var buttonText = document.createTextNode(j+1);
                button.value = (j+1);
                button.appendChild(buttonText);
                Util.addHandler(button, 'mouseenter', function() {
                    if(this.className.indexOf('cut') != -1) return false;
                    this.className = 'orbit';
                });
                Util.addHandler(button, 'mouseleave', function() {
                    if(this.className.indexOf('cut') != -1) return false;
                    this.className = '';
                });
                Util.addHandler(button, 'click', cutPaging.bind(sorter));
                li.appendChild(button);
                DOM.paging.insertBefore(li, DOM.paging.lastChild);
            }

            DOM.pagButton[0].className = 'cut';
            DOM.pagButton[0].disabled = 'true';
        }
    }
    xml.open('get', urlLink, true);
    xml.send();
}

/* 分页器设置 */
var sorter = {
    hasPut: DOM.productDesign,
    hasCut: DOM.pagButton,
    index: 1,
    changeHasPut: changeHasPut,
    cutPaging: cutPaging,
    movePaging: movePaging,
};

function changeHasPut(e) {
    var event = Util.getEvent(e);
    var target = Util.getTarget(e);

    Util.prevent(event);
    Util.stopPropagation(event);

    this.hasPut.className = 'tab';
    this.hasPut.removeAttribute('disabled');
    this.hasPut = target;
    this.hasPut.className = 'tab pitch';
    this.hasPut.setAttribute('disabled', 'true');
    this.index = 1;

    changeSorter(this.hasPut);
}

function changeSorter(hasPut) {
    switch (hasPut.id) {
        case 'productDesign': var type = 10;break;
        case 'programmingLanguage': var type = 20;break;
        default: type = 10;break;
    }

    for(var l = 0;l<DOM.pagButton.length;l++) {
        DOM.pagButton[l].className = '';
        DOM.pagButton[l].removeAttribute('disabled');
    }

    DOM.pagButton[0].className = 'cut';
    DOM.pagButton[0].setAttribute('disabled', 'true');

    var url = "http://study.163.com/webDev/couresByCategory.htm?pageNo=1" +
            "&&psize=40&&type=" +
        type+"";

    var xml = Util.getXMLHttp();
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            var result = JSON.parse(xml.responseText);
            DOM.productDesignCard.innerHTML = '';
            for(var i=0;i<result.list.length;i++) {
                if(result.list[i].price == 0) {result.list[i].price = '免费'}
                var card = "<div class='card'><div class='img-box'>" +
                    "<img src=\'" + result.list[i].bigPhotoUrl + "\'/>" +
                    "</div>" +
                    "<div class='content-box'>" +
                    "<div class='title'>" +
                    "<p>" + result.list[i].name +"</p>" +
                    "</div>" +
                    "<div class='author'>" +
                    "<span>" + result.list[i].provider + "</span>" +
                    "</div>" +
                    "<div class='population'>" +
                    "<span><i></i>" + result.list[i].learnerCount + "</span>" +
                    "</div>" +
                    "<div class='price'>" +
                    "<span>￥" + result.list[i].price + " </span>" +
                    "</div>" +
                    "</div></div>";
                DOM.productDesignCard.innerHTML += card;
            }
        }
    }
    xml.open('get', url, true);
    xml.send();

}

function cutPaging(e) {
    var event = Util.getEvent(e);
    var target = Util.getTarget(e);

    Util.prevent(event);
    Util.stopPropagation(event);
    var type;
    switch(this.hasPut.id) {
        case 'productDesign': type = 10;break;
        case 'programmingLanguage': type = 20; break;
        default: type = 10;break;
    }

    for(var k=0;k<this.hasCut.length;k++) {
        if(this.hasCut[k].className == 'cut') {
            this.hasCut[k].className = '';
            this.hasCut[k].removeAttribute('disabled');
        }
    }

    target.className = 'cut';
    target.setAttribute('disabled', 'true');

    this.index = e.target.value;
    var url = "http://study.163.com/webDev/couresByCategory.htm?pageNo=" + this.index +
        "&&psize=40&&type=" + type;
    var xml = Util.getXMLHttp();
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            var result = JSON.parse(xml.responseText);
            DOM.productDesignCard.innerHTML = '';
            for(var i=0;i<result.list.length;i++) {
                if(result.list[i].price == 0) {result.list[i].price = '免费'}
                var card = "<div class='card'><div class='img-box'>" +
                    "<img src=\'" + result.list[i].bigPhotoUrl + "\'/>" +
                    "</div>" +
                    "<div class='content-box'>" +
                    "<div class='title'>" +
                    "<p>" + result.list[i].name +"</p>" +
                    "</div>" +
                    "<div class='author'>" +
                    "<span>" + result.list[i].provider + "</span>" +
                    "</div>" +
                    "<div class='population'>" +
                    "<span><i></i>" + result.list[i].learnerCount + "</span>" +
                    "</div>" +
                    "<div class='price'>" +
                    "<span>￥" + result.list[i].price + " </span>" +
                    "</div>" +
                    "</div></div>";
                DOM.productDesignCard.innerHTML += card;
            }
        }
    }
    xml.open('get', url, true);
    xml.send();

}

function movePaging(e) {
    var event = Util.getEvent(e);
    var target = Util.getTarget(e);

    Util.prevent(event);
    Util.stopPropagation(event);

    var type;
    switch(this.hasPut.id) {
        case 'productDesign': type = 10;break;
        case 'programmingLanguage': type = 20; break;
        default: type = 10;break;
    }

    switch(target.id) {
        case 'pagPrev':
            if(this.index == 1) return false;
            DOM.pagButton[this.index-1].className = '';
            DOM.pagButton[this.index-1].removeAttribute('disabled');
            DOM.pagButton[this.index-2].className = 'cut';
            DOM.pagButton[this.index-2].setAttribute('disabled', 'true');
            this.index-=1;break;
        case 'pagNext':
            if(this.index == DOM.pagButton.length) return false;
            DOM.pagButton[this.index-1].className = '';
            DOM.pagButton[this.index-1].removeAttribute('disabled');
            DOM.pagButton[this.index].className = 'cut';
            DOM.pagButton[this.index].setAttribute('disabled', 'true');
            this.index+=1;break;
        default: ; break;
    }


    var url = "http://study.163.com/webDev/couresByCategory.htm?pageNo=" + this.index +
        "&&psize=40&&type=" + type;
    var xml = Util.getXMLHttp();
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            var result = JSON.parse(xml.responseText);
            DOM.productDesignCard.innerHTML = '';
            for(var i=0;i<result.list.length;i++) {
                if(result.list[i].price == 0) {result.list[i].price = '免费'}
                var card = "<div class='card'><div class='img-box'>" +
                    "<img src=\'" + result.list[i].bigPhotoUrl + "\'/>" +
                    "</div>" +
                    "<div class='content-box'>" +
                    "<div class='title'>" +
                    "<p>" + result.list[i].name +"</p>" +
                    "</div>" +
                    "<div class='author'>" +
                    "<span>" + result.list[i].provider + "</span>" +
                    "</div>" +
                    "<div class='population'>" +
                    "<span><i></i>" + result.list[i].learnerCount + "</span>" +
                    "</div>" +
                    "<div class='price'>" +
                    "<span>￥" + result.list[i].price + " </span>" +
                    "</div>" +
                    "</div></div>";
                DOM.productDesignCard.innerHTML += card;
            }
        }
    }
    xml.open('get', url, true);
    xml.send();
}

/* 视频 */
function showVideo() {
    DOM.shade.show('block');
    DOM.videoPanel.show('block');
    var videoPanelWidth = DOM.videoPanel.offsetWidth + 'px';
    var videoPanelHeight = DOM.videoPanel.offsetHeight + 'px';
    DOM.videoContent.setAttribute('width', videoPanelWidth);
    DOM.videoContent.setAttribute('height', videoPanelHeight);
    document.body.style.overflow = 'hidden';
}

function closeVide() {
    DOM.shade.hide();
    DOM.videoPanel.hide();
    document.body.style.overflow = 'auto';
}

/* 排行榜 */
function getHot() {
    var i = 0;
    var autoHot = setTimeout(function() {

    xml = Util.getXMLHttp();
    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && xml.status == 200) {
            DOM.hotCards.innerHTML = '';
            var result = JSON.parse(xml.responseText);
            for (; i < result.length; i++) {
                if (i == 10) return i += 1;
                DOM.hotCards.innerHTML += "<div class='card'><div class='card-image'><img src='" + result[i].bigPhotoUrl + "'></div>" +
                    "<div class='card-content'>" +
                    "<div class='title'>" + result[i].name + "</div>" +
                    "<div class='population'>" +
                    "<span><i></i>" + result[i].learnerCount + "</span>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                if (i == 19) return i = 0;
            }
        }
    }
    xml.open('get', 'http://study.163.com/webDev/hotcouresByCategory.htm', true);
    xml.send();

    setTimeout(arguments.callee, 5000);
    },100);
}

// end

var init = function() {
    // 顶部通知条
    var closeState = Util.getItem('closeTips');
    closeState == 1? DOM.tips.hide() : Util.addHandler(DOM.tipsButton, 'click', closeTips);

    // 关注

    /* 初始判断 */
    if(getCookie() == '1') {
        setFollowed();
    } else {
        Util.addHandler(DOM.followBtn, 'click', followDetect);
    }

    /* 关闭注册按钮 */
    Util.addHandler(DOM.loginClose, 'click', closeLogin);

    /* 登录按钮 */
    Util.addHandler(DOM.loginButton, 'click', loginIn);

    /* 轮播图 */
    coursel();

    Util.addHandler(DOM.courselContent, 'mouseover', function() {
        clearInterval(autoMoveCoursel);
    });
    Util.addHandler(DOM.courselContent, 'mouseout', function() {
        autoMoveCoursel= setInterval(moveCoursel, 5000);
    });

    /* 初始课程列表 */
    tabChoose();

    /* sorter */
    Util.addHandler(DOM.productDesign, 'click', sorter.changeHasPut.bind(sorter));
    Util.addHandler(DOM.programmingLanguage, 'click', sorter.changeHasPut.bind(sorter));

    /*  分页器左右 */
    Util.addHandler(DOM.pagPrev, 'click', sorter.movePaging.bind(sorter));
    Util.addHandler(DOM.pagNext, 'click', sorter.movePaging.bind(sorter));

    /* video */
    Util.addHandler(DOM.videoBox, 'click', showVideo);
    Util.addHandler(DOM.videoClose, 'click', closeVide);

    /* hot */
    getHot();
};

init();