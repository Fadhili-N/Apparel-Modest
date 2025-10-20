import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shirt } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    
    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card-strong">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full glass-card flex items-center justify-center">
              <Shirt className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white font-bold">Clothiq Dashboard</CardTitle>
          <CardDescription className="text-white/80">Sign in to access your role-specific dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@clothiq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input text-white placeholder:text-white/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input text-white placeholder:text-white/50"
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="success">
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 glass-input rounded-lg">
            <p className="text-sm font-medium mb-2 text-white/90">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-white/70">
              <p>Admin: admin@clothiq.com / admin123</p>
              <p>Sales: sales@clothiq.com / sales123</p>
              <p>Production: production@clothiq.com / prod123</p>
              <p>In-Store: store@clothiq.com / store123</p>
              <p>Logistics: logistics@clothiq.com / logistics123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
