/**
 * Dynamic resolution: watches frame times and moves the render scale between a floor and a
 * ceiling. Drops are quick, climbs are slow, and a scale that proved too slow is not tried
 * again for a while, so the picture does not pump up and down.
 */

export interface ResolutionOptions {
  start: number;
  min: number;
  max: number;
}

const SLOW_FRAME = 1 / 42; // seconds; averaging above this means we are dropping frames
const FAST_FRAME = 1 / 55; // seconds; averaging below this for a while means headroom
const SLOW_PATIENCE = 0.6; // seconds of slow frames before stepping down
const FAST_PATIENCE = 4; // seconds of fast frames before stepping up
const WARMUP = 2; // seconds after start ignored: shaders compile, caches fill
const STEP_DOWN = 0.15;
const STEP_UP = 0.1;
const CEILING_RELAX = 30; // seconds before a failed scale may be tried again

export class ResolutionGovernor {
  scale: number;
  private readonly min: number;
  private readonly max: number;
  private average = 1 / 60;
  private slowFor = 0;
  private fastFor = 0;
  private elapsed = 0;
  private ceiling: number;
  private ceilingSetAt = 0;

  constructor({ start, min, max }: ResolutionOptions) {
    this.scale = start;
    this.min = min;
    this.max = max;
    this.ceiling = max;
  }

  /** Feed one frame's duration. Returns the new scale when it changed, otherwise null. */
  sample(dt: number): number | null {
    this.elapsed += dt;
    // A tab switch or a hitch is not a trend.
    if (this.elapsed < WARMUP || dt > 0.25) return null;

    this.average += (dt - this.average) * 0.15;
    this.slowFor = this.average > SLOW_FRAME ? this.slowFor + dt : 0;
    this.fastFor = this.average < FAST_FRAME ? this.fastFor + dt : 0;

    if (this.elapsed - this.ceilingSetAt > CEILING_RELAX && this.ceiling < this.max) {
      this.ceiling = Math.min(this.max, this.ceiling + STEP_UP);
      this.ceilingSetAt = this.elapsed;
    }

    if (this.slowFor > SLOW_PATIENCE && this.scale > this.min) {
      this.ceiling = this.scale;
      this.ceilingSetAt = this.elapsed;
      return this.set(this.scale - STEP_DOWN);
    }
    if (this.fastFor > FAST_PATIENCE && this.scale < this.ceiling) {
      return this.set(this.scale + STEP_UP);
    }
    return null;
  }

  private set(scale: number): number {
    this.scale = Math.round(Math.min(this.max, Math.max(this.min, scale)) * 100) / 100;
    this.slowFor = 0;
    this.fastFor = 0;
    this.average = 1 / 60;
    return this.scale;
  }
}
