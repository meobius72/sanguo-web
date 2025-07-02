
import React from 'react';
import styled, { css } from 'styled-components';
import { useGameStore } from '../stores/useGameStore';
import { Map } from './Map'; // 개선된 SVG 지도 컴포넌트

// --- Styled Components ---
const GameContainer = styled.div`
  display: flex;
  font-family: 'Malgun Gothic', sans-serif;
  background-color: #1a1a1a;
  color: #e0e0e0;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const MapArea = styled.div`
  width: 70%;
  position: relative;
  text-align: center;
`;

const InfoPanel = styled.div`
  width: 25%;
  height: 80vh;
  background-color: #2a2a2a;
  border-left: 2px solid #555;
  padding: 20px;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  
  ${({ show }) => !show && css`
    transform: translateX(20px);
    opacity: 0;
    pointer-events: none;
  `}
`;

const GameControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const NextTurnButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #a83232;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #c84242;
  }
`;

// --- Components ---

const TerritoryInfo = () => {
  const selectedTerritoryId = useGameStore((state) => state.selectedTerritoryId);
  const territory = useGameStore((state) => state.territories[selectedTerritoryId]);

  return (
    <InfoPanel show={!!territory}>
      {territory ? (
        <>
          <h2>{territory.name}</h2>
          <p>군주: {territory.owner}</p>
          <hr/>
          <p>금: {territory.gold}</p>
          <p>군량: {territory.rice}</p>
          <hr/>
          <p>소속 장수:</p>
          <ul>
            {territory.officers.map(officer => <li key={officer}>{officer}</li>)}
          </ul>
        </>
      ) : (
        <p>영토를 선택하여 정보를 확인하세요.</p>
      )}
    </InfoPanel>
  );
};

export const ThreeKingdomsMap = () => {
  const { turn, nextTurn } = useGameStore();

  return (
    <GameContainer>
      <MapArea>
        <h1>삼국지 2 Vibe - 턴: {turn}</h1>
        <Map />
        <GameControlsContainer>
          <NextTurnButton onClick={nextTurn}>턴 종료</NextTurnButton>
        </GameControlsContainer>
      </MapArea>
      <TerritoryInfo />
    </GameContainer>
  );
};
