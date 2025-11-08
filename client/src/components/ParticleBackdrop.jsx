import { memo, useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function ParticleBackdrop() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = {
    fullScreen: false,
    background: {
      color: "transparent",
    },
    fpsLimit: 40,
    detectRetina: true,
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 80,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ["#9b66ff", "#f472d0", "#ffffff"],
      },
      links: {
        color: "#7c3aed",
        distance: 130,
        enable: true,
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: { min: 0.2, max: 0.7 },
        direction: "none",
        outModes: {
          default: "out",
        },
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 75,
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 0.5, max: 2.2 },
      },
    },
  };

  return (
    <Particles
      id="publicfeed-particles"
      className="absolute inset-0 -z-10"
      init={particlesInit}
      options={options}
    />
  );
}

export default memo(ParticleBackdrop);



