class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff
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
    const actionButton = this.createActionButton()
    actionButton.x = actionButton.y = 400

    //   const actionBike = this.createActionBike()
    // }

    // createActionBike () {
    const bikeContainer = new PIXI.Container()
    this.stage.addChild(bikeContainer)

    bikeContainer.scale.x = bikeContainer.scale.y = 0.3

    const bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture)
    const bikeHandlerbar = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture)
    bikeContainer.addChild(bikeImage)
    bikeContainer.addChild(bikeHandlerbar)
  }

  createActionButton () {

    let actionButton = new PIXI.Container()

    this.stage.addChild(actionButton)

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