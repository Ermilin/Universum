export function setNodeShape(status) {
    switch (status) {
      case 'Critical':
        return "triangle"
        break;
      case 'Warning':
        return "triangle"
        break;
      default:
        return "dot"
    }
  }

  export function setNodeValue(status) {
    switch (status) {
      case 'Critical':
        return 15
        break;
      case 'Warning':
        return 10
        break;
      default:
        return 3
    }
  }
  
  export function setStatusColor(status) {
    switch (status) {
      case 'Critical':
        return ({
          background: "#f00",
          border: "#f00"
        })
        break;
      case 'Warning':
        return ({
          background: "#ff0",
          border: "#f00"
        })
        break;
      default:
        return
    }
  }

  export const animationOptions = {
    scale: 1.0,
    animation: {
      duration: 1000,
      easingFunction: "easeInOutQuad"
    }  
  };