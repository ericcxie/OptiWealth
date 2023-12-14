import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { PulseLoader } from "react-spinners";

interface Props {
  portfolioAllocation: Array<{ Ticker: string; Percentage: number }>;
}

const PortfolioPieChart: React.FC<Props> = ({ portfolioAllocation }) => {
  const [loading, setLoading] = useState(true);
  const filteredAllocation = portfolioAllocation.filter(
    (stock) => stock.Percentage > 2
  );
  const series = filteredAllocation.map((stock) => stock.Percentage);
  const labels = filteredAllocation.map((stock) => stock.Ticker);

  useEffect(() => {
    if (portfolioAllocation.length > 0) {
      setLoading(false);
    }
  }, [portfolioAllocation]);

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
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(2) + "%";
        },
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
      {loading ? (
        <PulseLoader color="#FFFFFF" loading={loading} />
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          width="100%"
          height="300px"
        />
      )}
    </div>
  );
};

export default PortfolioPieChart;
