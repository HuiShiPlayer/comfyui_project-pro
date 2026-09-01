$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('radar'));

    var option = {
        title : {
            text: '雷达图',
            textStyle: {
                fontFamily: 'microsoft yahei',
                fontWeight: '300',
                color: '#333'          // 主标题文字颜色
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            x:'center',
            y:'bottom',
            data:['罗纳尔多','舍普琴科']
        },
        calculable : true,
        polar : [
            {
                indicator : [
                    {text : '进攻', max  : 100},
                    {text : '防守', max  : 100},
                    {text : '体能', max  : 100},
                    {text : '速度', max  : 100},
                    {text : '力量', max  : 100},
                    {text : '技巧', max  : 100}
                ],
                radius : 110
            }
        ],
        series : [
            {
                name: '完全实况球员数据',
                type: 'radar',


                data : [
                    {
                        value : [97, 42, 88, 94, 90, 86],
                        name : '舍普琴科',
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    color: 'rgba(252,150,120,0.5)'
                                },
                                color:'#fb9678'
                            }
                        }
                    },
                    {
                        value : [97, 32, 74, 95, 88, 92],
                        name : '罗纳尔多',
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    color: 'rgba(38,201,236,0.5)'
                                },
                                color:'#26c9ec'
                            }
                        }

                    }
                ]
            }
        ],
        color: ['#26c9ec','#fb9678']
    };





    // 为echarts对象加载数据
    myChart.setOption(option);

})