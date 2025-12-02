
import React, { useRef } from 'react';

interface ImageUploaderProps {
  images: string[];
  setImages: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const promises = files.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(newImages => {
        setImages([...images, ...newImages]);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Visual Context (Optional)
      </label>
      
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src={img} alt="Upload" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => removeImage(idx)}
                 className="p-1 rounded-full bg-red-500 text-white"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>
            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">
                {idx + 1}
            </div>
          </div>
        ))}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span className="text-[10px]">Add</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      <p className="text-xs text-slate-400">
        Upload images in sequence to get context-aware captions.
      </p>
    </div>
  );
};
