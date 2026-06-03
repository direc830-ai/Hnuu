import React, { useState } from 'react';
import { Upload, Map as MapIcon, Edit3, Trash2, Plus, Move, ZoomIn } from 'lucide-react';

const AdminMapEditor = () => {
  const [selectedMapId, setSelectedMapId] = useState(null);

  const maps = [
    { id: 'rasa', name: "Rasa Map", url: "/maps/0 floor.png", description: "RASA Club's Local & Ground Floor", status: 'Published', lastUpdated: 'Today' },
    { id: 'first_left', name: "1st Floor (Left)", url: "/maps/1 st floor left (club's spots).jpeg", description: "1st Floor Left - Club Spots & Labs", status: 'Published', lastUpdated: 'Yesterday' },
    { id: 'first_right', name: "1st Floor (Right)", url: "/maps/1st floor right.png", description: "1st Floor Right - Classrooms", status: 'Draft', lastUpdated: 'Last Week' },
    { id: 'second', name: "Second Floor", url: "/maps/2nd floor.png", description: "2nd Floor - Admin & Library", status: 'Published', lastUpdated: 'Oct 24, 2023' },
    { id: 'third', name: "Third Floor", url: "/maps/3rd Floor.png", description: "3rd Floor - Study Halls", status: 'Draft', lastUpdated: 'Sep 15, 2023' }
  ];

  const selectedMap = maps.find(m => m.id === selectedMapId);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Map Editor</h1>
          <p className="text-slate-500 font-medium">Upload, edit, and configure campus floor plans.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
          <Upload className="w-5 h-5" /> Upload New Map
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map List */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Available Maps</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{maps.length} total</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {maps.map((map) => (
              <div 
                key={map.id} 
                onClick={() => setSelectedMapId(map.id)}
                className={`p-4 border rounded-2xl hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group ${selectedMapId === map.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${selectedMapId === map.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                      <MapIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{map.name}</h4>
                      <p className="text-xs text-slate-500">{map.lastUpdated}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    map.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {map.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Edit Properties">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-md transition-colors" title="Delete Map">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-slate-800">Editor Workspace</span>
              <div className="h-4 w-px bg-slate-300"></div>
              {selectedMap ? (
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">{selectedMap.name}</span>
              ) : (
                <span className="text-xs font-medium text-slate-500 italic">Select a map to edit</span>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm" title="Pan Tool" disabled={!selectedMap}>
                <Move className={`w-4 h-4 ${!selectedMap && 'opacity-50'}`} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm" title="Add POI" disabled={!selectedMap}>
                <Plus className={`w-4 h-4 ${!selectedMap && 'opacity-50'}`} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm" title="Zoom In" disabled={!selectedMap}>
                <ZoomIn className={`w-4 h-4 ${!selectedMap && 'opacity-50'}`} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-100 relative flex items-center justify-center border-t border-slate-200 overflow-hidden" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {selectedMap ? (
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <img 
                  src={selectedMap.url} 
                  alt={selectedMap.name} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-300"
                />
                {/* Example POI markers could go here */}
              </div>
            ) : (
              <div className="text-center bg-white/80 p-6 rounded-2xl shadow-sm backdrop-blur-sm border border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-4">
                  <MapIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700">No Map Selected</h3>
                <p className="text-sm text-slate-500 mt-1">Select a map from the list to begin editing</p>
              </div>
            )}
          </div>
          
          {selectedMap && (
            <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>{selectedMap.description}</span>
              <span className="font-bold">100% Zoom</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMapEditor;
