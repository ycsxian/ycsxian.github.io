// head
(function(w){
	String.prototype.format = function () {
	    for (var temS = this, i = 0; i < arguments.length; ++i) {
	        temS = temS.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
	    }
	    return temS;
	};

	String.prototype.setCookie = function (value, expiryDays, domain, path, secure) {
	    var builder = [this, "=", escape(value)];
	    if (expiryDays) {
	        var date = new Date();
	        date.setTime(date.getTime() + (expiryDays * 86400000));
	        builder.push(";expires=");
	        builder.push(date.toUTCString());
	    }
	    if (domain) {
	        builder.push(";domain=");
	        builder.push(domain);
	    }
	    if (path) {
	        builder.push(";path=");
	        builder.push(path);
	    }
	    if (secure) { builder.push(";secure"); }

	    document.cookie = builder.join("");
	};
	String.prototype.getCookie = function () {
	    var re = new RegExp('\\b' + this + '\\s*=\\s*([^;]*)', 'i');
	    var match = re.exec(document.cookie);
	    return (match && match.length > 1 ? unescape(match[1]) : '');
	};

	String.prototype.delCookie = function (domain,path)
	{
	    document.cookie = this + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain?"; domain="+domain:"") + (path?"; path="+path:"");
	};


	w.pageInfo = {};

	var useragent = w.navigator.userAgent;

	// 判断是否online版中
	pageInfo.isOnline =  !/(iphone|ios|android|mini|mobile|mobi|Nokia|Symbian|iPod|iPad|ws\s+Phone|MQQBrowser|wp7|wp8|UCBrowser7|UCWEB|360\s+Aphone\s+Browser)/i.test(useragent);

	// 判断是否在app中
	pageInfo.isInApp = useragent.indexOf('CtripWireless') >= 0 ;
	// pageInfo.isInGongLveApp=useragent.indexOf('gs_wireless')>=0;
	if(typeof (w.localStorage) != "undefined"){
		pageInfo.isInApp = pageInfo.isInApp || w.localStorage.getItem('isInApp') == '1' || w.localStorage.getItem('ISINAPP') == '1';
	}
	pageInfo.isIE = useragent.indexOf('MSIE') >= 0;
	pageInfo.isInWeinxin = !!useragent.match(/micromessenger/i);

	if(pageInfo.isInApp){
		pageInfo.device = 'app';
	}else if(pageInfo.isOnline){
		pageInfo.device = 'online';
	}else {
		pageInfo.device = 'h5';
	}

		// //插入ubt采集代码，分为PC端与移动端
    if(pageInfo.isOnline){
    	(function(){if(!(window.$_bf&&window.$_bf.loaded||window.$LAB||window.CtripJsLoader)){var a=new Date,b=!1,c="?v="+a.getFullYear()+a.getMonth()+"_"+a.getDate(),a=document.createElement("script");a.type="text/javascript";a.charset="utf-8";a.async=!0;try{b="https:"==location.protocol}catch(d){}a.src=((b?"https:":"http:"))+"//webresource.c-ctrip.com/code/ubt/_bfa.min.js"+c;b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}})();
	}else {
		(function(){if(!window.$_bf||!window.$_bf.loaded){var a=new Date,b="?v="+a.getFullYear()+a.getMonth()+"_"+a.getDate(),a=document.createElement("script");a.type="text/javascript";a.charset="utf-8";a.async=!0;a.src="//webresource.c-ctrip.com/code/ubt/_mubt.min.js"+b;b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}})();
	}


	// 修改页面head信息
	// if(document.title === ''){
	//     document.title = CTPublicOptions.title;
	// }

})(window);


(function (w) {
	w.othersway = '';
    var strs = window.location.search.split("&");

    for (var i = 0; i < strs.length; i++) {
        if (strs[i].indexOf('referrer') !== -1) {
            othersway = strs[i].split("=")[1];
        }
    }

})(window);



// online公用头配置
var globalConfig = {
	//bt类型，默认为default,没有一二级频道选中，若需选中一二频道请联系（R&D 基础业务 用户中心-用户组成员）
	BusinessType: 'default',
	//环境选'other'即可
	Environment: 'other',
	// NeedNav:'0',
	Version:''  //3.0对应响应式版本

};