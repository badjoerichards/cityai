class SimWorld {
    constructor(containerId) {
        this.containerId = containerId;
        this.agents = []; // Store agents for reference
        this.agentMap = new Map(); // Store agents by ID for quick access
        this.game = null; // Ensure game is initialized later
        this.initPhaserGame();

        // Add resize listener after game initialization
        window.addEventListener("resize", () => {
            if (this.game) this.resizeGame();
        });
    }

    initPhaserGame() {
        const container = document.querySelector(this.containerId);

        const config = {
            type: Phaser.AUTO,
            parent: this.containerId.replace("#", ""),
            width: 800,
            height: 800,
            backgroundColor: "#1d212d",
            scene: {
                preload: () => this.preloadScene(),
                create: () => this.createScene(),
                update: () => this.updateScene(),
            },
            canvasContextAttributes: {
                willReadFrequently: true,
            },
        };

        this.game = new Phaser.Game(config);
        console.log("Phaser game initialized:", this.game);
    }

    preloadScene() {
        console.log("Preloading assets.");
        this.agents.forEach((agent) => {
            if (agent.texture && agent.name) {
                console.log(`Loading texture for agent: ${agent.name} from ${agent.texture}`);
                this.game.scene.scenes[0].load.spritesheet(agent.name, agent.texture, {
                    frameWidth: agent.frameWidth,
                    frameHeight: agent.frameHeight,
                });
            } else {
                console.warn(`Missing texture or name for agent:`, agent);
            }
        });
    }

    createScene() {
        console.log("Creating scene.");
        this.agents.forEach((agent) => this.createAgent(agent));
    }

    updateScene() {
        // Future logic for updates can go here
    }

    resizeGame() {
        const container = document.querySelector(this.containerId);
        const size = container.offsetWidth;

        if (this.game && this.game.scale) {
            this.game.scale.resize(size, size);
        }
    }

    getDefaultScene() {
        if (this.game && this.game.scene.keys.default) {
            return this.game.scene.keys.default;
        }
        console.error("Default scene is not available.");
        return null;
    }

    addAgent(agentConfigs) {
        agentConfigs.forEach((config) => {
            if (!config.id) {
                console.error("Agent must have a unique 'id' property:", config);
                return;
            }
            if (this.agentMap.has(config.id)) {
                console.warn(`Agent with ID '${config.id}' already exists. Skipping:`, config);
                return;
            }

            this.agents.push(config);
            console.log(`Creating agent with ID: ${config.id}`);
            this.createAgent(config);
        });

        console.log("Agents loaded into the scene:", this.agents);
    }

    createAgent(agent) {
        const scene = this.getDefaultScene();
        if (!scene) {
            console.warn(`Scene not ready for agent: ${agent.id}. Retrying...`);
            setTimeout(() => this.createAgent(agent), 100);
            return;
        }

        if (this.agentMap.has(agent.id)) {
            console.warn(`Agent with ID '${agent.id}' already exists.`);
            return this.agentMap.get(agent.id);
        }

        const sprite = scene.add.sprite(agent.position_x || 100, agent.position_y || 100, agent.name);
        sprite.setScale(agent.scale || 1);
        sprite.setOrigin(agent.anchor || 0.5);
        sprite.visible = agent.visible !== false;

        sprite.setInteractive();
        sprite.on("pointerdown", () => {
            console.log(`Sprite clicked: ${agent.name}`);
            alert(`${agent.name} says: ${agent.description || "No description available."}`);
        });

        if (agent.animations) {
            Object.entries(agent.animations).forEach(([key, animation]) => {
                scene.anims.create({
                    key: `${agent.name}_${key}`,
                    frames: scene.anims.generateFrameNumbers(agent.name, { frames: animation.frames }),
                    frameRate: animation.fps,
                    repeat: -1,
                });
            });
            sprite.anims.play(`${agent.name}_${agent.state || "idle"}`);
        }

        this.agentMap.set(agent.id, sprite);
        console.log(`Agent added to agentMap with ID: ${agent.id}`);
        return sprite;
    }

	teleportAgentById(id, x, y) {
	    const sprite = this.agentMap.get(id);
	    if (!sprite) {
	        console.error(`No agent found with ID: ${id}`);
	        return;
	    }

	    sprite.x = x;
	    sprite.y = y;
	    console.log(`Teleported agent '${id}' to (${x}, ${y})`);
	}


    updateAgentStateById(id, state) {
        const sprite = this.agentMap.get(id);
        if (!sprite) {
            console.error(`No agent found with ID: ${id}`);
            return;
        }

        if (sprite.anims) {
            sprite.anims.play(`${sprite.texture.key}_${state}`);
            console.log(`Updated agent '${id}' to state '${state}'`);
        } else {
            console.warn(`No animations available for agent '${id}'`);
        }
    }
}
