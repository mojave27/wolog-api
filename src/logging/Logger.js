class Logger {
  constructor(objectName) {
    this.OBJECT_NAME = objectName
  }

  info = msg => {
      console.log(`[${this.OBJECT_NAME}] ${msg}`)
  }

}

export default Logger
