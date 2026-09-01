$(function() {
    // 基于准备好的dom，初始化echarts图表


    var option1 = {
        color:[ '#87cefa','#fad860','#b0e76f','#ff906b'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        calculable: true,
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '30%',
                center: ['60%', 150],
                padding:'0',
                data: [
                    {value: 20, name: '云机房'},
                    {value: 11, name: '办公区域'},

                    {value: 9, name: '其他'},
                    {value: 60, name: '超算机房'},
                ],

            }
        ]
    };


    var option2 = {
        color:[ '#ff906b','#87cefa','#fad860','#b0e76f'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data:['超算机房','云机房','办公区域','其他'],
            itemWidth: 10,
            itemHeight: 10,
            x : 'right',
            textStyle: {
                color: '#fff',        // 图例文字颜色
                fontFamily:'微软雅黑',
            }
        },
        calculable: true,
        xAxis: [
            {
                center: ['60%', 150],
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisLine:{ lineStyle:{ color:'transparent' } },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontFamily:'微软雅黑',
                    }
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show: true},
                axisLine:{ lineStyle:{ color:'transparent' } },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontFamily:'微软雅黑',
                    }
                },
            }
        ],
        grid: {
            x2:0
        },
        series: [
            {
                name: '超算机房',
                type: 'bar',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '云机房',
                type: 'bar',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '办公区域',
                type: 'bar',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '其他',
                type: 'bar',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
        ]
    };
    myChart = echarts.init(document.getElementById('macar1'));
    myChart2 = echarts.init(document.getElementById('macar2'));
    myChart2.setOption(option2);
    myChart.setOption(option1);

    myChart.connect(myChart2);
    myChart2.connect(myChart);

    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
            myChart2.resize();
        }
    }, 200)




});