import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { loginUser, clearError } from '@/redux/slices/auth.slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Hotel } from 'lucide-react';
import { useTranslation } from '@/i18n';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Hotel className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorAlert message={error} onClose={() => dispatch(clearError())} />}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('placeholders.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('placeholders.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : t('signIn')}
            </Button>
            
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold">{t('demoCredentials.title')}</p>
              <p>{t('demoCredentials.admin')}</p>
              <p>{t('demoCredentials.receptionist')}</p>
              <p>{t('demoCredentials.manager')}</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

