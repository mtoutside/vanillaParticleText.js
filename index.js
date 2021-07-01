class Particle {
  constructor(canvas, ctx, colors, ww, wh, easing, ax, ay) {
    this.x = Math.random() * ww;
    this.y = Math.random() * wh;
    this.goal = {
      x: ax,
      y: ay,
    };
    this.r = (canvas.clientWidth / 2) * 0.003;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.easing = easing;
    this.ctx = ctx;
  }

  render() {
    this.x += (this.goal.x - this.x) * this.easing;
    this.y += (this.goal.y - this.y) * this.easing;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    this.ctx.fill();
  }
}

export default class ParticleText {
  constructor(options) {
    const target = "#particle";

    this.canvas = document.querySelector(target);
    this.ctx = this.canvas.getContext("2d");
    this.ww = this.canvas.width = this.canvas.clientWidth;
    this.wh = this.canvas.height = this.canvas.clientHeight;
    this.text = "";
    this.easing = 0.09;

    this.updateFunction = this.update.bind(this);
    this.run = true;
    this.isDown = false;

    if (options.speed) {
      if (options.speed == "middle") {
        this.easing = 0.07;
      } else if (options.speed == "slow") {
        this.easing = 0.04;
      } else if (options.speed == "high") {
        this.easing = 0.09;
      }
    }
    if (options.text) {
      this.text = options.text;
    } else {
      this.text = options;
    }
    this.colors = ["#F54064", "#F5D940", "#18EBF2"];
    if (options.colors) {
      this.colors = options.colors;
    }

    this.flg = false;
    if (this.text.indexOf("<br>") != -1) {
      this.flg = true;
    }

    this.particles = [];
    this.num = 0;

    // window.addEventListener("resize", this.initScene);
    window.addEventListener(
      "keydown",
      (eve) => {
        this.run = eve.key !== "Escape";
        if (eve.key === " ") {
          this.isDown = true;
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      (eve) => {
        if (eve.key === " ") {
          this.isDown = false;
        }
      },
      false
    );

    this.init();
  }

  initScene() {
    console.log("init scene");
    this.ww = this.canvas.width = this.canvas.clientWidth;
    this.wh = this.canvas.height = this.canvas.clientHeight;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var fSize = 2;
    this.ctx.font = "bold " + this.wh / fSize + "px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // テキストを描画 1行と複数行で処理を切り替え
    if (!this.flg) {
      this.drawOneText();
    } else {
      this.drawManyLineText();
    }

    // テキストが描画されたcanvasの画像データを取得
    this.data = this.ctx.getImageData(0, 0, this.ww, this.wh).data;
    console.log(this.data);
    // canvasをクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = "source-over";

    this.particles = [];

    for (var i = 0; i < this.ww; i += Math.round(this.ww / 200)) {
      for (var j = 0; j < this.wh; j += Math.round(this.ww / 200)) {
        // アルファ値が150より大きければパーティクル生成
        // この配列はRGBAの4つの値が height * width 入っている
        // 50 行目(y)の 200 列目(x)のアルファ値(200, 50)を見たいなら
        // data[50 * (width * 4) + (200 * 4) + 3]
        if (this.data[(i + j * this.ww) * 4 + 3] > 150) {
          this.particles.push(
            new Particle(
              this.canvas,
              this.ctx,
              this.colors,
              this.ww,
              this.wh,
              this.easing,
              i,
              j
            )
          );
        }
      }
    }

    this.num = this.particles.length;
  }
  drawOneText() {
    var hp = 2;
    if (this.canvas.height <= 300 && this.canvas.width > 768) {
      hp = 1.5;
    }
    this.ctx.fillText(this.text, this.ww / 2, this.wh / hp, this.ww);
  }

  drawManyLineText() {
    var tagetString = this.text;
    var arrayStrig = tagetString.split("<br>");
    var height = this.wh / arrayStrig.length;

    var h = 0.8;
    for (var i = 0; i < arrayStrig.length; i++) {
      this.ctx.fillText(arrayStrig[i], this.ww / 2, height * h);
      h += this.ww / 1300;
    }
  }

  init() {
    this.initScene();
    this.update();
  }

  update() {
    if (this.run) {
      this.reqId = requestAnimationFrame(this.updateFunction);
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (var i = 0; i < this.num; i++) {
      this.particles[i].render();
    }
  }
}

(() => {
  // 一番シンプル
  //オプション付き
  //     text: "PARTICLE ♡", // 表示させたいテキスト
  //     colors:["#F54064","#F5D940", "#18EBF2"], // パーティクルの色を複数指定可能
  //     speed: "high",  // slow, middle, high の3つから選んでください。
  // });
  new ParticleText({
    text: "DOOM",
    colors: ["#2d0625", "#f662d1"],
    speed: "slow",
  });
})();
