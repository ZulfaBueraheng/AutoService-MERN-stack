import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const DonutChartComponent = ({ data }) => {
  return (
    <PieChart width={180} height={150}>
      <Pie
        data={data}
        cx="50%"
        cy="60%"
        innerRadius="15%"
        outerRadius="72%"
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
        label={{
          fontSize: 12,
          position: "outside",
          offset: 0,
          formatter: (value) => `${value}`,
        }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default DonutChartComponent;