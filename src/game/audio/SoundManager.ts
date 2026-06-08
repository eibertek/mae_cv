/**
 * Procedural 8-bit audio — no asset files required.
 * All sounds are synthesised via Web Audio API oscillators.
 */
const LS_MUTE_KEY = "mae_cv_muted";

export class SoundManager {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private musicScheduler?: ReturnType<typeof setTimeout>;
  private musicStopped = false;
  private baseVolume: number;

  constructor(ctx: AudioContext, baseVolume = 0.18) {
    this.ctx = ctx;
    this.baseVolume = baseVolume;
    this.masterGain = ctx.createGain();
    const muted = typeof window !== "undefined" && localStorage.getItem(LS_MUTE_KEY) === "1";
    this.masterGain.gain.value = muted ? 0 : baseVolume;
    this.masterGain.connect(ctx.destination);
  }

  setMuted(muted: boolean) {
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(muted ? 0 : this.baseVolume, t);
  }

  // ── Primitive helpers ────────────────────────────────────────────────────────

  private note(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "square",
    vol = 0.3,
  ) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    env.gain.setValueAtTime(vol, startTime + duration * 0.75);
    env.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  private sweep(
    freqStart: number,
    freqEnd: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "sine",
    vol = 0.3,
  ) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, startTime);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
    env.gain.setValueAtTime(vol, startTime);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  // ── SFX ─────────────────────────────────────────────────────────────────────

  /** Dramatic sting when battle starts */
  sfxBattleIntro() {
    const t = this.ctx.currentTime;
    // Rising stab chords
    [[261, 329, 392], [349, 440, 523]].forEach(([a, b, c], i) => {
      const off = t + i * 0.18;
      this.note(a, off, 0.28, "square", 0.2);
      this.note(b, off, 0.28, "square", 0.18);
      this.note(c, off, 0.28, "square", 0.15);
    });
    // Final high accent
    this.note(1047, t + 0.38, 0.22, "square", 0.22);
  }

  /** Mariano attacks — short sawtooth hit */
  sfxHit() {
    const t = this.ctx.currentTime;
    this.note(330, t, 0.05, "sawtooth", 0.4);
    this.note(220, t + 0.05, 0.09, "sawtooth", 0.3);
  }

  /** Ball throw arc */
  sfxBallThrow() {
    const t = this.ctx.currentTime;
    this.sweep(700, 200, t, 0.28, "sine", 0.32);
  }

  /** Ball shake (fail) — three pulses then a drop */
  sfxEscapeBall() {
    const t = this.ctx.currentTime;
    [0, 0.13, 0.26].forEach(off => this.note(260, t + off, 0.1, "square", 0.18));
    this.note(155, t + 0.42, 0.14, "sawtooth", 0.26);
  }

  /** Successful capture — rising arpeggio C-E-G-C */
  sfxCapture() {
    const t = this.ctx.currentTime;
    [261, 329, 392, 523].forEach((f, i) => this.note(f, t + i * 0.11, 0.18, "square", 0.28));
  }

  /** Pokémon defeated — sad descending scale */
  sfxDefeated() {
    const t = this.ctx.currentTime;
    [523, 440, 392, 330, 261].forEach((f, i) => this.note(f, t + i * 0.1, 0.13, "sawtooth", 0.22));
  }

  /** Player runs away */
  sfxRun() {
    const t = this.ctx.currentTime;
    this.sweep(600, 150, t, 0.22, "square", 0.28);
  }

  // ── Mall BGM ─────────────────────────────────────────────────────────────────

  startMallMusic() {
    this.musicStopped = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.value = 0.14;
    this.scheduleMallLoop(this.ctx.currentTime + 0.05);
  }

  private scheduleMallLoop(startTime: number) {
    if (this.musicStopped) return;

    const bpm = 108;
    const q = 60 / bpm;  // quarter ≈ 0.556s
    const e = q / 2;      // eighth
    const h = q * 2;      // half

    // Melody — triangle wave, soft and airy
    // 4 bars: C major → A minor → F major → G→C resolution
    const mel: [number, number, number][] = [
      // Bar 1 — C major
      [523, 0,         e],
      [659, e,         e],
      [784, e * 2,     e],
      [659, e * 3,     e],
      [523, e * 4,     e],
      [587, e * 5,     e],
      [659, e * 6,     h],
      // Bar 2 — A minor
      [440, q * 4,     e],
      [523, q * 4 + e, e],
      [659, q * 5,     e],
      [523, q * 5 + e, e],
      [440, q * 6,     q],
      [392, q * 7,     e],
      [440, q * 7 + e, e],
      // Bar 3 — F major
      [349, q * 8,     e],
      [440, q * 8 + e, e],
      [523, q * 9,     e],
      [659, q * 9 + e, e],
      [523, q * 10,    e],
      [440, q * 10 + e, e],
      [523, q * 11,    q],
      // Bar 4 — G → C
      [392, q * 12,    e],
      [494, q * 12 + e, e],
      [587, q * 13,    e],
      [659, q * 13 + e, e],
      [523, q * 14,    e],
      [440, q * 14 + e, e],
      [392, q * 15,    e],
      [523, q * 15 + e, e],
    ];

    // Bass — sine wave, warm and round
    const bass: [number, number, number][] = [
      [131, 0,       h * 0.88],   // C3 (bars 1-2)
      [131, h,       h * 0.88],
      [110, q * 4,   h * 0.88],   // A2 (bars 3-4)
      [110, q * 6,   h * 0.88],
      [87,  q * 8,   h * 0.88],   // F2 (bars 5-6)
      [87,  q * 10,  h * 0.88],
      [98,  q * 12,  h * 0.88],   // G2 (bar 7)
      [131, q * 14,  h * 0.88],   // C3 (bar 8 resolution)
    ];

    // Mid arpeggios — light chord colour between melody and bass
    const arp: [number, number, number][] = [
      [261, 0,       e * 0.8], [329, e * 0.5,  e * 0.8], [392, e,       e * 0.8],
      [261, q * 2,   e * 0.8], [329, q * 2 + e * 0.5, e * 0.8], [392, q * 3, e * 0.8],
      [220, q * 4,   e * 0.8], [261, q * 4 + e * 0.5, e * 0.8], [329, q * 5, e * 0.8],
      [220, q * 6,   e * 0.8], [261, q * 6 + e * 0.5, e * 0.8], [329, q * 7, e * 0.8],
      [175, q * 8,   e * 0.8], [220, q * 8 + e * 0.5, e * 0.8], [261, q * 9, e * 0.8],
      [175, q * 10,  e * 0.8], [220, q * 10 + e * 0.5, e * 0.8], [261, q * 11, e * 0.8],
      [196, q * 12,  e * 0.8], [247, q * 12 + e * 0.5, e * 0.8], [294, q * 13, e * 0.8],
      [196, q * 14,  e * 0.8], [247, q * 14 + e * 0.5, e * 0.8], [261, q * 15, e * 0.8],
    ];

    mel.forEach(([f, t, d]) => this.note(f, startTime + t, d, "triangle", 0.10));
    bass.forEach(([f, t, d]) => this.note(f, startTime + t, d, "sine",     0.12));
    arp.forEach(([f, t, d]) =>  this.note(f, startTime + t, d, "sine",     0.05));

    const loopLen = q * 16;
    const delay = Math.max(0, (startTime + loopLen - this.ctx.currentTime - 0.08) * 1000);
    this.musicScheduler = setTimeout(() => this.scheduleMallLoop(startTime + loopLen), delay);
  }

  // ── Work Shop BGM — "Office Hours" (G major, 132 BPM) ────────────────────────

  startWorkMusic() {
    this.musicStopped = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.value = 0.15;
    this.scheduleWorkLoop(this.ctx.currentTime + 0.05);
  }

  private scheduleWorkLoop(startTime: number) {
    if (this.musicStopped) return;

    const bpm = 132;
    const q = 60 / bpm;
    const e = q / 2;
    const h = q * 2;

    // Melody — bright square wave, upbeat G major
    const mel: [number, number, number][] = [
      // Bar 1 — G major ascending run
      [784, 0,          e], // G5
      [740, e,          e], // F#5
      [659, e * 2,      e], // E5
      [587, e * 3,      e], // D5
      [659, e * 4,      e], // E5
      [587, e * 5,      e], // D5
      [523, e * 6,      e], // C5
      [494, e * 7,      e], // B4
      // Bar 2 — call & answer
      [440, q * 4,      e], // A4
      [494, q * 4 + e,  e], // B4
      [523, q * 5,      e], // C5
      [587, q * 5 + e,  e], // D5
      [659, q * 6,      h], // E5 (hold)
      [587, q * 7 + e,  e], // D5
      // Bar 3 — G arpeggio bounce
      [392, q * 8,      e], // G4
      [494, q * 8 + e,  e], // B4
      [587, q * 9,      e], // D5
      [784, q * 9 + e,  e], // G5
      [587, q * 10,     e], // D5
      [494, q * 10 + e, e], // B4
      [392, q * 11,     e], // G4
      [440, q * 11 + e, e], // A4
      // Bar 4 — D7 → G resolution
      [587, q * 12,     e], // D5
      [523, q * 12 + e, e], // C5
      [494, q * 13,     e], // B4
      [440, q * 13 + e, e], // A4
      [392, q * 14,     h], // G4 (hold → loop)
      [494, q * 15 + e, e], // B4 pickup
    ];

    // Bass — walking triangle, punchy
    const bass: [number, number, number][] = [
      [98,  0,      q * 0.85], // G2
      [147, q,      q * 0.85], // D3
      [98,  q * 2,  q * 0.85], // G2
      [165, q * 3,  q * 0.85], // E3
      [131, q * 4,  q * 0.85], // C3
      [131, q * 5,  q * 0.85], // C3
      [147, q * 6,  q * 0.85], // D3
      [147, q * 7,  q * 0.85], // D3
      [98,  q * 8,  q * 0.85], // G2
      [98,  q * 9,  q * 0.85], // G2
      [98,  q * 10, q * 0.85], // G2
      [110, q * 11, q * 0.85], // A2
      [147, q * 12, q * 0.85], // D3
      [147, q * 13, q * 0.85], // D3
      [98,  q * 14, q * 0.85], // G2
      [98,  q * 15, q * 0.85], // G2
    ];

    mel.forEach(([f, t, d]) =>  this.note(f, startTime + t, d, "square",   0.11));
    bass.forEach(([f, t, d]) => this.note(f, startTime + t, d, "triangle", 0.14));

    const loopLen = q * 16;
    const delay = Math.max(0, (startTime + loopLen - this.ctx.currentTime - 0.08) * 1000);
    this.musicScheduler = setTimeout(() => this.scheduleWorkLoop(startTime + loopLen), delay);
  }

  // ── Skills Shop BGM — "Wild Area" (A minor pent., 120 BPM) ───────────────────

  startSkillsMusic() {
    this.musicStopped = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.value = 0.15;
    this.scheduleSkillsLoop(this.ctx.currentTime + 0.05);
  }

  private scheduleSkillsLoop(startTime: number) {
    if (this.musicStopped) return;

    const bpm = 120;
    const q = 60 / bpm; // 0.5s
    const e = q / 2;
    const h = q * 2;

    // Melody — A minor pentatonic (A C D E G), sawtooth edge
    const mel: [number, number, number][] = [
      // Bar 1 — ascending Am pent.
      [440, 0,          e], // A4
      [523, e,          e], // C5
      [587, e * 2,      e], // D5
      [659, e * 3,      e], // E5
      [784, e * 4,      e], // G5
      [659, e * 5,      e], // E5
      [587, e * 6,      e], // D5
      [523, e * 7,      e], // C5
      // Bar 2 — driving push
      [440, q * 4,      e], // A4
      [659, q * 4 + e,  e], // E5
      [784, q * 5,      e], // G5
      [880, q * 5 + e,  e], // A5
      [784, q * 6,      h], // G5 (hold)
      [659, q * 7 + e,  e], // E5
      // Bar 3 — tension phrase
      [587, q * 8,      e], // D5
      [523, q * 8 + e,  e], // C5
      [440, q * 9,      e], // A4
      [392, q * 9 + e,  e], // G4
      [440, q * 10,     e], // A4
      [523, q * 10 + e, e], // C5
      [587, q * 11,     e], // D5
      [659, q * 11 + e, e], // E5
      // Bar 4 — resolve down, harmonic minor spice (G#4 = 415 Hz)
      [784, q * 12,     e], // G5
      [659, q * 12 + e, e], // E5
      [587, q * 13,     e], // D5
      [523, q * 13 + e, e], // C5
      [415, q * 14,     e], // G#4 ← harmonic minor colour
      [440, q * 14 + e, e], // A4
      [494, q * 15,     e], // B4
      [440, q * 15 + e, e], // A4 → loop
    ];

    // Bass — driving pulse, sine
    const bass: [number, number, number][] = [
      [110, 0,      e * 0.8], [110, e,      e * 0.8], // A2 x2
      [110, e * 2,  e * 0.8], [110, e * 3,  e * 0.8],
      [110, q * 4,  e * 0.8], [110, q * 4 + e, e * 0.8],
      [98,  q * 5,  e * 0.8], [98,  q * 5 + e, e * 0.8], // G2
      [110, q * 6,  e * 0.8], [110, q * 6 + e, e * 0.8],
      [110, q * 7,  e * 0.8], [110, q * 7 + e, e * 0.8],
      [87,  q * 8,  e * 0.8], [87,  q * 8 + e, e * 0.8], // F2
      [87,  q * 9,  e * 0.8], [87,  q * 9 + e, e * 0.8],
      [110, q * 10, e * 0.8], [110, q * 10 + e, e * 0.8],
      [110, q * 11, e * 0.8], [110, q * 11 + e, e * 0.8],
      [82,  q * 12, e * 0.8], [82,  q * 12 + e, e * 0.8], // E2
      [82,  q * 13, e * 0.8], [82,  q * 13 + e, e * 0.8],
      [110, q * 14, e * 0.8], [110, q * 14 + e, e * 0.8], // A2
      [110, q * 15, e * 0.8], [110, q * 15 + e, e * 0.8],
    ];

    mel.forEach(([f, t, d]) =>  this.note(f, startTime + t, d, "sawtooth", 0.09));
    bass.forEach(([f, t, d]) => this.note(f, startTime + t, d, "sine",     0.13));

    const loopLen = q * 16;
    const delay = Math.max(0, (startTime + loopLen - this.ctx.currentTime - 0.08) * 1000);
    this.musicScheduler = setTimeout(() => this.scheduleSkillsLoop(startTime + loopLen), delay);
  }

  // ── Battle BGM ───────────────────────────────────────────────────────────────

  startBattleMusic() {
    this.musicStopped = false;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.value = 0.18;
    this.scheduleLoop(this.ctx.currentTime + 0.05);
  }

  private scheduleLoop(startTime: number) {
    if (this.musicStopped) return;

    const bpm = 168;
    const q = 60 / bpm;   // quarter note ≈ 0.357s
    const e = q / 2;       // eighth note

    // ── Melody (square wave) ──
    // 16-beat loop inspired by Pokémon wild battle energy
    const mel: [number, number, number][] = [
      // phrase 1 — ascending excitement
      [659, 0,       e],
      [784, e,       e],
      [988, e * 2,   e],
      [784, e * 3,   e],
      [659, e * 4,   e],
      [523, e * 5,   e],
      [659, e * 6,   e],
      [784, e * 7,   e],
      // phrase 2 — call & answer
      [880, q * 4,   e],
      [784, q * 4 + e, e],
      [659, q * 5,   e],
      [523, q * 5 + e, e],
      [440, q * 6,   q],
      [392, q * 7,   e],
      [440, q * 7 + e, e],
      // phrase 3 — tension build
      [523, q * 8,   e],
      [659, q * 8 + e, e],
      [784, q * 9,   e],
      [988, q * 9 + e, e],
      [784, q * 10,  e],
      [659, q * 10 + e, e],
      [523, q * 11,  e],
      [440, q * 11 + e, e],
      // phrase 4 — resolve back
      [349, q * 12,  e],
      [440, q * 12 + e, e],
      [523, q * 13,  e],
      [659, q * 13 + e, e],
      [523, q * 14,  q],
      [392, q * 15,  e],
      [440, q * 15 + e, e],
    ];

    // ── Bass (triangle wave) ──
    const bass: [number, number, number][] = [
      [131, 0,      q * 0.9],
      [165, q,      q * 0.9],
      [196, q * 2,  q * 0.9],
      [165, q * 3,  q * 0.9],
      [175, q * 4,  q * 0.9],
      [220, q * 5,  q * 0.9],
      [196, q * 6,  q * 0.9],
      [220, q * 7,  q * 0.9],
      [131, q * 8,  q * 0.9],
      [165, q * 9,  q * 0.9],
      [196, q * 10, q * 0.9],
      [165, q * 11, q * 0.9],
      [175, q * 12, q * 0.9],
      [131, q * 13, q * 0.9],
      [165, q * 14, q * 0.9],
      [196, q * 15, q * 0.9],
    ];

    mel.forEach(([f, t, d]) => this.note(f, startTime + t, d, "square",   0.11));
    bass.forEach(([f, t, d]) => this.note(f, startTime + t, d, "triangle", 0.13));

    const loopLen = q * 16;
    const delay = Math.max(0, (startTime + loopLen - this.ctx.currentTime - 0.08) * 1000);
    this.musicScheduler = setTimeout(() => this.scheduleLoop(startTime + loopLen), delay);
  }

  stopMusic() {
    this.musicStopped = true;
    if (this.musicScheduler !== undefined) {
      clearTimeout(this.musicScheduler);
      this.musicScheduler = undefined;
    }
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(0, t + 0.4);
  }
}
