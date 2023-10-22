import React, { useRef, useEffect } from "react";
import { createChart, IChartApi, ColorType } from "lightweight-charts";

interface PortfolioAreaChartProps {
  // Define any props you might want to pass in the future here
}

const PortfolioAreaChart: React.FC<PortfolioAreaChartProps> = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  let chart: IChartApi | null = null;

  useEffect(() => {
    // Ensure the ref is set and the chart isn't already instantiated
    if (chartContainerRef.current && !chart) {
      const chartOptions = {
        layout: {
          textColor: "#D9D9D9",
          background: {
            type: ColorType.Solid,
            color: "#0d121e",
          },
        },
        grid: {
          vertLines: {
            color: "#0d121e",
          },
          horzLines: {
            color: "#0d121e",
          },
        },
        width: 780,
        height: 350,
        priceFormat: {
          type: "custom",
          formatter: (price: number) => `$${price}`,
        },
      };

      chart = createChart(chartContainerRef.current, chartOptions);
      const areaSeries = chart.addAreaSeries({
        lineColor: "#758696",
        topColor: "rgba(117, 134, 150, 0.28)",
        bottomColor: "rgba(117, 134, 150, 0.05)",
        lineWidth: 2,
      });

      // Dummy data with 'YYYY-MM-DD' format for the time property
      const data = [
        { value: 0, time: "2022-01-16" },
        { value: 0, time: "2022-01-17" },
        { value: 1000, time: "2022-01-18" },
        { value: 5732.23, time: "2022-01-19" },
        { value: 21246.3, time: "2022-01-20" },
        { value: 19362.29, time: "2022-01-21" },
        { value: 24834.98, time: "2022-01-22" },
        { value: 38904.23, time: "2022-01-23" },
        { value: 37126.34, time: "2022-01-24" },
        { value: 45727.97, time: "2022-01-25" },
      ];

      areaSeries.setData(data);
      chart.timeScale().fitContent();
    }

    // Cleanup function to remove the chart when the component is unmounted
    return () => {
      if (chart) {
        chart.remove();
        chart = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-full flex items-center justify-center"
    ></div>
  );
};

export default PortfolioAreaChart;
