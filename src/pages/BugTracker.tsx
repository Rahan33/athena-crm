import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Bug, LayoutDashboard, Plus, MoreHorizontal } from 'lucide-react';

const initialColumns = {
  todo: {
    name: 'To Do',
    items: [
      { id: '1', content: 'Fix memory leak in POS module', tag: 'P1', tagColor: 'bg-red-100 text-red-700' },
      { id: '2', content: 'Update dependencies for React 19', tag: 'Chore', tagColor: 'bg-gray-100 text-gray-700' }
    ]
  },
  inProgress: {
    name: 'In Progress',
    items: [
      { id: '3', content: 'Implement ReactFlow Journeys', tag: 'Feature', tagColor: 'bg-blue-100 text-blue-700' }
    ]
  },
  done: {
    name: 'Done',
    items: [
      { id: '4', content: 'Design landing page mockup', tag: 'Design', tagColor: 'bg-purple-100 text-purple-700' }
    ]
  }
};

export default function BugTracker() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCol = columns[source.droppableId as keyof typeof columns];
      const destCol = columns[destination.droppableId as keyof typeof columns];
      const sourceItems = [...sourceCol.items];
      const destItems = [...destCol.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems }
      });
    } else {
      const column = columns[source.droppableId as keyof typeof columns];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems }
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-slate-800">
            <Bug className="mr-3 text-red-500" />
            Bug Tracker & Sprints
          </h1>
          <p className="text-sm text-slate-500 mt-1">Drag and drop agile tracking</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Issue
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div key={columnId} className="flex flex-col bg-slate-100 rounded-xl w-80 shrink-0 max-h-full">
                  <div className="p-4 flex justify-between items-center border-b border-slate-200">
                    <h2 className="font-bold text-slate-700">{column.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{column.items.length}</span>
                      <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                  
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 p-4 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-4 mb-3 rounded-lg shadow-sm bg-white border border-slate-200 transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500 ring-opacity-50 rotate-2' : 'hover:border-indigo-300'}`}
                                      style={{ ...provided.draggableProps.style }}
                                    >
                                      <div className="font-medium text-slate-800 text-sm mb-3 leading-snug">{item.content}</div>
                                      <div className="flex justify-between items-center">
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${item.tagColor}`}>
                                          {item.tag}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">#{item.id}</span>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
