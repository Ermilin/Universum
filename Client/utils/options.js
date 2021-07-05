const options = {
  physics: {
    stabilization: {
      enabled: true,
      iterations: 600,
      updateInterval: 10,
    },
    barnesHut: {
      avoidOverlap: 0.1,
    },
  },
  nodes: {
    shape: 'dot',
    scaling: {
      label: {
        min: 5,
        max: 20,
        drawThreshold: 2,
        maxVisible: 20,
      },
    },
    font: {
      size: 12,
      face: 'Tahoma',
      color: '#fff',
    },
  },
  edges: {
    width: 0.5,
    selectionWidth: 2.5,
    color: { inherit: 'from' },
    smooth: {
      type: 'continuous',
    },
  },
  interaction: {
    tooltipDelay: 200,
  },
  groups: {
    A: {
      color: {
        background: '#FFF',
        border: '#FFF',
        highlight: { border: '#fff', background: '#FFF' },
      },
      shape: 'hexagon',
    },
    B: {
      color: {
        background: '#ff9f1c',
        border: '#ff9f1c',
        highlight: { border: '#fff', background: '#ff9f1c' },
      },
    },
    C: {
      color: {
        background: '#90f1ef',
        border: '#90f1ef',
        highlight: { border: '#fff', background: '#90f1ef' },
      },
    },
    D: {
      color: {
        background: '#fdffb6',
        border: '#fdffb6',
        highlight: { border: '#fff', background: '#fdffb6' },
      },
    },
    E: {
      color: {
        background: '#00ff00',
        border: '#00ff00',
        highlight: { border: '#fff', background: '#00ff00' },
      },
    },
    F: {
      color: {
        background: '#ffc6ff',
        border: '#ffc6ff',
        highlight: { border: '#fff', background: '#ffc6ff' },
      },
    },
    G: {
      color: {
        background: '#7678ed',
        border: '#7678ed',
        highlight: { border: '#fff', background: '#7678ed' },
      },
    },
    H: {
      color: {
        background: '#caffbf',
        border: '#caffbf',
        highlight: { border: '#fff', background: '#caffbf' },
      },
    },
    I: {
      color: {
        background: '#ffb561',
        border: '#ffb561',
        highlight: { border: '#fff', background: '#ffb561' },
      },
    },
  },
  layout: {
    improvedLayout: false,
    randomSeed: 11,
  },
};

export default options;
