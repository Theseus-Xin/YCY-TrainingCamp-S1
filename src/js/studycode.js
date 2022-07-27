
class BrakeBanner {
  constructor(selector) {

    this.width = window.innerWidth
    this.height = window.innerHeight
    console.log(this.height);
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: 0xffffff,
      resizeTo: window
    })

    this.stage = this.app.stage


    document.querySelector(selector).appendChild(this.app.view)

    this.loader = new PIXI.Loader()

    this.loader.add("btn.png", "images/btn.png")
    this.loader.add("btn_circle.png", "images/btn_circle.png")
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png")
    this.loader.add("brake_bike.png", "images/brake_bike.png")
    this.loader.add("brake_lever.png", "images/brake_lever.png")

    this.loader.load()

    this.loader.onComplete.add(() => {
      this.show()
    })
  }

  show () {
    const { bikeContainer, bikeLever } = this.createActionBike()

    const actionButton = this.createActionButton()

    const { particleContainer, start, pause } = this.createParticleContainer()
    actionButton.x = actionButton.y = 600

    actionButton.on("mousedown", () => {
      gsap.to(bikeLever, { duration: .3, rotation: Math.PI / 180 * -30 })
      gsap.to(bikeContainer, { duration: .3, y: bikeContainer.y + 30 })
      pause()
    })

    actionButton.on("mouseup", () => {
      gsap.to(bikeLever, { duration: .3, rotation: 0 })
      gsap.to(bikeContainer, { duration: .3, y: bikeContainer.y - 30 })
      start()
    })

    const resize = () => {
      bikeContainer.x = this.width - bikeContainer.width
      bikeContainer.y = this.height - bikeContainer.height
    }

    window.addEventListener('resize', resize)
    resize()
  }


  // 粒子
  createParticleContainer () {

    const self = this
    // 创建粒子
    const particleContainer = new PIXI.Container()


    // 某一个角度，持续移动
    particleContainer.rotation = 35 * Math.PI / 180
    particleContainer.pivot.x = this.width / 2
    particleContainer.pivot.y = this.height / 2

    particleContainer.x = this.width / 2
    particleContainer.y = this.height / 2
    this.stage.addChild(particleContainer)
    const particles = []
    // 多个颜色
    const particleColors = [0xf1cf54, 0xb5cea8, 0x000000, 0x818181]
    for (let i = 0; i < 10; i++) {
      const gr = new PIXI.Graphics()
      gr.beginFill(particleColors[Math.floor(Math.random() * particleColors.length)])
      gr.drawCircle(0, 0, 6)
      gr.endFill()

      const pItem = {
        sx: Math.random() * this.width,
        sy: Math.random() * this.height,
        x: 1,
        y: 1,
        gr
      }
      gr.x = pItem.sx
      gr.y = pItem.sy
      particleContainer.addChild(gr)
      particles.push(pItem)
    }
    let speed = 0 // 初始速度
    function loop () {
      speed += .5
      speed = Math.min(speed, 20)

      for (let i = 0; i < particles.length; i++) {
        const pItem = particles[i];
        pItem.gr.y += speed
        pItem.gr.scale.y = pItem.y
        pItem.gr.scale.x = pItem.x
        if (speed < 20) {
          pItem.gr.scale.y += 1
          pItem.gr.scale.x /= 2
        } else {
          pItem.gr.scale.y = 40
          pItem.gr.scale.x = 0.03
        }


        // 超出边界，回到顶部
        if (pItem.gr.y >= self.height) pItem.gr.y = 0
      }
    }

    // 按住停止
    // 回弹效果
    // 松开继续
    function start () {
      speed = 0
      for (let i = 0; i < particles.length; i++) {
        const pItem = particles[i];
        pItem.gr.scale.y = 1
        pItem.gr.scale.x = 1

        gsap.to(pItem.gr, { duration: .4, x: pItem.sx, y: pItem.sy - 20, ease: "elastic.out" })
      }
      gsap.ticker.add(loop)
    }

    function pause () {
      console.log('stop');
      gsap.ticker.remove(loop)
      for (let i = 0; i < particles.length; i++) {
        const pItem = particles[i];
        pItem.gr.scale.y = 1
        pItem.gr.scale.x = 1

        gsap.to(pItem.gr, { duration: .4, x: pItem.sx, y: pItem.sy, ease: "elastic.out" })
      }
    }
    start()


    return { particleContainer, start, pause }
  }



  // 车身
  createActionBike () {
    const bikeContainer = new PIXI.Container()
    this.stage.addChild(bikeContainer)

    bikeContainer.scale.x = bikeContainer.scale.y = 0.3

    const bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture)
    const bikeHandlerbar = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture)
    const bikeLever = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture)

    bikeContainer.addChild(bikeImage)
    bikeContainer.addChild(bikeLever)
    bikeContainer.addChild(bikeHandlerbar)

    bikeLever.pivot.x = 455
    bikeLever.pivot.y = 455

    bikeLever.x = 722
    bikeLever.y = 900


    return {
      bikeContainer,
      bikeLever
    }
  }


  // 按键
  createActionButton () {

    let actionButton = new PIXI.Container()

    this.stage.addChild(actionButton)

    actionButton.interactive = true
    actionButton.buttonMode = true

    let btnImage = new PIXI.Sprite(this.loader.resources['btn.png'].texture)
    let btnCircle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
    let btnCircle2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)

    actionButton.addChild(btnImage)
    actionButton.addChild(btnCircle)
    actionButton.addChild(btnCircle2)

    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2
    btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2
    btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2


    btnCircle.scale.x = btnCircle.scale.y = 0.8
    gsap.to(btnCircle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 })
    gsap.to(btnCircle, { duration: 1, alpha: 0, repeat: -1 })


    return actionButton
  }

}