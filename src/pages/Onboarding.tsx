import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, User, Phone } from 'lucide-react';
import { z } from 'zod';

const onboardingSchema = z.object({
  full_name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  phone: z.string().trim().min(9, 'El teléfono debe tener al menos 9 dígitos').max(15),
  address: z.string().trim().min(5, 'La dirección debe tener al menos 5 caracteres').max(200),
  city: z.string().trim().min(2, 'La ciudad debe tener al menos 2 caracteres').max(100),
  postal_code: z.string().trim().min(4, 'El código postal debe tener al menos 4 dígitos').max(10),
});

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const result = onboardingSchema.safeParse({
      full_name: fullName,
      phone,
      address,
      city,
      postal_code: postalCode,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user!.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
      });

      if (error) throw error;

      toast({
        title: '¡Perfil completado! 🎉',
        description: 'Ya puedes empezar a hacer pedidos',
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary p-4">
        <div className="container mx-auto">
          <h1 className="text-lg font-bold text-primary-foreground">Completa tu perfil</h1>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              ¡Bienvenido! 👋
            </h2>
            <p className="text-muted-foreground mt-2">
              Necesitamos tus datos para poder enviarte los pedidos
            </p>
          </div>

          {/* Personal data */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Datos personales
            </h3>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo *</Label>
              <Input
                id="fullName"
                placeholder="Tu nombre y apellidos"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={errors.full_name ? 'border-destructive' : ''}
              />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+34 600 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Dirección de entrega
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                placeholder="Calle, número, piso..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  placeholder="Tu ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Código postal *</Label>
                <Input
                  id="postalCode"
                  placeholder="00000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={errors.postal_code ? 'border-destructive' : ''}
                />
                {errors.postal_code && <p className="text-xs text-destructive">{errors.postal_code}</p>}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            variant="default"
            className="w-full h-14 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            {isSaving ? 'Guardando...' : 'Guardar y empezar a pedir 🍔'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
