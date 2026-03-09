import { XCircle } from "lucide-react";
import { useKitchenStatus } from "@/hooks/useKitchenStatus";

const KitchenClosedBanner = () => {
  const { isOpen, loading } = useKitchenStatus();

  if (loading || isOpen) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 flex items-center gap-3 justify-center">
      <XCircle className="h-5 w-5 shrink-0" />
      <p className="text-sm font-medium text-center">
        La cocina está cerrada en este momento. No se pueden realizar pedidos.
      </p>
    </div>
  );
};

export default KitchenClosedBanner;
