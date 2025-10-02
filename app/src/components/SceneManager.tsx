import React, { useState, useEffect } from 'react';
import { SceneData } from '@/types';
import { loadSceneData } from '@/utils/dataLoader';
import VisualizationCanvas from './VisualizationCanvas';

// Scene components (to be implemented)
import Scene0Hero from './scenes/Scene0Hero';
import Scene1Timeline from './scenes/Scene1Timeline';
import Scene2Galaxy from './scenes/Scene2Galaxy';
import Scene3Roles from './scenes/Scene3Roles';
import Scene4Energy from './scenes/Scene4Energy';
import Scene5Jams from './scenes/Scene5Jams';
import Scene6Eras from './scenes/Scene6Eras';
import Scene7Venues from './scenes/Scene7Venues';
import Scene8Specials from './scenes/Scene8Specials';
import Scene9Search from './scenes/Scene9Search';
import Scene10Methods from './scenes/Scene10Methods';
import Scene11Return from './scenes/Scene11Return';

interface SceneManagerProps {
  currentScene: number;
  sceneProgress: number;
}

const SceneManager: React.FC<SceneManagerProps> = ({ currentScene, sceneProgress }) => {
  const [sceneData, setSceneData] = useState<Record<number, SceneData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preload data for current scene and adjacent scenes
    const scenesToLoad = [
      Math.max(0, currentScene - 1),
      currentScene,
      Math.min(11, currentScene + 1),
    ];

    Promise.all(
      scenesToLoad.map(async (sceneNum) => {
        if (!sceneData[sceneNum]) {
          const data = await loadSceneData(sceneNum);
          return { sceneNum, data };
        }
        return null;
      })
    ).then((results) => {
      const newData = { ...sceneData };
      results.forEach((result) => {
        if (result) {
          newData[result.sceneNum] = result.data;
        }
      });
      setSceneData(newData);
      setLoading(false);
    });
  }, [currentScene]);

  const currentData = sceneData[currentScene] || {};

  return (
    <VisualizationCanvas>
      {currentScene === 0 && (
        <Scene0Hero data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 1 && (
        <Scene1Timeline data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 2 && (
        <Scene2Galaxy data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 3 && (
        <Scene3Roles data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 4 && (
        <Scene4Energy data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 5 && (
        <Scene5Jams data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 6 && (
        <Scene6Eras data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 7 && (
        <Scene7Venues data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 8 && (
        <Scene8Specials data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 9 && (
        <Scene9Search data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 10 && (
        <Scene10Methods data={currentData} isActive={true} progress={sceneProgress} />
      )}
      {currentScene === 11 && (
        <Scene11Return data={currentData} isActive={true} progress={sceneProgress} />
      )}
      
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: 'var(--color-text-dim)'
        }}>
          Loading scene data...
        </div>
      )}
    </VisualizationCanvas>
  );
};

export default SceneManager;

