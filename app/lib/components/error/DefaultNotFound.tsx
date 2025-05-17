import { Fish, Home } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { Card } from "~/lib/components/ui/card";
import { useTranslation } from "~/lib/i18n";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export const DefaultNotFound = () => {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="max-w-md w-full p-6 shadow-lg border-2 border-blue-200 bg-white/90 backdrop-blur">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="relative h-40 w-full overflow-hidden rounded-lg bg-blue-100/50">
            <div 
              className="absolute transition-all duration-1000 ease-in-out text-blue-500"
              style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Fish size={60} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold text-blue-800/20">{t('404')}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{t('Page introuvable')}</h2>
            <p className="text-gray-600 mb-6">{t('Ce poisson a nagé ailleurs... La page que vous cherchez n\'existe pas.')}</p>
          </div>
          
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home size={16} />
              {t('Retour à l\'accueil')}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};
