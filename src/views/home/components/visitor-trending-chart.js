import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Card } from "antd";
import { queryDayViews } from "@/services/data";

function VisitorTrendingChart() {
  const chartRef = useRef(null);
  const [xAxisData,setXAxisData] = useState([])
  const [seriesData, setSeriesData] = useState([])

  useEffect(() => {
    const defaultOptions = {
      grid: {
      // Drawing grid in Cartesian coordinate system
        left: '5%',
        right: '5%',
        top: '5%',
        bottom: '10%',
      },
      tooltip: {
        trigger: 'axis',
        show: true,
      },
      legend: {
       // Legend
       show: false, // Whether to display the legend
       bottom: 0, // 0 means display to the bottom
       data: [], // legend name item
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: 'rgba(171, 193, 241, 1)',
          fontSize: '14px',
        },
        itemGap: 46, // The interval between each item in the legend
      },
    }
    const chart = echarts.init(chartRef.current);

    function resizeChart() {
      chart.resize();
    }

    window.addEventListener("resize", resizeChart);

    chart.setOption({
      ...defaultOptions,
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: seriesData,
          type: "line",
        },
      ],
    });

    return () => {
      chart.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [xAxisData,seriesData]);

  useEffect(()=>{
    async function getData(){
      const res = await queryDayViews()
      const {code,data} = res
      if (code === 200) {
         const xData =  Object.keys(data)
         setXAxisData(xData)
         const sData = xData.map(key=>data[key])
         setSeriesData(sData)
      }
    }
    getData()
  },[])

  return (
    <Card title="trend analysis">
      <div ref={chartRef} style={{ width: "100%", height: "300px" }}></div>
    </Card>
  );
}

export default VisitorTrendingChart;
