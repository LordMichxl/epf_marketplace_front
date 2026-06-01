export default function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`${bg} rounded-2xl shadow-sm p-6 border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  )
}
