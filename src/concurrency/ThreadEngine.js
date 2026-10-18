export class ThreadEngine {
  constructor(onTickCallback, speed = 1000) {
    this.onTick = onTickCallback;
    this.speed = speed;
    this.timer = null;
    this.isRunning = false;
    this.tickCount = 0;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.tickCount++;
      if (this.onTick) this.onTick(this.tickCount);
    }, this.speed);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timer);
    this.timer = null;
  }

  step() {
    this.tickCount++;
    if (this.onTick) this.onTick(this.tickCount);
  }

  reset() {
    this.pause();
    this.tickCount = 0;
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
    if (this.isRunning) {
      this.pause();
      this.start();
    }
  }
}