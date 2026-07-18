'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TableBody } from '@/components/ui/table';
import React, { useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface SortableItem {
  id: string;
}

interface SortableTableBodyProps<T extends SortableItem> {
  items: T[];
  onReorder: (items: { id: string; orderIdx: number }[]) => Promise<{ success: boolean; error?: string }>;
  children: ReactNode;
}

export function SortableTableBody<T extends SortableItem>({ items: initialItems, onReorder, children }: SortableTableBodyProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [prevInitialItems, setPrevInitialItems] = useState<T[]>(initialItems);

  // Deriving state from props as recommended by React for this pattern
  if (initialItems !== prevInitialItems) {
    setItems(initialItems);
    setPrevInitialItems(initialItems);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update local state immediately for snappy UI
      setItems(newItems);
      
      // Compute new orderIdx
      const payload = newItems.map((item, index) => ({
        id: item.id,
        orderIdx: index
      }));

      const promise = onReorder(payload).then(res => {
        if (!res.success) throw new Error(res.error);
        return res;
      });

      toast.promise(promise, {
        loading: 'Menyimpan urutan...',
        success: 'Urutan berhasil disimpan!',
        error: (err) => err.message || 'Gagal menyimpan urutan'
      });
    }
  }

  const childrenArray = React.Children.toArray(children);
  const sortedChildren = items.map(item => {
    return childrenArray.find((child: React.ReactNode) => {
      if (!React.isValidElement(child)) return false;
      const element = child as React.ReactElement<{ id?: string }>;
      const childId = element.props.id;
      if (childId) {
        return childId === item.id;
      }
      // Fallback to key if id prop is missing
      const key = child.key?.toString().replace('.$', '')?.replace('$', '');
      return key === item.id;
    });
  }).filter(Boolean);

  // If there are children that are not sortable (like empty state), append them
  const emptyChildren = childrenArray.filter((child: React.ReactNode) => {
    if (!React.isValidElement(child)) return false;
    return !child.key || child.key.toString().includes('empty');
  });

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
      accessibility={{ container: typeof document !== 'undefined' ? document.body : undefined }}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <TableBody>
          {sortedChildren.length > 0 ? sortedChildren : emptyChildren}
        </TableBody>
      </SortableContext>
    </DndContext>
  );
}
