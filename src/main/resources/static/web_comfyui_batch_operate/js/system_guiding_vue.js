/*同步Ajax*/
$.ajaxSetup({
	async: false
});
var systemGuidings = new Vue({
	el: "#systemGuidingMain",
	data: {
		systemGuidings: [], //数据列表
		total: 0, //数据总数	
		pages: 0, //页码总数
		pageNum: 0, //当前页吗
		value: '',
		systemGuiding: {} //当前根据ID修改或查询的操作人员
	},
	methods: {
		select:function(num, field, value, order){			
			           systemGuidings.search();
				       systemGuidings.pageNum=1;				      
			           $('#pagebox').html("");
					   $('#pagebox').html('<div class="M-box1"  style="float: right; margin-top: 10px"></div>');
					   $('.M-box1').pagination({
						totalData: systemGuidings.total,
						pageCount: systemGuidings.pages,
						coping: true,
						current: systemGuidings.pageNum,						
						callback: function(index){ 
					    if(systemGuidings.pageNum!=1){
						systemGuidings.search(index, null, null, null)	
					      }											
						}
											
					});
				
		},
		search: function(num, field, value, order) { //查询页吗，模糊匹配字段(多字段用&拼接)，字段对应的数据值，排序字段
			var that = this;
			var param = {};
			param.pageNum = num
			
				param.field = field
				param.value = this.value
		
			if(!app.isBlank(order)) {
				param.order = order
			}
			$.ajax({
				url: app.base_path_contact_system + "/selectSystemInfoListOfUserGuide",
				type: "POST",
				data: param,
				/*cookie 跨域问题*/
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				success: function(res) {
					if(res.status == app.RES_OK) {
						systemGuidings.systemGuidings = res.data.records;
						systemGuidings.total = res.data.total;
						systemGuidings.pageNum = res.data.current;
						systemGuidings.pages = res.data.pages;

					} else {
						systemGuidings.systemGuidings = []
						systemGuidings.total = 0;
						systemGuidings.pageNum = 1;
						systemGuidings.pages = 1;
					}
					
					
				}
			});
		},
		/*删除用户指南*/
		deletesystemGuiding: function(index, systemInfoListId) {
			$.ajax({
				url: app.base_path_contact_system + "/deleteSystemInfoListOfUserGuide",
				type: "POST",
				data: {
					id: systemInfoListId
				},
				/*cookie 跨域问题*/
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				success: function(res) {
					if(res.status == app.RES_OK) {
						/*前端跟随删除list中数据*/
						systemGuidings.systemGuidings.splice(index, 1);
					}else{
						alert_warning("操作失败!");
					}
				}
			});			
		},
		updatesystemGuiding:function(systemInfoListId){
			//跳页传值,把值放在sessionStorage里面
			sessionStorage.setItem("systemInfoListId",systemInfoListId);
			sessionStorage.setItem("type","1");			
    		location.href = "#/system_add_user_guiding"
		}
	}
});

function addsystemGuiding(){
	sessionStorage.setItem("type","2");
	sessionStorage.setItem("systemInfoListType","4");
	location.href ="#/system_add_user_guiding"
}

/*首次渲染页面*/
systemGuidings.search(1, null, null, null);
/*页码渲染*/

$('.M-box1').pagination({
			totalData: systemGuidings.total,
			pageCount: systemGuidings.pages,
			coping: true,
			current: systemGuidings.pageNum,
			callback: function(index) {	
			systemGuidings.search(index, null, null, null)
	},
});