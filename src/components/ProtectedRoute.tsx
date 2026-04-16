import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfileComplete } from "@/hooks/useProfileComplete";

const ProtectedRoute = ({ children, skipProfileCheck = false }: { children: React.ReactNode; skipProfileCheck?: boolean }) => {
  const { user, loading } = useAuth();
  const { isComplete, loading: profileLoading } = useProfileComplete();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to onboarding if profile is incomplete (unless we're already there)
  if (!skipProfileCheck && isComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
