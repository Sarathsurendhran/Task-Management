import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const TaskStatistics = () => {
  const [stats, setStats] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const tasks = useSelector((state) => state.tasks.items);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("statistics/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, tasks]);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading statistics...
      </div>
    );
  }

  const chartData = Object.entries(stats.tasks_by_day).map(([day, count]) => ({
    day,
    count,
  }));

  const pieChartData = [
    { name: "Completed", value: stats.completed_tasks },
    { name: "Pending", value: stats.pending_tasks },
  ];

  const COLORS = ["#4CAF50", "#FFC107"];

  return (
    <div className="mt-1 bg-white shadow-lg rounded-lg p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats.total_tasks}
          color="bg-blue-100 text-blue-800"
          icon="📊"
        />
        <StatCard
          title="Completed"
          value={stats.completed_tasks}
          color="bg-green-100 text-green-800"
          icon="✅"
        />
        <StatCard
          title="Pending"
          value={stats.pending_tasks}
          color="bg-yellow-100 text-yellow-800"
          icon="⏳"
        />
        <StatCard
          title="Last 7 Days"
          value={stats.tasks_last_7_days}
          color="bg-purple-100 text-purple-800"
          icon="📅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg lg:col-span-3">
          <h3 className="font-medium mb-4 text-center text-gray-700">
            Tasks by Day of Week
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                dataKey="day"
                stroke="#666"
                tick={{ fill: "#666" }}
                tickLine={{ stroke: "#666" }}
                axisLine={{ stroke: "#666" }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: "#666" }}
                tickLine={{ stroke: "#666" }}
                axisLine={{ stroke: "#666" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "white", borderRadius: "8px" }}
              />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg lg:col-span-5">
          <h3 className="font-medium mb-4 text-center text-gray-700">
            Task Completion Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "white", borderRadius: "8px" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => (
  <div
    className={`${color} rounded-lg p-4 flex flex-col items-center justify-center transition-transform hover:scale-105`}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-medium text-center text-sm">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default TaskStatistics;
