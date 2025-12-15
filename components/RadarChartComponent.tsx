import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RadarDataProps {
  data: { [key: string]: number };
  color: string;
  dataKeyName: string;
}

const RadarChartComponent: React.FC<RadarDataProps> = ({ data, color, dataKeyName }) => {
  const formattedData = Object.keys(data).map((key) => ({
    subject: key,
    A: data[key],
    fullMark: 5, // Assuming 5 is the max scale based on JSON
  }));

  // Custom tick component to handle long text wrapping without truncation
  const CustomTick = ({ payload, x, y, textAnchor, stroke, radius }: any) => {
    const text = payload.value;
    // Split long text into multiple lines (e.g., every 7 chars)
    // This handles very long competence names like "客户痛点识别及需求探索能力"
    const words = text.match(/.{1,7}/g) || [text];
    
    return (
      <g className="recharts-layer recharts-polar-angle-axis-tick">
        <text
          radius={radius}
          stroke={stroke}
          x={x}
          y={y}
          className="recharts-text recharts-polar-angle-axis-tick-value"
          textAnchor={textAnchor}
          fill="#64748b"
          fontSize="10"
        >
          {words.map((line: string, index: number) => (
             // dy adjustment: First line needs to be shifted up if there are multiple lines to center the block
             <tspan x={x} dy={index === 0 ? (words.length > 1 ? "-0.4em" : "0.3em") : "1.2em"} key={index}>
               {line}
             </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    // Responsive container needs to be large enough
    <div className="h-full w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={formattedData}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={CustomTick}
          />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
          <Radar
            name={dataKeyName}
            dataKey="A"
            stroke={color}
            fill={color}
            fillOpacity={0.4}
          />
          <Tooltip 
             contentStyle={{ 
               backgroundColor: '#fff', 
               borderRadius: '8px', 
               fontSize: '12px', 
               padding: '6px 10px',
               border: '1px solid #e2e8f0',
               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
             }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;