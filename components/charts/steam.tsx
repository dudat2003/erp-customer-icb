import React from "react";
import Chart, { Props } from "react-apexcharts";
import { useCustomers } from "@/hooks/use-customers";

export const Steam = () => {
  // Fetch data for different customer categories
  const { data: potentialData } = useCustomers({
    page: 1,
    pageSize: 100,
    category: "potential",
  });

  const { data: closedData } = useCustomers({
    page: 1,
    pageSize: 100,
    category: "closed",
  });

  const { data: regularData } = useCustomers({
    page: 1,
    pageSize: 100,
    category: "regular",
  });

  const { data: promisingData } = useCustomers({
    page: 1,
    pageSize: 100,
    category: "promising",
  });

  // Generate monthly data for the last 6 months
  const generateMonthlyData = (customers: any[]) => {
    const months = [];
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString("vi-VN", {
        month: "short",
      });
      months.push(monthName);

      const monthCustomers =
        customers?.filter((c) => {
          const created = new Date(c.createdAt);
          return (
            created.getMonth() === month.getMonth() &&
            created.getFullYear() === month.getFullYear()
          );
        }).length || 0;

      data.push(monthCustomers);
    }

    return { months, data };
  };

  const potentialCustomers = potentialData?.data || [];
  const closedCustomers = closedData?.data || [];
  const regularCustomers = regularData?.data || [];
  const promisingCustomers = promisingData?.data || [];

  const { months } = generateMonthlyData(potentialCustomers);
  const potentialMonthlyData = generateMonthlyData(potentialCustomers).data;
  const closedMonthlyData = generateMonthlyData(closedCustomers).data;
  const regularMonthlyData = generateMonthlyData(regularCustomers).data;
  const promisingMonthlyData = generateMonthlyData(promisingCustomers).data;

  const series: Props["series"] = [
    {
      name: "KH Tiềm năng",
      data: potentialMonthlyData,
    },
    {
      name: "KH Đã chốt",
      data: closedMonthlyData,
    },
    {
      name: "KH Thường",
      data: regularMonthlyData,
    },
    {
      name: "KH Khả quan",
      data: promisingMonthlyData,
    },
  ];

  const options: Props["options"] = {
    chart: {
      type: "area",
      animations: {
        easing: "linear",
        speed: 300,
      },
      sparkline: {
        enabled: false,
      },
      brush: {
        enabled: false,
      },
      id: "customer-chart",
      foreColor: "hsl(var(--heroui-default-800))",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["#006FEE", "#17C964", "#F5A524", "#F31260"],
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: "hsl(var(--heroui-default-800))",
        },
      },
      axisBorder: {
        color: "hsl(var(--heroui-default-200))",
      },
      axisTicks: {
        color: "hsl(var(--heroui-default-200))",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "hsl(var(--heroui-default-800))",
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
    grid: {
      show: true,
      borderColor: "hsl(var(--heroui-default-200))",
      strokeDashArray: 0,
      position: "back",
    },
    stroke: {
      curve: "smooth",
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <>
      <div className="w-full z-20">
        <div id="chart">
          <Chart options={options} series={series} type="area" height={425} />
        </div>
      </div>
    </>
  );
};
