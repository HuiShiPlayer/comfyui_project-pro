// 1.获取页面对应的元素
var box = document.getElementById("boxpreview"); //最外部大盒子
var arr = document.getElementById("arr");
var screen = document.getElementById("screenpreview"); //轮播图显示区域div
var ul = document.getElementById("ulpreview"); //显示图片的ul
var left = document.getElementById("left"); //上一张箭头
var right = document.getElementById("right"); //下一张箭头
var index = 0; ////声明一个变量记录图片的索引，默认第0张图片

//2.给box添加鼠标移入和移出事件
//2.1 鼠标移入
box.onmouseover = function() {
	arr.style.display = "block"; //显示上一页下一页箭头
	clearInterval(timeId); //清除定时器（即鼠标移入时，图片要停止自动轮播）
};
//2.2 鼠标移出
box.onmouseout = function() {
	arr.style.display = "none"; //隐藏箭头
	timeId = setInterval(scroll, 2000); //重启定时器（鼠标移出，图片要恢复自动轮播）
};

//3.给上一页下一页箭头添加点击事件
//3.1 下一页，图片向左轮播
right.onclick = function() {
	scroll();
};
//3.2 上一页，图片向右轮播
left.onclick = function() {
	//(1)边界检测，如果当前已经是第一张，则不做任何处理
	if (index == 0) {
		//无限轮播原理：如果当前是第一张，则偷偷修改ul的位置是最后一张(第一张与最后一张是同一张图片)
		index = ul.children.length - 1; //index恢复到最后一张
		ul.style.left = -index * screen.offsetWidth + "px"; ////ul回到最后一张位置
	}
	//(2)索引自减
	index--;
	// (3)向左移动ul：目标距离 = -screen的宽度 * 索引
	animationMove(ul, -index * screen.offsetWidth, 10);
	// indexShow(); //同步页码样式
};


var timeId = setInterval(scroll, 2000);
// 封装一个向右轮播的函数
function scroll() {
	//（1）边界检测：如果当前已经是最后一张(第n+1张,n代表需要轮播的图片数量)
	if (index == ul.children.length - 1) {
		//无限轮播的原理就是滚动到最后一张的时候，偷偷快速的改变ul的位置到第一张(不要任何动画，一瞬间改变)            
		index = 0; //index恢复到0
		ul.style.left = 0 + "px"; //ul回到初始位置
	}
	// (2)索引自增
	index++;
	// (3)向右移动ul：目标距离 = -screen的宽度 * 索引
	animationMove(ul, -index * screen.offsetWidth, 10);
	// indexShow(); //同步页码样式
}
// 封装一个滚动动画函数
function animationMove(obj, target, speed) {
	clearInterval(obj.timeId); //每次执行动画先清除原有的定时器
	obj.timeId = setInterval(function() {
		var currentLeft = obj.offsetLeft; //获取当前位置
		var isLeft = currentLeft > target ? true : false; //是否往左走
		if (isLeft) {
			currentLeft -= 10; //往左走
		} else {
			currentLeft += 10; //往右走
		}
		if (isLeft ? currentLeft > target : currentLeft < target) {
			obj.style.left = currentLeft + "px"; //如果当前位置不是在目标位置则进行位置处理
		} else {
			clearInterval(obj.timeId);
			obj.style.left = target + "px";
		}
		// if(currentLeft>target){
		//     currentLeft-=10;
		//     obj.style.left=currentLeft+"px";
		// }else if(currentLeft<target){
		//     currentLeft+=10;
		//     obj.style.left=currentLeft+"px";
		// }else{
		//     clearInterval(obj.timeId);
		//     obj.style.left=target+"px";
		// }
	}, speed);
}



