define(function(){
	//配置文件，配置项目用到的业务模块
	var componentBanner = function (r) {
        require.ensure([], function () {
            return r(require('./modules/Banner.vue'));
        }, 'banner');
    };

    var componentCoupon = function (r) {
        require.ensure([], function () {
            return r(require('./modules/Coupon.vue'));
        }, 'coupon');
    };

    var componentProductlist = function (r) {
        require.ensure([], function () {
            return r(require('./modules/Productlist.vue'));
        }, 'product');
    };

    var componentSingleproduct = function (r) {
        require.ensure([], function () {
            return r(require('./modules/Singleproduct.vue'));
        }, 'singleproduct');
    };

    var componentPagegraphicdetail = function (r) {
        require.ensure([], function () {
            return r(require('./modules/PageGraphicDetail.vue'));
        }, 'pagegraphicdetail');
    };

    var componentbtnMore = function (r) {
        require.ensure([], function () {
            return r(require('./modules/btnMore.vue'));
        }, 'btnMore');
    };

    var componentfooterLink = function (r) {
        require.ensure([], function () {
            return r(require('./modules/footerLink.vue'));
        }, 'footerLink');
    };

    var componentsAll={

        'componentBanner':componentBanner,
        'componentCoupon':componentCoupon,
        'componentSingleproduct':componentSingleproduct,
        'componentPagegraphicdetail':componentPagegraphicdetail,
        'componentProductlist':componentProductlist,
        'componentbtnMore':componentbtnMore,
        'componentfooterLink':componentfooterLink

    };

    //本项目用的业务模块，和上面引用vue一一对应
    var componentsConfig = {
        componentsAll,
        componentBanner,
        componentCoupon,
        componentSingleproduct,
        componentPagegraphicdetail,
        componentProductlist,
        componentbtnMore,
        componentfooterLink
    };

    return componentsConfig;
});
