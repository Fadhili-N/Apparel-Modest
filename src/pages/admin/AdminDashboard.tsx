import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders } from '@/data/mockData';
import { 
  Package, 
  DollarSign, 
  Shirt, 
  Truck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);
  
  const itemCount: Record<string, number> = {};
  const colorCount: Record<string, number> = {};
  const deliveryCount: Record<string, number> = {};

  mockOrders.forEach(order => {
    itemCount[order.item] = (itemCount[order.item] || 0) + order.quantity;
    colorCount[order.color] = (colorCount[order.color] || 0) + 1;
    deliveryCount[order.deliveryMethod] = (deliveryCount[order.deliveryMethod] || 0) + 1;
  });

  const mostOrderedItem = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];
  const popularColor = Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0];
  const preferredDelivery = Object.entries(deliveryCount).sort((a, b) => b[1] - a[1])[0];

  const deliveryData = Object.entries(deliveryCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--muted))'];

  const ordersByDay = [
    { day: 'Mon', orders: 12 },
    { day: 'Tue', orders: 19 },
    { day: 'Wed', orders: 15 },
    { day: 'Thu', orders: 25 },
    { day: 'Fri', orders: 22 },
    { day: 'Sat', orders: 30 },
    { day: 'Sun', orders: 18 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Overview Dashboard</h1>
        <p className="text-white/70">Welcome back! Here's your business summary.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalOrders}</div>
            <p className="text-xs text-white/60">This month</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">KES {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-white/60">This month</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Most Ordered</CardTitle>
            <Shirt className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mostOrderedItem?.[0] || 'N/A'}</div>
            <p className="text-xs text-white/60">{mostOrderedItem?.[1] || 0} units</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Popular Color</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{popularColor?.[0] || 'N/A'}</div>
            <p className="text-xs text-white/60">{popularColor?.[1] || 0} orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Weekly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Delivery Methods</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Preferred Delivery</CardTitle>
            <Truck className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white capitalize">{preferredDelivery?.[0] || 'N/A'}</div>
            <p className="text-xs text-white/60">{preferredDelivery?.[1] || 0} orders</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.5 hours</div>
            <p className="text-xs text-white/60">Per stage</p>
          </CardContent>
        </Card>

        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Orders Today</CardTitle>
            <Package className="h-4 w-4 text-white/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">8</div>
            <p className="text-xs text-white/60">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
