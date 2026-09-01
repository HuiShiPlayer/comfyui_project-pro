/**
 * Created by Administrator on 2016/11/10.
 */
$(function() {
	$(".editor").click(function() {
		$(".content").load("js/utf8-jsp/index.html")
	})
});

angular.module("main", [
	"ui.router", //添加ui-router模块依赖
	"controllers" //控制器模块
])
.run(["$rootScope", function($rootScope) {
    // ui-router 切换路由前，主动销毁当前页面挂载的 Vue 实例
    $rootScope.$on("$stateChangeStart", function() {
        var el = document.getElementById("main");
        if (el && el.__vue__) {
            el.__vue__.$destroy(); // 触发 beforeDestroy
        }
    });
}])


.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	//在这里配置状态
	$stateProvider
		.state('main', {
			url: "/main",
			templateUrl: "./main.html"
		})		
		.state('generate_image', {
			url: "/generate_image",
			templateUrl: "./page/generate_image.html",
		})
		.state('t2v', {
			url: "/t2v",
			templateUrl: "./page/t2v.html"
		}).state('i2v', {
			url: "/i2v",
			templateUrl: "./page/i2v.html"
		})
		.state('start-end', {
			url: "/start-end",
			templateUrl: "./page/start-end.html"
		})
		.state('config', {
			url: "/config",
			templateUrl: "./page/config.html"
		})	
		.state('api', {
			url: "/api",
			templateUrl: "./page/api.html"
		})
		.state('task_c', {
			url: "/task_c",
			templateUrl: "./page/task_c.html"
		})
		.state('task_a', {
			url: "/task_a",
			templateUrl: "./page/task_a.html"
		})
		.state('singleImage2Image', {
			url: "/singleImage2Image",
			templateUrl: "./page/singleImage2Image.html"
		})
		.state('twoImages2Image', {
			url: "/twoImages2Image",
			templateUrl: "./page/twoImages2Image.html"
		})
		.state('threeImages2Image', {
			url: "/threeImages2Image",
			templateUrl: "./page/threeImages2Image.html"
		})
		.state('prompt', {
			url: "/prompt",
			templateUrl: "./page/prompt.html"
		})
		.state('MulImages2Image', {
			url: "/MulImages2Image",
			templateUrl: "./page/MulImages2Image.html"
		}).state('referenceImageAndfVideo', {
			url: "/referenceImageAndfVideo",
			templateUrl: "./page/referenceImageAndfVideo.html"
		})
		.state('getImageFromVideo', {
			url: "/getImageFromVideo",
			templateUrl: "./page/getImageFromVideo.html"
		})
		.state('digital_human', {
			url: "/digital_human",
			templateUrl: "./page/digital_human.html"
		})
		.state('audio_editing', {
			url: "/audio_editing",
			templateUrl: "./page/audio_editing.html"
		})
		.state('soudsData', {
			url: "/soudsData",
			templateUrl: "./page/soudsData.html"
		})
		.state('mulImages2Vedio', {
			url: "/mulImages2Vedio",
			templateUrl: "./page/mulImages2Vedio.html"
		})
		.state('threeImage2Vedio', {
			url: "/threeImage2Vedio",
			templateUrl: "./page/threeImage2Vedio.html"
		})
		.state('ResourceLibrary', {
			url: "/ResourceLibrary",
			templateUrl: "./page/ResourceLibrary.html"
		})
		
	// 将未匹配的url重定向到state1状态中。
	$urlRouterProvider.otherwise("/main");
}])
