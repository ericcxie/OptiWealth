import {
  ColorType,
  IChartApi,
  ISeriesApi,
  createChart,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

interface PortfolioAreaChartProps {
  portfolioHistory: Array<{ time: string; value: number }>;
}

const PortfolioAreaChart: React.FC<PortfolioAreaChartProps> = ({
  portfolioHistory,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  // Initialize the chart
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
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
          formatter: (price: number) => `$${price.toFixed(2)}`,
        },
      };

      chartRef.current = createChart(chartContainerRef.current, chartOptions);
      seriesRef.current = chartRef.current.addAreaSeries({
        lineColor: "#758696",
        topColor: "rgba(117, 134, 150, 0.28)",
        bottomColor: "rgba(117, 134, 150, 0.05)",
        lineWidth: 2,
      });
    }

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (portfolioHistory.length > 0 && seriesRef.current) {
      const formattedData = portfolioHistory.map((item) => ({
        time: item.time,
        value: item.value,
      }));
      seriesRef.current.setData(formattedData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [portfolioHistory]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div ref={chartContainerRef}></div>
    </div>
  );
};

export default PortfolioAreaChart;
