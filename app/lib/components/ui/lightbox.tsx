import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Info, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "~/lib/i18n";

export type LightboxItem = {
  id: number;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  user?: {
    id: number;
    username: string;
  };
  team?: {
    id: number;
    name: string;
  };
  // Additional optional fields for flexibility
  title?: string;
  description?: string;
};

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const { t } = useTranslation();
  const currentItem = items[currentIndex];
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "i") setShowInfo((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        aria-label={t("common.close")}
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation buttons */}
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        aria-label={t("common.previous")}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        aria-label={t("common.next")}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Info toggle button */}
      <button
        type="button"
        onClick={() => setShowInfo((prev) => !prev)}
        className="absolute top-4 left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        aria-label={t("common.toggleInfo")}
      >
        <Info className="h-6 w-6" />
      </button>

      {/* Main image */}
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden">
        <img
          src={currentItem.imageUrl}
          alt={currentItem.caption || currentItem.title || "Image"}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        {/* Photo info overlay */}
        {showInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
            {(currentItem.caption || currentItem.title) && (
              <h3 className="text-xl font-medium mb-2">
                {currentItem.caption || currentItem.title}
              </h3>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              {currentItem.team && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{currentItem.team.name}</span>
                </div>
              )}
              {currentItem.user && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{currentItem.user.username}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(currentItem.createdAt), "PPP")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
}
