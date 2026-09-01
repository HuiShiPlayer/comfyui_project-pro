/*同步Ajax*/
$.ajaxSetup({
	async: false
});

var main = new Vue({
	el: "#main",
	data: {
		name:null,
		/* 分页数据 */
		list:[],
		data:{},
		total:1,
		pageNum:1,
		pages:1,
		
		/* 操作类型 0添加操作，1修改操作*/
		index:0,
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
			var data ={
				pageNum:num,
			}
			if(!app.isBlank(that.name)){
				data.name = that.name
			}
			
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/taskC/selectByPage",
				data: data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						that.list = res.data.records
						that.total = res.data.total;
						that.pageNum = res.data.current;
						that.pages = res.data.pages;
					} else {
						that.list = []
						that.total = 0;
						that.pageNum = 1;
						that.pages = 1;
					}
					
				}
			});
			
		},
		deleteItem(){
			var that =this
			
			/* 重数组中删除数据 */
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/task/delete",
				data: {taskId:that.data.taskId},
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						that.list.splice(that.index,1);
						alert_success("操作成功")
					} else {
						alert_error("操作失败")
					}
					
				}
			});
			/* 重数组中删除数据 */
			
		},
		setItem(item,index){
			this.data =item;
			this.index =index;
		},
		
	}
})
main.select(1);
/*页码渲染*/
