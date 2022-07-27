class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window
    })

    document.querySelector(selector).appendChild(this.app.view)

    this.loader = new PIXI.Loader()

    this.loader.add("btn", "images/btn.png")
    this.loader.add("btn_circle", "images/btn_circle.png")
    this.loader.add("brake_handlerbar", "images/brake_handlerbar.png")
    this.loader.add("brake_bike", "images/brake_bike.png")
    this.loader.add("brake_lever", "images/brake_lever.png")

    this.loader.load()

    this.loader.onComplete.add(() => {
      this.show()
    })
  }

  show() {

    // 按钮
    let actionButton = new PIXI.Container()



    actionButton.interactive = true // 启动鼠标交互
    actionButton.buttonMode = true // 鼠标放置到图片上显示手指

    const btnImage = new PIXI.Sprite(this.loader.resources['btn'].texture)
    const btnCircle = new PIXI.Sprite(this.loader.resources['btn_circle'].texture)

    actionButton.addChild(btnImage)
    actionButton.addChild(btnCircle)


    const btnCircle2 = new PIXI.Sprite(this.loader.resources['btn_circle'].texture)
    actionButton.addChild(btnCircle2)

    actionButton.x = actionButton.y = 400

    actionButton.scale.x = actionButton.scale.y = .6

    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2
    btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2
    btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2

    btnCircle.scale.x = btnCircle.scale.y = 0.8

    gsap.to(btnCircle.scale, {
      duration: 1,
      x: 1.3,
      y: 1.3,
      repeat: -1
    })
    gsap.to(btnCircle, {
      duration: 1,
      alpha: 0,
      repeat: -1
    })


    const bikeContainer = new PIXI.Container()

    this.app.stage.addChild(bikeContainer)

    this.app.stage.addChild(actionButton)

    bikeContainer.scale.x = bikeContainer.scale.y = 0.3

    const bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike'].texture)
    const bikeHandlerbar = new PIXI.Sprite(this.loader.resources['brake_handlerbar'].texture)
    const bikeLever = new PIXI.Sprite(this.loader.resources['brake_lever'].texture)

    bikeContainer.addChild(bikeImage)

    bikeContainer.addChild(bikeHandlerbar)

    bikeLever.pivot.x = 455
    bikeLever.pivot.y = 455

    bikeLever.x = 722
    bikeLever.y = 900

    bikeImage.alpha = .5
    actionButton.on("mousedown", () => {
      gsap.to(bikeLever, {
        duration: .3,
        rotation: Math.PI / 180 * -30
      })
      gsap.to(bikeContainer, {
        duration: .3,
        y: bikeContainer.y + 30
      })
      gsap.to(bikeImage, {
        duration: .3,
        alpha: 1
      })
      // pause()
    })

    actionButton.on("mouseup", () => {
      gsap.to(bikeLever, {
        duration: .3,
        rotation: 0
      })
      gsap.to(bikeContainer, {
        duration: .3,
        y: bikeContainer.y - 30
      })
      gsap.to(bikeImage, {
        duration: .3,
        alpha: .5
      })
      // start()
    })

    // 创建粒子
    const particleContainer = new PIXI.Container()
    // 某一个角度，持续移动
    particleContainer.rotation = 35 * Math.PI / 180
    particleContainer.pivot.x = window.innerWidth / 2
    particleContainer.pivot.y = window.innerHeight / 2

    particleContainer.x = window.innerWidth / 2
    particleContainer.y = window.innerHeight / 2
    this.app.stage.addChild(particleContainer)
    const particles = []
    // 多个颜色
    const particleColors = [0xf1cf54, 0xb5cea8, 0x000000, 0x818181]
    for (let i = 0; i < 10; i++) {
      const gr = new PIXI.Graphics()
      gr.beginFill(particleColors[Math.floor(Math.random() * particleColors.length)])
      gr.drawCircle(0, 0, 6)
      gr.endFill()

      const pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr
      }
      gr.x = pItem.sx
      gr.y = pItem.sy

      particleContainer.addChild(gr)
      particles.push(pItem)
    }
    let speed = 0 // 初始速度
    function loop() {
      // console.log(particles);
      speed += .5
      speed = Math.min(speed, 20)

      for (let i = 0; i < particles.length; i++) {
        const pItem = particles[i];

        pItem.gr.y += speed
        pItem.gr.scale.y = 1
        pItem.gr.scale.x = 1 /*  */
        if (speed < 20) {
          pItem.gr.scale.y += 5
          pItem.gr.scale.x /= 2
        } else {
          pItem.gr.scale.y = 40
          pItem.gr.scale.x = 0.03
        }

        // 超出边界，回到顶部
        if (pItem.gr.y >= window.innerHeight) pItem.gr.y = 0
      }
    }

    gsap.ticker.add(loop)
    bikeContainer.addChild(bikeLever)


    const resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width
      bikeContainer.y = window.innerHeight - bikeContainer.height
    }

    window.addEventListener('resize', resize)
    resize()
  }

}