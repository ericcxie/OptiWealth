import React from "react";
import ReactApexChart from "react-apexcharts";

interface PortfolioPieChartProps {
  stocks: number;
  bonds: number;
  cash: number;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({
  stocks,
  bonds,
  cash,
}) => {
  const series = [stocks, bonds, cash];
  const labels = ["Stocks", "Bonds", "Cash"];

  const options: ApexCharts.ApexOptions | any = {
    chart: {
      foreColor: "#fff",
      width: "100%",
      background: "#0d121e",
    },
    labels: labels,
    tooltip: {
      y: {
        formatter: function (value: number) {
          return `${value.toFixed(2)}%`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        if (val < 5) return "";
        return opts.w.globals.labels[opts.seriesIndex];
      },
    },
    stroke: {
      width: 1,
    },
    theme: {
      mode: "dark" as const,
      monochrome: {
        enabled: true,
        color: "#6935D3",
        shadeTo: "dark",
        shadeIntensity: 1,
      },
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
    ],
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        width="100%"
        height="300px"
      />
    </div>
  );
};

export default PortfolioPieChart;
