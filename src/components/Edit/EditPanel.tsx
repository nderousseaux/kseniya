'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Board from '@/src/types/board';
import { updateBoard } from '@/src/services/board/actions';
import { updateGroup, deleteGroup, createGroup, reorderGroups } from '@/src/services/group/actions';
import { updateItem, deleteItem, createItem, reorderItems } from '@/src/services/item/actions';
import { updateQuote, deleteQuote, createQuote, reorderQuotes } from '@/src/services/quote/actions';
import DraggableList from './DraggableList';

type EditMode = 'menu' | 'board' | 'groups' | 'group' | 'item' | 'quotes' | 'quote' | 'create-group' | 'create-item' | 'create-quote' | 'group-detail';

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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditData>({});
  const [isPending, startTransition] = useTransition();

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
          // Refresh the page to get updated data
          router.refresh();
          
          // Reset edit mode after successful save
          if (editMode === 'create-item' && selectedGroup) {
            // Rester dans la vue détail du groupe après création d'un item
            setEditMode('group-detail');
            setEditData({});
            setSelectedObject(null);
          } else {
            setEditMode('menu');
            setEditData({});
            setSelectedObject(null);
            setSelectedGroup(null);
          }
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
          // Refresh the page to get updated data
          router.refresh();
          
          if (editMode === 'item' && selectedGroup) {
            // Rester dans la vue détail du groupe après suppression d'un item
            setEditMode('group-detail');
            setEditData({});
            setSelectedObject(null);
          } else {
            setEditMode('menu');
            setEditData({});
            setSelectedObject(null);
            setSelectedGroup(null);
          }
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

  const handleReorderGroups = async (orderedIds: string[]) => {
    startTransition(async () => {
      try {
        const result = await reorderGroups(boardId, orderedIds);
        if (result && !result.success) {
          alert(result.error || 'Échec de la réorganisation');
        } else {
          // Refresh the page to get updated data
          router.refresh();
        }
      } catch (error) {
        console.error('Failed to reorder groups:', error);
        alert('Échec de la réorganisation');
      }
    });
  };

  const handleReorderItems = async (groupId: string, orderedIds: string[]) => {
    startTransition(async () => {
      try {
        const result = await reorderItems(groupId, orderedIds, boardId);
        if (result && !result.success) {
          alert(result.error || 'Échec de la réorganisation');
        } else {
          // Refresh the page to get updated data
          router.refresh();
        }
      } catch (error) {
        console.error('Failed to reorder items:', error);
        alert('Échec de la réorganisation');
      }
    });
  };

  const handleReorderQuotes = async (orderedIds: string[]) => {
    startTransition(async () => {
      try {
        const result = await reorderQuotes(boardId, orderedIds);
        if (result && !result.success) {
          alert(result.error || 'Échec de la réorganisation');
        } else {
          // Refresh the page to get updated data
          router.refresh();
        }
      } catch (error) {
        console.error('Failed to reorder quotes:', error);
        alert('Échec de la réorganisation');
      }
    });
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
      const sortedGroups = boardData?.groups ? [...boardData.groups].sort((a, b) => a.order - b.order) : [];
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode('menu')}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ←
            </button>
            <h3 className="font-semibold text-gray-800">Groupes (glisser pour réorganiser) :</h3>
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
          
          {sortedGroups.length > 0 && (
            <DraggableList
              items={sortedGroups}
              onReorder={handleReorderGroups}
                onEdit={(group) => {
                  setEditMode('group');
                  setSelectedObject(group.id);
                  setEditData({ group: { id: group.id, name: group.name, posX: group.posX, posY: group.posY, boardId: group.boardId } });
                }}
                onDelete={(groupId) => {
                  setSelectedObject(groupId);
                  handleDelete();
                }}
                renderItem={(group) => (
                <div 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setSelectedGroup(group.id);
                    setEditMode('group-detail');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📁</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{group.name}</h4>
                      <p className="text-xs text-gray-500">
                        {group.items?.length || 0} item{(group.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditMode('group');
                        setSelectedObject(group.id);
                        setEditData({ group: { id: group.id, name: group.name, posX: group.posX, posY: group.posY, boardId: group.boardId } });
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm p-1"
                      title="Éditer le groupe"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setSelectedObject(group.id);
                        handleDelete();
                      }}
                      className="text-red-500 hover:text-red-700 text-sm p-1"
                      title="Supprimer le groupe"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      );
    }

    // Liste des quotes
    if (editMode === 'quotes') {
      const sortedQuotes = boardData?.quotes ? [...boardData.quotes].sort((a, b) => a.order - b.order) : [];
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode('menu')}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ←
            </button>
            <h3 className="font-semibold text-gray-800">Citations (glisser pour réorganiser) :</h3>
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
          
          {sortedQuotes.length > 0 && (
            <DraggableList
              items={sortedQuotes}
              onReorder={handleReorderQuotes}
                onEdit={(quote) => {
                  setEditMode('quote');
                  setSelectedObject(quote.id);
                  setEditData({ quote: { id: quote.id, text: quote.text, posX: quote.posX, posY: quote.posY, boardId: quote.boardId } });
                }}
                onDelete={(quoteId) => {
                  setSelectedObject(quoteId);
                  handleDelete();
                }}
                renderItem={(quote) => (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      💬 {quote.text.length > 50 ? quote.text.substring(0, 50) + '...' : quote.text}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode('quote');
                        setSelectedObject(quote.id);
                        setEditData({ quote: { id: quote.id, text: quote.text, posX: quote.posX, posY: quote.posY, boardId: quote.boardId } });
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setSelectedObject(quote.id);
                        handleDelete();
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      );
    }

    // Vue détail d'un groupe (nouveau écran)
    if (editMode === 'group-detail' && selectedGroup) {
      const currentGroup = boardData?.groups?.find(g => g.id === selectedGroup);
      if (!currentGroup) {
        setEditMode('groups');
        return null;
      }
      
      const sortedItems = currentGroup.items ? [...currentGroup.items].sort((a, b) => a.order - b.order) : [];
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditMode('groups');
                setSelectedGroup(null);
              }}
              disabled={isPending}
              className={`text-xl ${
                isPending 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ←
            </button>
            <div>
              <h3 className="font-semibold text-gray-800">📁 {currentGroup.name}</h3>
              <p className="text-xs text-gray-500">Gérer le contenu et les items</p>
            </div>
          </div>
          
          {/* Bouton pour éditer les infos du groupe */}
          <button
            onClick={() => {
              setEditMode('group');
              setSelectedObject(currentGroup.id);
              setEditData({ group: { id: currentGroup.id, name: currentGroup.name, posX: currentGroup.posX, posY: currentGroup.posY, boardId: currentGroup.boardId } });
            }}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            ✏️ Éditer les infos du groupe
          </button>
          
          {/* Section des items */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Items ({sortedItems.length})</h4>
              <button
                onClick={() => {
                  setEditMode('create-item');
                  setEditData({ item: { name: '', description: '', groupId: currentGroup.id } });
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                ➕ Ajouter
              </button>
            </div>
            
            {sortedItems.length > 0 ? (
              <DraggableList
                items={sortedItems}
                onReorder={(orderedIds) => handleReorderItems(currentGroup.id, orderedIds)}
                onEdit={(item) => {
                  setEditMode('item');
                  setSelectedObject(item.id);
                  setEditData({ item: { id: item.id, name: item.name, description: item.description, groupId: item.groupId } });
                }}
                onDelete={(itemId) => {
                  setSelectedObject(itemId);
                  handleDelete();
                }}
                renderItem={(item) => (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-800">{item.name}</h5>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button
                        onClick={() => {
                          setEditMode('item');
                          setSelectedObject(item.id);
                          setEditData({ item: { id: item.id, name: item.name, description: item.description, groupId: item.groupId } });
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm p-1"
                        title="Éditer l'item"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setSelectedObject(item.id);
                          handleDelete();
                        }}
                        className="text-red-500 hover:text-red-700 text-sm p-1"
                        title="Supprimer l'item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              />
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Aucun item dans ce groupe</p>
                <p className="text-xs mt-1">Cliquez sur &quot;Ajouter&quot; pour créer le premier item</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Formulaires d'édition
    const getBackMode = () => {
      if (editMode === 'item' || editMode === 'create-item') {
        return selectedGroup ? 'group-detail' : 'groups';
      }
      if (editMode === 'group' || editMode === 'create-group') return 'groups';
      if (editMode === 'quote' || editMode === 'create-quote') return 'quotes';
      if (editMode === 'group-detail') return 'groups';
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
              if (backMode === 'groups') {
                setSelectedGroup(null);
              }
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
             editMode === 'create-quote' ? 'Créer Citation' :
             editMode === 'group-detail' ? 'Détail du Groupe' : 'Éditer'}
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
    <div className="w-80 max-h-[80vh] overflow-y-auto relative">
      {/* Loading overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Mise à jour en cours...</span>
          </div>
        </div>
      )}
      
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