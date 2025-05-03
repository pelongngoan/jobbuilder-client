import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Bell,
} from "lucide-react";

const applicationData = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 19 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 28 },
  { month: "May", count: 34 },
  { month: "Jun", count: 26 },
];

const recentActivities = [
  {
    id: 1,
    activity: "New application received for Frontend Developer",
    time: "5 minutes ago",
  },
  {
    id: 2,
    activity: "HR Mark updated the Product Manager job post",
    time: "1 hour ago",
  },
  {
    id: 3,
    activity: "Interview scheduled with John Doe for UX Designer",
    time: "3 hours ago",
  },
  {
    id: 4,
    activity: "New job post created: DevOps Engineer",
    time: "5 hours ago",
  },
  {
    id: 5,
    activity: "Application status changed to 'In Review'",
    time: "1 day ago",
  },
];

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="border rounded p-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button className="bg-blue-600 text-white rounded px-4 py-2 text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 shadow rounded-xl flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Job Posts</p>
            <p className="text-2xl font-bold">24</p>
            <p className="text-green-500 text-xs">↑ 4 from last month</p>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-xl flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FileText className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Applications</p>
            <p className="text-2xl font-bold">134</p>
            <p className="text-green-500 text-xs">↑ 12 from last month</p>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-xl flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Users className="text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active HRs</p>
            <p className="text-2xl font-bold">6</p>
            <p className="text-gray-500 text-xs">No change from last month</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Applications Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <button className="text-blue-600 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-3 border-b border-gray-100"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bell className="text-blue-600 h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
            <Briefcase className="text-blue-600" />
            <span className="text-sm">Create Job Post</span>
          </button>
          <button className="p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
            <Users className="text-green-600" />
            <span className="text-sm">Add HR Account</span>
          </button>
          <button className="p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
            <Calendar className="text-purple-600" />
            <span className="text-sm">Schedule Interview</span>
          </button>
          <button className="p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
            <TrendingUp className="text-orange-600" />
            <span className="text-sm">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};
