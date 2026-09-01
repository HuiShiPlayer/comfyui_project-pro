$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('pie'));

    var option = {
        title : {
            text: '某站点用户访问来源',
            x:'left',
            textStyle: {
                fontFamily: 'microsoft yahei',
                fontWeight: '300',
                color: '#333'          // 主标题文字颜色
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'right',
            data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
            }

        ],
        color: ['#26c9ec','#fb9678','#7077b7','#24a6f3','#a5cce3']
    };





    // 为echarts对象加载数据
    myChart.setOption(option);

})