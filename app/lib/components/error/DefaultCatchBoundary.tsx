import { Fish, Anchor, Home } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { Card } from "~/lib/components/ui/card";
import { useTranslation } from "~/lib/i18n";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export const DefaultCatchBoundary = () => {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 5) % 360);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="max-w-md w-full p-6 shadow-lg border-2 border-blue-200 bg-white/90 backdrop-blur">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="text-blue-300 opacity-20" 
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s linear' }}
              >
                <Anchor size={120} />
              </div>
            </div>
            <div className="relative z-10 text-red-500 animate-bounce">
              <Fish size={80} />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{t('Oups ! Une erreur s\'est produite')}</h2>
            <p className="text-gray-600 mb-6">{t('On dirait que notre poisson a rencontré un problème...')}</p>
          </div>
          
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center gap-2">
                <Home size={16} />
                {t('Accueil')}
              </Link>
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2"
            >
              <Fish size={16} />
              {t('Réessayer')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
