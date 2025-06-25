'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';

import Item from '@/src/types/item';
import useModalBehavior from '@/src/hooks/useModalBehavior';

interface ItemModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

// Composant pour l'icône de fermeture
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Composant pour l'en-tête de la modal
const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-lg">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 transition-colors p-2"
      aria-label="Fermer la modal"
    >
      <CloseIcon />
    </button>
  </div>
);

// Composant pour l'image de l'item
const ItemImage = ({ image, name }: { image: Buffer | null | undefined; name: string }) => {
  if (!image) return null;

  return (
    <div className="mb-6">
      <Image 
        src={`data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`}
        alt={name}
        width={800}
        height={600}
        className="w-full h-auto max-h-[50vh] object-contain rounded-lg shadow-md"
      />
    </div>
  );
};

// Composant pour la description de l'item
const ItemDescription = ({ description }: { description?: string }) => {
  if (!description) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};

// Composant pour le contenu vide
const EmptyContent = () => (
  <div className="flex items-center justify-center py-8">
    <p className="text-gray-500 italic">Aucune information supplémentaire disponible.</p>
  </div>
);

export default function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  useModalBehavior(isOpen, onClose);

  if (!isOpen) return null;

  const hasContent = item.image || item.description;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader title={item.name} onClose={onClose} />
        
        <div className="p-6">
          <ItemImage image={item.image} name={item.name} />
          <ItemDescription description={item.description} />
          {!hasContent && <EmptyContent />}
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
