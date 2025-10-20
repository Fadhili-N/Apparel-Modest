import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockOrders, Order } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Search, Clock, Package, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    // Filter orders based on user role - only show orders in their current stage
    const roleOrders = mockOrders.filter(order => order.stage === user.role);
    setOrders(roleOrders);
    setFilteredOrders(roleOrders);
  }, [user, navigate]);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format(order.createdAt, 'PP').includes(searchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const getNextStage = (currentStage: Order['stage']): Order['stage'] | null => {
    const stages: Order['stage'][] = ['sales', 'production', 'instore', 'logistics'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    return 'delivered';
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      const updatedOrder = { ...order, status: newStatus, updatedAt: new Date() };
      
      // If marked as completed, move to next stage
      if (newStatus === 'completed') {
        const nextStage = getNextStage(order.stage);
        if (nextStage) {
          updatedOrder.stage = nextStage;
          updatedOrder.stageHistory = [
            ...order.stageHistory,
            { stage: nextStage, timestamp: new Date() }
          ];
        }
      }
      
      return updatedOrder;
    }));
  };

  const moveToNextStage = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-accent';
      case 'in_progress': return 'bg-primary';
      case 'delayed': return 'bg-destructive';
      default: return 'bg-muted-foreground';
    }
  };

  const todayOrders = orders.filter(o => 
    format(o.updatedAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;

  const completedToday = orders.filter(o => 
    o.status === 'completed' && 
    format(o.updatedAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;

  if (!user || user.role === 'admin') return null;

  return (
    <div className="min-h-screen">
      <header className="glass-card border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Clothiq Dashboard</h1>
            <p className="text-sm text-white/80 capitalize">{user.role} Portal - {user.name}</p>
          </div>
          <Button variant="outline" onClick={() => { logout(); navigate('/auth'); }}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Today's Orders</CardTitle>
              <Package className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{todayOrders}</div>
            </CardContent>
          </Card>
          <Card className="hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Completed Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{completedToday}</div>
            </CardContent>
          </Card>
          <Card className="hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Assigned</CardTitle>
              <Clock className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{orders.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Search Orders</CardTitle>
            <CardDescription className="text-white/70">Search by customer name, item, order ID, or date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-input text-white placeholder:text-white/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Your Orders</h2>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-white/70">
                No orders found
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map(order => (
              <Card key={order.id} className="hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-xl text-white">{order.id} - {order.customerName}</CardTitle>
                      <CardDescription className="text-white/70">{order.item} ({order.color}, {order.size})</CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status) + " text-white"}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Quantity</p>
                      <p className="font-medium text-white">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Price</p>
                      <p className="font-medium text-accent font-bold">KES {order.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Payment</p>
                      <p className="font-medium text-white capitalize">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Delivery</p>
                      <p className="font-medium text-white capitalize">{order.deliveryMethod}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-white/60">
                      Created: {format(order.createdAt, 'PPp')}
                    </p>
                    <p className="text-sm text-white/60">
                      Last Updated: {format(order.updatedAt, 'PPp')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'in_progress')}
                      variant={order.status === 'in_progress' ? 'default' : 'outline'}
                      className="flex-1 min-w-[120px]"
                    >
                      In Progress
                    </Button>
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'delayed')}
                      variant={order.status === 'delayed' ? 'destructive' : 'outline'}
                      className="flex-1 min-w-[120px]"
                    >
                      Delayed
                    </Button>
                    {order.stage !== 'logistics' && (
                      <Button
                        onClick={() => moveToNextStage(order.id)}
                        variant="success"
                        className="flex-1 min-w-[160px]"
                      >
                        Complete & Move to Next
                      </Button>
                    )}
                    {order.stage === 'logistics' && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        variant="success"
                        className="flex-1 min-w-[120px]"
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>

                  {/* Stage Timeline */}
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm font-medium mb-2 text-white">Order Timeline</p>
                    <div className="space-y-2">
                      {order.stageHistory.map((stage, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="capitalize text-white">{stage.stage}</span>
                          <span className="text-white/60">
                            {format(stage.timestamp, 'PPp')}
                            {stage.duration && ` (${Math.round(stage.duration / 60)}h)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
