import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CountChartProps {
  data: Array<{ hour: string; count: number }>
  title?: string
}

export const CountChart = ({ data, title }: CountChartProps) => {
  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="hour" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const BarChartComponent = ({ data, title }: { data: Array<{ label: string; value: number }>; title?: string }) => {
  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const PieChartComponent = ({ data, title }: { data: Array<{ name: string; value: number }>; title?: string }) => {
  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#2563EB" dataKey="value" label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'][index % 5]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
