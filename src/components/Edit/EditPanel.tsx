'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Board from '@/src/types/board';
import { 
  updateBoard, 
  updateGroup, 
  deleteGroup, 
  updateItem, 
  deleteItem, 
  updateQuote, 
  deleteQuote 
} from '@/src/actions/edit-actions';

type EditMode = 'board' | 'group' | 'item' | 'quote' | null;

interface EditData {
  board?: { id: string; title: string; description: string };
  group?: { id: string; name: string; posX: number; posY: number; boardId: string };
  item?: { id: string; name: string; description: string; groupId: string };
  quote?: { id: string; text: string; posX: number; posY: number; boardId: string };
}

interface EditPanelProps {
  boardData: Board;
}

export default function EditPanel({ boardData }: EditPanelProps) {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;
  
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
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
            if (editData.group) {
              result = await updateGroup(editData.group.id, editData.group);
            }
            break;
          case 'item':
            if (editData.item) {
              result = await updateItem(editData.item.id, editData.item, boardId);
            }
            break;
          case 'quote':
            if (editData.quote) {
              result = await updateQuote(editData.quote.id, editData.quote);
            }
            break;
        }
        
        if (result && !result.success) {
          alert(result.error || 'Failed to save changes');
        } else {
          // Reset edit mode after successful save
          setEditMode(null);
          setEditData({});
          setSelectedObject(null);
        }
      } catch (error) {
        console.error('Failed to save:', error);
        alert('Failed to save changes');
      }
    });
  };

  const handleDelete = async () => {
    if (!editMode || !selectedObject) return;
    
    if (!confirm('Are you sure you want to delete this item?')) return;
    
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
          alert(result.error || 'Failed to delete item');
        } else {
          setEditMode(null);
          setEditData({});
          setSelectedObject(null);
        }
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Failed to delete item');
      }
    });
  };

  const handleCancel = () => {
    router.push(`/${boardId}`);
  };

  const renderEditForm = () => {
    if (!editMode) {
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Select what to edit:</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                setEditMode('board');
                setEditData({ board: { id: boardId, title: boardData?.title || '', description: boardData?.description || '' } });
              }}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Edit Board Info
            </button>
            
            {boardData?.groups && boardData.groups.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Edit Groups:</p>
                {boardData.groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setEditMode('group');
                      setSelectedObject(g.id);
                      setEditData({ group: { id: g.id, name: g.name, posX: g.posX, posY: g.posY, boardId: g.boardId } });
                    }}
                    className="w-full px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    Group: {g.name}
                  </button>
                ))}
              </div>
            )}
            
            {boardData?.groups?.some(g => g.items && g.items.length > 0) && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Edit Items:</p>
                {boardData.groups.map((g) =>
                  g.items?.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => {
                        setEditMode('item');
                        setSelectedObject(i.id);
                        setEditData({ item: { id: i.id, name: i.name, description: i.description, groupId: i.groupId } });
                      }}
                      className="w-full px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                    >
                      Item: {i.name}
                    </button>
                  ))
                )}
              </div>
            )}
            
            {boardData?.quotes && boardData.quotes.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Edit Quotes:</p>
                {boardData.quotes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setEditMode('quote');
                      setSelectedObject(q.id);
                      setEditData({ quote: { id: q.id, text: q.text, posX: q.posX, posY: q.posY, boardId: q.boardId } });
                    }}
                    className="w-full px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                  >
                    Quote: {q.text.substring(0, 20)}...
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Edit {editMode.charAt(0).toUpperCase() + editMode.slice(1)}
          </h3>
          <button
            onClick={() => {
              setEditMode(null);
              setSelectedObject(null);
              setEditData({});
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ←
          </button>
        </div>

        {editMode === 'board' && editData.board && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
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

        {editMode === 'group' && editData.group && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
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

        {editMode === 'item' && editData.item && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
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

        {editMode === 'quote' && editData.quote && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
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
            {isPending ? 'Saving...' : 'Save'}
          </button>
          {editMode !== 'board' && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 max-h-96 overflow-y-auto">
      {renderEditForm()}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
        >
          Exit Edit Mode
        </button>
      </div>
    </div>
  );
}