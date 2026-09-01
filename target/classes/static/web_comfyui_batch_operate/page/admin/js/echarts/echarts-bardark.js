$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('bardark'));

     var option = {
         backgroundColor: '#1b1b1b',
         tooltip : {
             trigger: 'axis',
             textStyle: {
                 fontFamily: 'microsoft yahei',
                 fontWeight: '300',
                 color: '#fff'          // 主标题文字颜色
             }
         },
         legend: {
             itemWidth: 10,
             itemHeight: 10,
             data:['本季度', '上季度'],
             x : 'right',
             textStyle: {
                 color: '#fff',        // 图例文字颜色
                 fontFamily:'微软雅黑',
             }
         },
         grid: {//其中(x,y)针对左上角图的位置调整，(x2,y2)针对左下角。
             y: 60,
             x:55,

             borderWidth:0//此处去掉那个白色边框
         },

         calculable : false,
         xAxis : [
             {
                 type : 'value',
                 boundaryGap : [0, 0.01],
                 axisLabel: {
                     show: true,
                     textStyle: {
                         color: '#fff',
                         fontFamily:'微软雅黑',
                     }
                 },
                 axisLine:{ lineStyle:{ color:'transparent' } },
                 splitLine:{show: false},
                 
             }
         ],
         yAxis : [
             {
                 type : 'category',
                 data : ['云南','海南','北京'],
                 axisLabel: {
                     show: true,
                     textStyle: {
                         color: '#fff',
                         fontFamily:'微软雅黑',
                     }
                 },
                 splitLine:{show: false},
                 axisLine:{ lineStyle:{ color:'#ff906b' } },

             }
         ],
         series : [
             {
                 name:'上季度',
                 type:'bar',

                 data:[48203, 23489, 29034, ],
                 itemStyle: {normal: {color:'#ff906b'}},
                 barWidth: 10,//固定柱子宽度
             },
             {
                 name:'本季度',
                 type:'bar',
                 data:[49325, 23438, 31000, ],
                 itemStyle: {normal: {color:'#b0e76f'}},
                 barWidth: 10,//固定柱子宽度
             }
         ]
     };




    // 为echarts对象加载数据
    myChart.setOption(option);

})