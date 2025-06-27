'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Board from '@/src/types/board';
import { updateBoard } from '@/src/services/board/actions';
import { updateGroup, deleteGroup, createGroup } from '@/src/services/group/actions';
import { updateItem, deleteItem, createItem } from '@/src/services/item/actions';
import { updateQuote, deleteQuote, createQuote } from '@/src/services/quote/actions';

type EditMode = 'menu' | 'board' | 'groups' | 'group' | 'item' | 'quotes' | 'quote' | 'create-group' | 'create-item' | 'create-quote';

interface EditData {
  board?: { id: string; title: string; description: string };
  group?: { id?: string; name: string; posX: number; posY: number; boardId: string };
  item?: { id?: string; name: string; description: string; groupId: string };
  quote?: { id?: string; text: string; posX: number; posY: number; boardId: string };
}

interface EditPanelProps {
  boardData: Board;
}

export default function EditPanel({ boardData }: EditPanelProps) {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;
  
  const [editMode, setEditMode] = useState<EditMode>('menu');
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditData>({});
  const [isPending, startTransition] = useTransition();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!editMode || !editData) return;
    
    startTransition(async () => {
      try {
        let result;
        switch (editMode) {
          case 'board':
            if (editData.board) {
              result = await updateBoard(editData.board.id, {
                title: editData.board.title,
                description: editData.board.description
              });
            }
            break;
          case 'group':
            if (editData.group && editData.group.id) {
              result = await updateGroup(editData.group.id, editData.group);
            }
            break;
          case 'create-group':
            if (editData.group) {
              result = await createGroup(editData.group);
            }
            break;
          case 'item':
            if (editData.item && editData.item.id) {
              result = await updateItem(editData.item.id, editData.item, boardId);
            }
            break;
          case 'create-item':
            if (editData.item) {
              result = await createItem(editData.item, boardId);
            }
            break;
          case 'quote':
            if (editData.quote && editData.quote.id) {
              result = await updateQuote(editData.quote.id, editData.quote);
            }
            break;
          case 'create-quote':
            if (editData.quote) {
              result = await createQuote(editData.quote);
            }
            break;
        }
        
        if (result && !result.success) {
          alert(result.error || 'Échec de la sauvegarde');
        } else {
          // Reset edit mode after successful save
          setEditMode('menu');
          setEditData({});
          setSelectedObject(null);
        }
      } catch (error) {
        console.error('Failed to save:', error);
        alert('Échec de la sauvegarde');
      }
    });
  };

  const handleDelete = async () => {
    if (!editMode || !selectedObject) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    startTransition(async () => {
      try {
        let result;
        switch (editMode) {
          case 'group':
            result = await deleteGroup(selectedObject, boardId);
            break;
          case 'item':
            result = await deleteItem(selectedObject, boardId);
            break;
          case 'quote':
            result = await deleteQuote(selectedObject, boardId);
            break;
        }
        
        if (result && !result.success) {
          alert(result.error || 'Échec de la suppression');
        } else {
          setEditMode('menu');
          setEditData({});
          setSelectedObject(null);
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Échec de la suppression');
      }
    });
  };

  const handleCancel = () => {
    router.push(`/${boardId}`);
  };

  const renderEditForm = () => {
    // Menu principal avec les trois options
    if (editMode === 'menu') {
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Options d&apos;édition :</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                setEditMode('board');
                setEditData({ board: { id: boardId, title: boardData?.title || '', description: boardData?.description || '' } });
              }}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              📝 Éditer les infos du Board
            </button>
            
            <button
              onClick={() => setEditMode('groups')}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              📁 Éditer les Groupes
            </button>
            
            <button
              onClick={() => setEditMode('quotes')}
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              💬 Éditer les Citations
            </button>
          </div>
        </div>
      );
    }

    // Liste des groupes
    if (editMode === 'groups') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode('menu')}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ←
            </button>
            <h3 className="font-semibold text-gray-800">Sélectionner un groupe :</h3>
          </div>
          
          <button
            onClick={() => {
              setEditMode('create-group');
              setEditData({ group: { name: '', posX: 0, posY: 0, boardId } });
            }}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            ➕ Créer un nouveau groupe
          </button>
          
          <div className="space-y-2">
            {boardData?.groups && boardData.groups.length > 0 ? (
              boardData.groups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleGroupExpansion(group.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {expandedGroups.has(group.id) ? '▼' : '▶'}
                      </button>
                      <h4 className="font-medium text-gray-800">{group.name}</h4>
                      <span className="text-xs text-gray-500">
                        ({group.items?.length || 0} item{(group.items?.length || 0) !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setEditMode('group');
                        setSelectedObject(group.id);
                        setEditData({ group: { id: group.id, name: group.name, posX: group.posX, posY: group.posY, boardId: group.boardId } });
                      }}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                    >
                      Éditer groupe
                    </button>
                  </div>
                  
                  {expandedGroups.has(group.id) && (
                    <div className="space-y-2">
                      {group.items && group.items.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">Items dans ce groupe :</p>
                          <div className="grid gap-1">
                            {group.items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setEditMode('item');
                                  setSelectedObject(item.id);
                                  setEditData({ item: { id: item.id, name: item.name, description: item.description, groupId: item.groupId } });
                                }}
                                className="w-full px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors text-left"
                              >
                                📄 {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setEditMode('create-item');
                          setEditData({ item: { name: '', description: '', groupId: group.id } });
                        }}
                        className="w-full px-2 py-1 bg-purple-300 text-purple-800 rounded text-xs hover:bg-purple-400 transition-colors"
                      >
                        ➕ Ajouter un item
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucun groupe disponible</p>
            )}
          </div>
        </div>
      );
    }

    // Liste des quotes
    if (editMode === 'quotes') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode('menu')}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ←
            </button>
            <h3 className="font-semibold text-gray-800">Sélectionner une citation :</h3>
          </div>
          
          <button
            onClick={() => {
              setEditMode('create-quote');
              setEditData({ quote: { text: '', posX: 0, posY: 0, boardId } });
            }}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            ➕ Créer une nouvelle citation
          </button>
          
          <div className="space-y-2">
            {boardData?.quotes && boardData.quotes.length > 0 ? (
              boardData.quotes.map((quote) => (
                <button
                  key={quote.id}
                  onClick={() => {
                    setEditMode('quote');
                    setSelectedObject(quote.id);
                    setEditData({ quote: { id: quote.id, text: quote.text, posX: quote.posX, posY: quote.posY, boardId: quote.boardId } });
                  }}
                  className="w-full px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors text-left"
                >
                  💬 {quote.text.length > 30 ? quote.text.substring(0, 30) + '...' : quote.text}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aucune citation disponible</p>
            )}
          </div>
        </div>
      );
    }

    // Formulaires d'édition
    const getBackMode = () => {
      if (editMode === 'item' || editMode === 'create-item') return 'groups';
      if (editMode === 'group' || editMode === 'create-group') return 'groups';
      if (editMode === 'quote' || editMode === 'create-quote') return 'quotes';
      return 'menu';
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const backMode = getBackMode();
              setEditMode(backMode);
              setSelectedObject(null);
              setEditData({});
            }}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ←
          </button>
          <h3 className="font-semibold text-gray-800">
            {editMode === 'board' ? 'Éditer Board' : 
             editMode === 'group' ? 'Éditer Groupe' : 
             editMode === 'create-group' ? 'Créer Groupe' :
             editMode === 'item' ? 'Éditer Item' :
             editMode === 'create-item' ? 'Créer Item' :
             editMode === 'quote' ? 'Éditer Citation' :
             editMode === 'create-quote' ? 'Créer Citation' : 'Éditer'}
          </h3>
        </div>

        {editMode === 'board' && editData.board && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                value={editData.board.title}
                onChange={(e) => setEditData({
                  ...editData,
                  board: { ...editData.board!, title: e.target.value }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editData.board.description}
                onChange={(e) => setEditData({
                  ...editData,
                  board: { ...editData.board!, description: e.target.value }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        )}

        {(editMode === 'group' || editMode === 'create-group') && editData.group && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={editData.group.name}
                onChange={(e) => setEditData({
                  ...editData,
                  group: { ...editData.group!, name: e.target.value }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position X</label>
                <input
                  type="number"
                  value={editData.group.posX}
                  onChange={(e) => setEditData({
                    ...editData,
                    group: { ...editData.group!, posX: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position Y</label>
                <input
                  type="number"
                  value={editData.group.posY}
                  onChange={(e) => setEditData({
                    ...editData,
                    group: { ...editData.group!, posY: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {(editMode === 'item' || editMode === 'create-item') && editData.item && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={editData.item.name}
                onChange={(e) => setEditData({
                  ...editData,
                  item: { ...editData.item!, name: e.target.value }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editData.item.description}
                onChange={(e) => setEditData({
                  ...editData,
                  item: { ...editData.item!, description: e.target.value }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
        )}

        {(editMode === 'quote' || editMode === 'create-quote') && editData.quote && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Texte</label>
              <textarea
                value={editData.quote.text}
                onChange={(e) => setEditData({
                  ...editData,
                  quote: { ...editData.quote!, text: e.target.value }
                })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position X</label>
                <input
                  type="number"
                  value={editData.quote.posX}
                  onChange={(e) => setEditData({
                    ...editData,
                    quote: { ...editData.quote!, posX: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position Y</label>
                <input
                  type="number"
                  value={editData.quote.posY}
                  onChange={(e) => setEditData({
                    ...editData,
                    quote: { ...editData.quote!, posY: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Sauvegarde...' : (editMode.startsWith('create-') ? 'Créer' : 'Sauvegarder')}
          </button>
          {editMode !== 'board' && !editMode.startsWith('create-') && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 max-h-[80vh] overflow-y-auto">
      {renderEditForm()}
      {editMode === 'menu' && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Quitter le mode édition
          </button>
        </div>
      )}
    </div>
  );
}