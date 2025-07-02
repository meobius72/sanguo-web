
import React from 'react';
import styled from 'styled-components';
import { useGameStore } from '../stores/useGameStore';
import { initialTerritories } from '../data/initialGameData';

const TerritoryPath = styled.path`
  fill: #444;
  stroke: #888;
  stroke-width: 2;
  cursor: pointer;
  transition: fill 0.2s ease;

  &:hover {
    fill: #666;
  }
  
  &[data-selected='true'] {
    fill: #a89a2c;
  }
`;

const TerritoryText = styled.text`
  font-size: 16px;
  fill: white;
  pointer-events: none; /* 텍스트 클릭 방지 */
`;

export const Map = () => {
  const { selectTerritory, selectedTerritoryId } = useGameStore();

  return (
    <svg width="100%" height="600" viewBox="0 0 800 600">
      {Object.values(initialTerritories).map((territory) => (
        <React.Fragment key={territory.id}>
          <TerritoryPath
            d={territory.path}
            id={territory.id}
            onClick={() => selectTerritory(territory.id)}
            data-selected={selectedTerritoryId === territory.id}
            aria-label={territory.name}
          />
          <TerritoryText x={territory.path.split(' ')[0].split('M')[1].split(',')[0] * 1 + 25} y={territory.path.split(' ')[0].split('M')[1].split(',')[1] * 1 + 55}>
            {territory.name}
          </TerritoryText>
        </React.Fragment>
      ))}
    </svg>
  );
};
