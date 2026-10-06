'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableRow, TableCell } from '@/components/ui/table';
import { GripVertical } from 'lucide-react';
import React from 'react';

interface SortableTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string;
}

export function SortableTableRow({ id, children, className, ...props }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? 'relative' : undefined,
    zIndex: isDragging ? 50 : 'auto',
  } as React.CSSProperties;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
      {...props}
    >
      <TableCell className="w-[40px] px-2 text-center align-middle">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          title="Geser untuk mengurutkan"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      {children}
    </TableRow>
  );
}
