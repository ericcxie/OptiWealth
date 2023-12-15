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

  console.log("Portfolio history", portfolioHistory);

  const resizeChart = () => {
    if (chartContainerRef.current) {
      const width = chartContainerRef.current.clientWidth;
      const height = chartContainerRef.current.clientHeight;
      chartRef.current?.applyOptions({ width, height });
    }
  };

  // Initialize the chart
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
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
        rightPriceScale: {
          visible: window.innerWidth > 768,
          entireTextOnly: true,
        },

        width: chartContainerRef.current.clientWidth,
        height: 350,
      });

      chart.applyOptions({
        localization: {
          priceFormatter: (price: number) => {
            return price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          },
        },
      });

      seriesRef.current = chart.addAreaSeries({
        lineColor: "#758696",
        topColor: "rgba(117, 134, 150, 0.28)",
        bottomColor: "rgba(117, 134, 150, 0.05)",
        lineWidth: 2,
      });

      chartRef.current = chart;

      window.addEventListener("resize", resizeChart);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", resizeChart);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
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
      <div ref={chartContainerRef} className="w-full h-full"></div>
    </div>
  );
};

export default PortfolioAreaChart;
