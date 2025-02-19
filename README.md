# City AI visual front-end library

City AI is a world & city simulation and visual program for AI Agents.

This is its visual front-end library that is open-source and free to use.

This is the front-end and visual for City AI, and can be used for any AI Agent visual representations. You can see how we use it in action once City AI is ready. In the meantime, you can use this visual library to visualize any of your own deployed AI Agents.

In the meantime, you can see what AGENT1 it about at https://agent1.xyz/story

City AI is currently under development and will be ready in Q1-Q2 2025.

With the rise of AI Agents, we would like a fun and artistic way to visualize and simulate AI Agents' movements, interactions, behaviors and activities. While AI agents move and work at inhuman speeds, humans need a way to easily digest and understand their behavior.

By creating a fun and entertaining way to visualize AI Agents, we hope to make AI Agents more accessible and understandable to the general public. 


## Installation

1. Files should be served through a web server (local or hosted)
2. Load `sim_game.css` and `sim_game.js` in the HTML (i.e. `index.html`)
3. Open `index.html` in your browser


## Usage

### Basic Setup
```
html
<!-- Include required dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.9.0/phaser.min.js"></script>
<!-- Include City AI files -->
<link rel="stylesheet" href="./sim_game.css">
<script src="./sim_game.js"></script>
<!-- Create container for the simulation -->
<div id="sim_game_container"></div>
<script>
// Initialize the simulation
const simWorld = new SimWorld("#sim_game_container");
</script>
```


### Available Functions

#### addAgent(agentConfig)
Add an agent to the visual simulation. Example configuration:

```
javascript
simWorld.addAgent([{
id: "agent1", // Unique identifier
name: "AgentName", // Display name
frameWidth: 32, // Sprite frame width
frameHeight: 32, // Sprite frame height
animations: { // Animation definitions
idle: { frames: [0,1,2,3], fps: 8 },
walking: { frames: [4,5,6,7], fps: 8 }
},
texture: './path/to/sprite.png', // Sprite sheet path
scale: 2, // Display scale
position_x: 100, // Initial X position
position_y: 100, // Initial Y position
direction: 0, // Facing direction (0-360)
state: 'idle', // Initial animation state
description: "Agent description" // Shown on click
}]);
```


#### teleportAgentById(id, x, y)
Instantly move an agent to a new position:

```
javascript
simWorld.teleportAgentById("agent1", 200, 300);
```



#### updateAgentStateById(id, state)
Change an agent's animation state:
```
javascript
simWorld.updateAgentStateById("agent1", "walking");
```



## Styling
The simulation container can be customized through CSS. Default styling provides:
- Responsive square aspect ratio
- Maximum height of 60vh
- Centered positioning
- Custom border styling

## Technical Details
- Built on Phaser 3 game framework
- Requires jQuery for initialization
- Supports sprite sheet animations
- CORS-compliant server required for asset loading




## Functions available (see index.html for more details)
- addAgent() - Add an agent to the visual simulation
- teleportAgentById() - Teleport an agent to a new position



## Troubleshooting

### CORS Policy Error

If you see this error:
> Access to XMLHttpRequest at '/assets/characters/red/red.png' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app.

This occurs because you're trying to load files directly from the filesystem using the `file://` protocol. To fix this, serve your files through a local web server:

#### Option 1: Python Server (Recommended)

1. Using Python's built-in HTTP server (Simplest solution):
- Open a command prompt/terminal
- Navigate to your project directory
- Run one of these commands:
  - Python 3: python -m http.server 8000
  - Python 2: python -m SimpleHTTPServer 8000
- Then open http://localhost:8000 in your browser


#### Option 2: Node.js Server

2. Using Node.js's http-server (Another simple option):
   # Install globally
   npm install -g http-server
   
   # Navigate to your project directory and run
   http-server


## Credits

This project is under the Apache 2.0 License. ANY commercial or non-commercial use is allowed with mandatory credit to:
- Jeric T
- [CREEBank.org](https://CREEBank.org)
- [JericVerse.com](https://JericVerse.com)
- [AGENT1.xyz](https://AGENT1.xyz)

### Assets
- Red spirit character created by Penzilla Design

## License

Apache 2.0 License