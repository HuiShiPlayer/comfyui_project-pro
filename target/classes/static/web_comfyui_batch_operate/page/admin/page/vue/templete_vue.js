/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		param:"",
		/* 分页数据 */
		list:[],
		data:{},
		total:20,
		pageNum:1,
		pages:2,
		
		/* 操作类型 0添加操作，1修改操作*/
		type:0,
	},
	methods: {
		select: function(num) {
			main.search();
			main.pageNum = 1;
			/* 初始化分页插件 */
			$('#pagebox').html("");
			$('#pagebox').html('<div class="M-box1"  style="float: right; margin-top: 10px"></div>');
			$('.M-box1').pagination({
				totalData: main.total,
				pageCount: main.pages,
				coping: true,
				current: main.pageNum,
				callback: function(index) {
					main.search(index)
				}
			});
		},
		/*查询*/
		search: function(num) {
			var that = this;
			that.param.pageNum = num;
			/* 初始化假数据 */
			for(var i =0;i<10;i++){
				var item={
					name:"zy"+i,
					age:i*i,
					createTime:"2020-08-25",
					type: i%2==0?0:1
				}
				/* 添加到数组 */
				that.list.push(item);
			}
			/* 初始化分页插件数据 */
			that.total=20;
			that.pages=2;
			that.pageNum=1;
			

			// $.ajax({
			// 	type: "post",
			// 	url: app.base_path_contact_system + "/后台路径",
			// 	data: that.param,
				/* 跨域操作开始 */
				// xhrFields: {
				// 	withCredentials: true
				// },
				// crossDomain: true,
				/* 跨域操作结束 */
				// success: function(res) {
					
				// }
			// });
			
		},
		deleteItem(item,index){
			/* 重数组中删除数据 */
			this.list.splice(index,1);
		},
		setItem(item){
			this.data =item;
			this.type =1;
		},
		restform(){
			//重置数据
			this.data ={};
			this.type =0;
		},saveData(){
			if(this.type == 0){//走添加ajax
				
			}else{//走修改ajax
				
			}
			alert_warning("参数有问题")
			alert_error("操纵失败")
			alert_success("操作成功")
			
		}
	}
})
main.select(1);
/*页码渲染*/
