'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface DraggableListProps {
  items: Array<{
    id: string;
    name?: string;
    text?: string;
  }>;
  onReorder: (orderedIds: string[]) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  renderItem?: (item: any) => React.ReactNode;
  className?: string;
}

export default function DraggableList({ 
  items, 
  onReorder, 
  onEdit, 
  onDelete, 
  renderItem,
  className = '' 
}: DraggableListProps) {
  const [draggedItems, setDraggedItems] = useState(items);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(draggedItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setDraggedItems(newItems);
    onReorder(newItems.map(item => item.id));
  };

  // Sync with external items changes
  if (items.length !== draggedItems.length || 
      items.some((item, index) => item.id !== draggedItems[index]?.id)) {
    setDraggedItems(items);
  }

  const defaultRenderItem = (item: any) => (
    <div className="flex items-center justify-between">
      <span className="text-sm">{item.name || item.text}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="text-blue-500 hover:text-blue-700 text-xs"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-500 hover:text-red-700 text-xs"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''} ${className}`}
          >
            {draggedItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3 bg-white border rounded-lg cursor-move ${
                      snapshot.isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md'
                    } transition-all`}
                  >
                    {renderItem ? renderItem(item) : defaultRenderItem(item)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
