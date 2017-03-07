const _ = require('lodash');

export class Create {
  constructor(Game = window.GameInstance) {
    this.Game = Game;
  }

  get MAP_INSTANCE() {
    return this.Map;
  }

  fitWorld(width, height) {
    if(this._layers) {
      this._layers.forEach(layer => {
        layer.resize(width, height);
      });
    }
  }

  physics(system = Phaser.Physics.P2JS) {
    this.Game.physics.startSystem(system);

    this.BoundCollisionGroup = this.Game.physics.p2.createCollisionGroup();
    this.PlayerCollisionGroup = this.Game.physics.p2.createCollisionGroup();
  }

  world(name = 'map', image = 'tmw_desert_spacing') {
    this.Map = this.Game.add.tilemap(`${name}`);
    this.Map.addTilesetImage(`${image}`);
  }

  layers(name = []) {
    if(!this._layers) this._layers = [];

    name.forEach(n => {
      let layer = this.Map.createLayer(n);
      layer.resizeWorld();
      this._layers.push(layer);
    });

    this.Game.physics.p2.setBoundsToWorld(true, true, true, true, true);
  }

  labels(labels = []) {
    if(!this._labels) this._labels = [];

    labels.forEach(label => {
      let sign = _.find(this._signs, {
        name: label.text
      });

      let labelObject = new Label(sign.x, sign.y, label.font, label.text, label.size);

      labelObject.x = labelObject.x - labelObject.centerX;
      labelObject.y = labelObject.y - labelObject.height;

      this._labels.push(labelObject);
    });
  }

  collisionGroups(group = []) {
    if(!this._signs) this._signs = [];
    
    group.forEach(grp => {
      let objects = this.Game.physics.p2.convertCollisionObjects(this.Map, grp.name, grp.addToWorld);
      let index = 0;

      objects.forEach(obj => {
        obj.debug = !!window.GAME_DEBUG;
        obj.setCollisionGroup(this.BoundCollisionGroup);
        obj.collides(this.PlayerCollisionGroup);
        
        if(grp.name == 'Signs') {
          obj.name = this.Map.objects.Signs[index].name;
          index++;

          this._signs.push(obj);
        }
      });
    });
  }
}

export class Label extends Create {
  constructor(x, y, font, text, size) {
    super();

    this.label = this.Game.add.bitmapText(
      x,
      y,
      font,
      text,
      size
    );
  }

  get x() {
    return this.label.position.x;
  }

  get y() {
    return this.label.position.y;
  }

  set x(value) {
    this.label.left = value;
  }

  set y(value) {
    this.label.top = value;
  }

  get width() {
    return this.label.width;
  }

  get height() {
    return this.label.height;
  }

  get centerX() {
    return this.label.width/2;
  }

  get centerY() {
    return this.label.height/2;
  }

  get options() {
    return {
      x: this.label.x,
      y: this.label.y,
      font: this.label.font,
      text: this.label.text,
      size: this.label.size
    }
  }
}