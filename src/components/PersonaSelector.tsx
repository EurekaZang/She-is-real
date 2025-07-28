'use client';

import { Persona } from '@/app/types';

interface PersonaSelectorProps {
  personas: Persona[];
  selectedPersona: Persona | null;
  onSelectPersona: (persona: Persona) => void;
}

export function PersonaSelector({ personas, selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  return (
    <div className="w-1/4 min-w-[250px] bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">选择聊天伙伴</h2>
      <div className="space-y-2">
        {personas.map(persona => (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona)}
            className={`w-full text-left p-3 rounded-xl backdrop-blur-md transition-all duration-300 flex items-center gap-3
              ${selectedPersona?.id === persona.id
                ? 'bg-white/30 shadow-lg border border-white/50'
                : 'hover:bg-white/20 bg-white/10 border border-white/10'
              }
              hover:shadow-md hover:scale-[1.02]`}
          >
            <img 
              src={persona.avatar} 
              alt={persona.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className={`font-medium ${
                selectedPersona?.id === persona.id 
                  ? 'text-white' 
                  : 'text-gray-100'
              }`}>
                {persona.name}
              </p>
              <p className={`text-sm ${
                selectedPersona?.id === persona.id 
                  ? 'text-white/80' 
                  : 'text-gray-300'
              }`}>
                {persona.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
