# Harness OS · Boot Sequence

An interactive, monochrome startup sequence for DeepSeek Harness. It occupies
the frame-wide `shell.overlay` seat on page load and holds at an access gate
until you start it. Click anywhere on the gate, click the **授予访问权限 / GRANT
ACCESS** action, or press **Enter / Space**. One click also unlocks the audio
that browsers keep locked behind a user gesture.

The overlay also replays when the desktop window comes back after being hidden
to the system tray. This is intentionally **not** the same as a normal taskbar
minimize: the watcher runs only in the Electron desktop shell, and it separates
a tray hide from a minimized window using the window's off-screen coordinates
and whether a resize occurred while hidden. Ordinary minimize/restore is
skipped; a tray hide/restore replays the sequence after at least 800 ms hidden.

## Install

This repository is a DSH **bundle**, not a standalone web page. The package
keeps its local name `@local/dsh-boot-spectacle` and `private: true`, so install
it from this folder rather than from npm.

1. Download this repository so that `package.json` sits at the repository root.
2. In DeepSeek Harness, install this folder as a bundle through Plugin Manager,
   or ask the DSH agent to call `install_bundle` with the absolute folder path.
3. Restart/reload DSH once. The boot overlay appears on the next page load.
   Click the access gate to start; browser autoplay requires that gesture.
4. `Ctrl+Shift+R` is a browser shortcut, not a command registered by this
   plugin. In the desktop shell, the overlay replays when the window is restored
   from the system tray; ordinary taskbar minimize/restore is skipped.

No build step is required: `client.js` is already the browser module. The
plugin uses the `shell.overlay` slot, `ctx.locale`, `ctx.slots` and the standard
`useSessions` props; verify it on the DSH version you target.

## The sequence

1. **Authorization** — a Harness OS HUD (`DEEPSEEK / SYNTHESIZE INTELLIGENCE /
   HARNESS OS`), profile clock, live session ID / session-count / status
   readouts, a self-check card, and the access gate. A spoken permission prompt
   plays here.
2. **Session profile** — real data from the active session, not design copy and
   not fabricated identity numbers: session ID, running state, total visible
   session count, local time and voice mode. The session title is deliberately
   omitted. Values are 12 px, labels 8.2 px, and the screen holds for 4 seconds.
3. **Permission read** — a full-HUD circular radar: concentric rings, an outer
   progress arc, spokes and ticks, and a single thin radar needle. The needle is
   driven by the same **radar** progress value as the circular arc, so both
   advance together; there are no trailing arcs, tick marks, wedge or triangle
   behind it. The radar starts a fresh full turn at **0%** when this stage
   begins: the arc and needle begin at the top and fill the whole circle over
   the 2.8-second read. The overall check rail is already at 50% at this point
   because the profile consumed the first half of the boot check; the radar's
   own readout runs 000 → 100. The amber and cyan diamond markers were removed.
   The full left/right HUD, waveform, footer, progress rail and background
   geometry stay visible. A screen-wide datum crosshair and a large orbital halo
   frame the composition.
4. **Verified** — the circular progress ring closes and turns cyan, a
   confirmation tone plays, and the status rail reports `PERMISSION
   AUTHORIZED`.
5. **Welcome** — a `WELCOME TO` line, white `DEEPSEEK HARNESS` plate, a diamond
   mark, and a final `进入系统 / ENTER` action. It closes on its own after a few
   seconds, or immediately via Enter/click.

Scene headlines, English subtitles and welcome lines enter with a per-character
typewriter and a blinking caret. The caret uses the surrounding text color, so
it is black inside the white name plate. Reduced-motion users see the full text
immediately.

Every scene transition includes a short monochrome glitch: scanline flicker,
two displaced horizontal bands, and a clipped horizontal jolt on the incoming
scene. It is decorative only (pointer-events none) and is disabled under
reduced motion.

The pacing is deliberate: the check runs for 6.8 seconds, the profile holds for
4 seconds, the radar's zero-to-full read takes 2.8 seconds (inside the
three-second limit), the verified hold is 1.2 seconds, welcome holds for 5.2
seconds, and the exit fade is 0.9
seconds. Scene entrances, radar needle advance, action pulse, waveform and voice
indicators were slowed to match.

## Interaction and sound

- `SKIP` leaves immediately; `Esc` also exits at any point.
- `AUDIO` mutes or restores the synthesized sound bed, UI tones, and voice.
- On the permission gate, the English prompt is attempted automatically. If the
  webview blocks autoplay, use the small **VOICE / EN** button to play it on
  demand. Starting the boot still needs a click or keypress.
- Loading sound is synthesized with the Web Audio API: a quiet low pad, a
  filtered noise bed, periodic radar scan pulses, a confirmation pair, and a
  soft completion chime. No external audio files or network calls are used.
- Four **pre-rendered neural female voice** clips are embedded directly in the
  client:
  - `Access permission required. Please authorize to continue.` (English)
  - `Access granted. Initializing Harness OS.` (English)
  - `欢迎回来，操作员。` (Chinese, before the welcome line)
  - `Verification complete. Welcome to DeepSeek Harness.` (English)
  The English lines use `en-GB-Sonia` at +18%; the Chinese line uses
  `zh-CN-XiaoxiaoNeural` at +35% for a quicker delivery.
- Keyboard focus is trapped inside the boot overlay; Enter starts and the final
  Enter dismisses. Reduced-motion users get the same readable states without
  rotation, pulses, glitch bands, typewriter timers, or scene transitions.

The profile reads the live session retained by the main view; it changes with
the actual session instead of using fixed identity numbers. Everything is CSS,
inline SVG, Web Audio, and embedded audio data. The sequence replays on each
page load and when the desktop window is restored from the system tray after
being hidden for at least 800 ms; ordinary taskbar minimize/restore is skipped.

## Voice assets

The four embedded MP3 clips were generated with Microsoft Edge neural TTS
(`en-GB-Sonia` and `zh-CN-XiaoxiaoNeural`). They are bundled for offline
playback; the plugin performs no network requests. If you redistribute the
audio outside this plugin, check Microsoft's service terms. The MIT license
below covers the plugin code, not those generated voice recordings.

## Privacy

The profile screen reads only the active session ID, running state, visible
session count, local clock and voice mode. It does not read message content,
make network calls, or collect analytics.

## License

MIT for the plugin code; see [LICENSE](LICENSE). The embedded TTS recordings
are excluded from that grant.
