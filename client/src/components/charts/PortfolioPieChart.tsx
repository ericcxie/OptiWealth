import React from "react";
import ReactApexChart from "react-apexcharts";

const PortfolioPieChart: React.FC = () => {
  const series = [44, 55, 13, 33, 44, 55];
  const labels = ["AAPL", "MSFT", "GOOGL", "VFV.TO", "TSLA", "AMZN"];

  const options: ApexCharts.ApexOptions | any = {
    chart: {
      foreColor: "#fff",
      width: "100%",
      background: "#0d121e",
    },
    labels: labels,
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        if (val < 10) return "";
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
        color: "#49545d",
        shadeTo: "dark",
        shadeIntensity: 0.75,
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
