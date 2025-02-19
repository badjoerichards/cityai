// Remove any existing SimWorld to prevent conflicts
if (window.SimWorld) {
    delete window.SimWorld;
  }
  
  class SimWorld {
    constructor(containerId) {
      this.config = {
        type: Phaser.AUTO,
        parent: containerId.replace('#', ''),
        width: 800,
        height: 600,
        backgroundColor: '#000000',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: {
          preload: this.preload.bind(this),
          create: this.create.bind(this),
          update: this.update.bind(this),
        },
        canvasStyle: 'width: 100%; height: 100%;',
        willReadFrequently: true
      };
  
      this.pendingAgents = [];
      this.game = new Phaser.Game(this.config);
      this.agents = new Map();
    }
  
    preload() {
      this.scene = this.game.scene.scenes[0];
    }
  
    create() {
      this.scene.cameras.main.setBackgroundColor('#000000');
      
      if (this.pendingAgents.length > 0) {
        this.pendingAgents.forEach(config => this._createAgent(config));
        this.pendingAgents = [];
      }
    }
  
    update() {
      this.agents.forEach(agent => {
        if (agent.sprite && agent.currentState) {
          const animKey = `${agent.config.id}_${agent.currentState}`;
          if (agent.sprite.anims && !agent.sprite.anims.isPlaying) {
            agent.sprite.anims.play(animKey);
          }
        }
      });
    }
  
    addAgent(configs) {
      if (!this.scene || !this.scene.textures) {
        this.pendingAgents.push(...configs);
        return;
      }
  
      configs.forEach(config => {
        if (!this.scene.textures.exists(config.id)) {
          this.scene.load.spritesheet(config.id, config.texture, {
            frameWidth: config.frameWidth,
            frameHeight: config.frameHeight
          });
          
          this.scene.load.once('complete', () => {
            this._createAgent(config);
          });
          
          this.scene.load.start();
        } else {
          this._createAgent(config);
        }
      });
    }
  
    _createAgent(config) {
      Object.entries(config.animations).forEach(([name, anim]) => {
        const animKey = `${config.id}_${name}`;
        try {
          // Try to remove existing animation
          const existingAnim = this.scene.anims.get(animKey);
          if (existingAnim) {
            this.scene.anims.remove(animKey);
          }
  
          // Create new animation
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(config.id, {
              frames: anim.frames
            }),
            frameRate: anim.fps,
            repeat: -1
          });
        } catch (error) {
          console.error('Animation creation error:', error);
        }
      });
  
      const sprite = this.scene.add.sprite(
        config.position_x,
        config.position_y,
        config.id
      );
      sprite.setScale(config.scale);
  
      this.agents.set(config.id, {
        sprite,
        config,
        currentState: config.state
      });
  
      const initialAnimKey = `${config.id}_${config.state}`;
      try {
        sprite.anims.play(initialAnimKey);
      } catch (error) {
        console.error('Animation play error:', error);
      }
    }
  
    teleportAgentById(id, x, y) {
      const agent = this.agents.get(id);
      if (agent?.sprite) {
        agent.sprite.x = x;
        agent.sprite.y = y;
      }
    }
  
    updateAgentStateById(id, state) {
      const agent = this.agents.get(id);
      if (agent?.sprite) {
        agent.currentState = state;
        const animKey = `${id}_${state}`;
        try {
          agent.sprite.anims.play(animKey);
        } catch (error) {
          console.error('State update animation error:', error);
        }
      }
    }
  }
  
  window.SimWorld = SimWorld; 