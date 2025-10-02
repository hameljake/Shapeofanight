import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import SceneManager from './SceneManager';
import './ScrollController.css';

const SCENE_COUNT = 12; // Scenes 0-11

const ScrollController: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollTop = scrollContainerRef.current.scrollTop;
      const scrollHeight = scrollContainerRef.current.scrollHeight;
      const clientHeight = scrollContainerRef.current.clientHeight;
      
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) {
        setCurrentScene(0);
        setSceneProgress(0);
        return;
      }
      const scrollProgress = scrollTop / totalScrollable;

      // Map scroll progress to scene
      const sceneFloat = scrollProgress * (SCENE_COUNT - 1);
      const scene = Math.floor(sceneFloat);
      const progress = sceneFloat - scene;

      setCurrentScene(Math.max(0, Math.min(scene, SCENE_COUNT - 1)));
      setSceneProgress(progress);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="scroll-container" ref={scrollContainerRef}>
      {/* Fixed visualization layer */}
      <div className="visualization-fixed">
        <SceneManager 
          currentScene={currentScene} 
          sceneProgress={sceneProgress} 
        />
      </div>

      {/* Scrollable content sections */}
      <div className="scroll-content">
        {Array.from({ length: SCENE_COUNT }).map((_, i) => (
          <ScrollSection key={i} sceneIndex={i} />
        ))}
      </div>

      {/* Scene indicator (debug/navigation) */}
      <div className="scene-indicator">
        Scene {currentScene} ({Math.round(sceneProgress * 100)}%)
      </div>
    </div>
  );
};

interface ScrollSectionProps {
  sceneIndex: number;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ sceneIndex }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  return (
    <section 
      ref={ref} 
      className={`scroll-section ${inView ? 'in-view' : ''}`}
      data-scene={sceneIndex}
    >
      <div className="scroll-section-content">
        {/* Scene-specific text content will be rendered here */}
        {getSceneContent(sceneIndex)}
      </div>
    </section>
  );
};

// Placeholder content for each scene
const getSceneContent = (sceneIndex: number) => {
  const sceneContent = [
    {
      title: 'The Shape of a Night',
      copy: 'This is where my Phish story begins: Saratoga, July 4, 2014. Each dot is a song performance. Let\'s look at what makes a night take shape.',
    },
    {
      title: 'What is "the shape of a night"?',
      copy: 'Most Phish shows arc the same way—an opening stretch, a center mass, and peaks that threaten to spill over.',
    },
    {
      title: 'From one night to all nights',
      copy: 'Here\'s every performance mapped by musical similarity and context. Songs that play similar roles gravitate together.',
    },
    {
      title: 'Families and roles',
      copy: 'Patterns emerge: dependable openers gather here; Set-2 centerpieces there. Even ballads find their place as breath between sprints.',
    },
    {
      title: 'How nights peak',
      copy: 'Stack thousands of nights and a common silhouette appears—an early lift, a middle melt, a late sprint.',
    },
    {
      title: 'Jam geometry',
      copy: 'Jams don\'t just last; they cluster. Some songs are gravity wells.',
    },
    {
      title: 'Eras drift',
      copy: 'Across decades, roles migrate. Some songs stretch; others settle.',
    },
    {
      title: 'Venues as characters',
      copy: 'Certain rooms coax certain shapes. SPAC leans this way; MSG leans that.',
    },
    {
      title: 'Special architectures',
      copy: 'Some nights rewrite the blueprint.',
    },
    {
      title: 'Choose your night',
      copy: 'Pick a night. See its shape. Then see where it lives in the galaxy.',
    },
    {
      title: 'Methods & caveats',
      copy: 'We weighted performances by context; UMAP arranges similar contexts nearby. Similarity is musical + positional, not genre.',
    },
    {
      title: 'Return to SPAC',
      copy: 'Once you know the map, a single night comes into sharper focus. Here\'s the shape that started mine.',
    },
  ];

  const scene = sceneContent[sceneIndex];

  return (
    <div className="scene-text">
      <h2 className="scene-title">{scene.title}</h2>
      <p className="scene-copy">{scene.copy}</p>
    </div>
  );
};

export default ScrollController;

