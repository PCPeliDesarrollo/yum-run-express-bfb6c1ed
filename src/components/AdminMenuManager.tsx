import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Image, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAllProducts } from '@/hooks/useProducts';

const CATEGORIES = [
  "Hamburguesas", "Bocadillos Caseros", "Más Bocadillos", "Para Compartir",
  "Pizzas", "Perritos", "Sandwiches", "Durum", "Paninis",
  "Menú Niños", "Complementos", "Combinados", "Raciones", "Exquisitos",
];

const ALLERGENS = [
  { key: 'has_pork', label: '🐷 Cerdo', color: 'bg-pink-500' },
  { key: 'has_egg', label: '🥚 Huevo', color: 'bg-yellow-500' },
  { key: 'is_gluten_free', label: '🌾 Sin Gluten', color: 'bg-green-500' },
  { key: 'has_dairy', label: '🥛 Lácteos', color: 'bg-blue-400' },
  { key: 'has_nuts', label: '🥜 Frutos Secos', color: 'bg-amber-600' },
  { key: 'has_fish', label: '🐟 Pescado', color: 'bg-cyan-500' },
  { key: 'has_shellfish', label: '🦐 Marisco', color: 'bg-orange-500' },
  { key: 'has_soy', label: '🫘 Soja', color: 'bg-lime-600' },
] as const;

interface ProductForm {
  name: string;
  description: string;
  price: string;
  price_media: string;
  category: string;
  is_gluten_free: boolean;
  has_egg: boolean;
  has_pork: boolean;
  has_dairy: boolean;
  has_nuts: boolean;
  has_fish: boolean;
  has_shellfish: boolean;
  has_soy: boolean;
  available: boolean;
  sort_order: string;
  options: string;
}

const emptyForm: ProductForm = {
  name: '', description: '', price: '', price_media: '', category: CATEGORIES[0],
  is_gluten_free: false, has_egg: false, has_pork: false, has_dairy: false,
  has_nuts: false, has_fish: false, has_shellfish: false, has_soy: false,
  available: true, sort_order: '0', options: '[]',
};

const AdminMenuManager = () => {
  const { products, loading, refetch } = useAllProducts();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (product: any) => {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      price_media: product.price_media ? String(product.price_media) : '',
      category: product.category,
      is_gluten_free: product.is_gluten_free,
      has_egg: product.has_egg,
      has_pork: product.has_pork,
      has_dairy: product.has_dairy,
      has_nuts: product.has_nuts,
      has_fish: product.has_fish,
      has_shellfish: product.has_shellfish,
      has_soy: product.has_soy,
      available: product.available,
      sort_order: String(product.sort_order),
      options: JSON.stringify(product.options, null, 2),
    });
    setEditingId(product.id);
    setImagePreview(product.image_url);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo subir la imagen', variant: 'destructive' });
    } else {
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      setImagePreview(urlData.publicUrl);
      toast({ title: '✅ Imagen subida' });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast({ title: 'Error', description: 'Nombre, precio y categoría son obligatorios', variant: 'destructive' });
      return;
    }

    let parsedOptions;
    try {
      parsedOptions = JSON.parse(form.options);
    } catch {
      toast({ title: 'Error', description: 'Las opciones no son JSON válido', variant: 'destructive' });
      return;
    }

    const productData = {
      name: form.name,
      description: form.description,
      image_url: imagePreview,
      price: parseFloat(form.price),
      price_media: form.price_media ? parseFloat(form.price_media) : null,
      category: form.category,
      is_gluten_free: form.is_gluten_free,
      has_egg: form.has_egg,
      has_pork: form.has_pork,
      has_dairy: form.has_dairy,
      has_nuts: form.has_nuts,
      has_fish: form.has_fish,
      has_shellfish: form.has_shellfish,
      has_soy: form.has_soy,
      available: form.available,
      sort_order: parseInt(form.sort_order) || 0,
      options: parsedOptions,
    };

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingId);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: '✅ Producto actualizado' });
        setShowForm(false);
        refetch();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: '✅ Producto creado' });
        setShowForm(false);
        refetch();
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🗑️ Producto eliminado' });
      refetch();
    }
  };

  const toggleAvailable = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ available: !current })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: current ? '🔴 Producto desactivado' : '🟢 Producto activado' });
      refetch();
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Cargando productos...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🍽️ Gestión de Carta</h2>
        <Button onClick={openNewForm} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'
          }`}
        >
          Todos ({products.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = products.filter(p => p.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg my-8">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Image */}
              <div>
                <label className="text-sm font-semibold mb-2 block">📸 Imagen</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-border" />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full gap-2"
                    >
                      <Image className="w-4 h-4" />
                      {uploading ? 'Subiendo...' : 'Subir imagen'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Nombre *</label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Hamburguesa de Ternera" />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Descripción</label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ingredientes, detalles..." rows={2} />
              </div>

              {/* Price row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Precio (€) *</label>
                  <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Precio Media</label>
                  <Input type="number" step="0.01" value={form.price_media} onChange={e => setForm({ ...form, price_media: e.target.value })} placeholder="Opcional" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Categoría *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Allergens */}
              <div>
                <label className="text-sm font-semibold mb-2 block">⚠️ Alérgenos / Info</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALLERGENS.map(allergen => (
                    <label key={allergen.key} className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer hover:bg-muted/50">
                      <Switch
                        checked={form[allergen.key as keyof ProductForm] as boolean}
                        onCheckedChange={(checked) => setForm({ ...form, [allergen.key]: checked })}
                      />
                      <span className="text-sm">{allergen.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available + Sort */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-border cursor-pointer">
                  <Switch checked={form.available} onCheckedChange={(checked) => setForm({ ...form, available: checked })} />
                  <span className="text-sm font-medium">{form.available ? '✅ Disponible' : '❌ No disponible'}</span>
                </label>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Orden</label>
                  <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
                </div>
              </div>

              {/* Options JSON */}
              <div>
                <label className="text-sm font-semibold mb-1 block">Opciones (JSON)</label>
                <Textarea
                  value={form.options}
                  onChange={e => setForm({ ...form, options: e.target.value })}
                  rows={4}
                  className="font-mono text-xs"
                  placeholder='[{"id":"extra-cheese","name":"Extra queso","price":1.00,"category":"extra"}]'
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button className="flex-1 gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" /> {editingId ? 'Guardar cambios' : 'Crear producto'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-2">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              product.available ? 'bg-card border-border' : 'bg-muted/50 border-border opacity-60'
            }`}
          >
            {/* Image */}
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop'}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{product.name}</span>
                {!product.available && <Badge variant="secondary" className="text-xs">Oculto</Badge>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-primary">€{Number(product.price).toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">{product.category}</span>
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {ALLERGENS.filter(a => (product as any)[a.key]).map(a => (
                  <span key={a.key} className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${a.color}`}>
                    {a.label.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => toggleAvailable(product.id, product.available)}>
                {product.available ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => openEditForm(product)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleDelete(product.id, product.name)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay productos en esta categoría
        </div>
      )}
    </div>
  );
};

export default AdminMenuManager;
