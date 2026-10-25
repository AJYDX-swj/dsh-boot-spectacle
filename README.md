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
3. **Permission read** — while reading, the dial is deliberately minimal and
   **monochrome**: two white outer rings, a white progress arc, a white needle,
   and a white 000 → 100 readout, with no sector, tick detail or colored
   accents. The full HUD stays visible, but its accent variables are neutralized
   for this stage. When verification completes, the dial resolves into a
   **bright-blue main line**: the needle and progress arc keep their bright blue
   color and glow, while the 60-tick outer ring, concentric inner rings, spokes
   and crosshair are rendered faint. The four cardinal arrowheads and the
   translucent upper-left sector were removed. The needle is driven by the same
   **radar** progress value as the circular arc, so both advance together; there
   are no trailing arcs, tick marks, wedge or triangle behind it. The radar
   starts a fresh full turn at **0%** when this stage begins: the arc and needle
   begin at the top and fill the whole circle over the 2.2-second read. The
   overall check rail is already at 50% at this point because the profile
   consumed the first half of the boot check. A screen-wide datum crosshair and
   a large orbital halo frame the composition.
4. **Verified** — the circular progress ring closes, the needle/progress line
   turns bright blue while the surrounding dial stays subdued, a confirmation
   tone plays, and the status rail reports `PERMISSION AUTHORIZED`. The blue is
   not a hard switch: the dial begins desaturated and blooms into color over
   about 1.15 seconds, a blue ring expands once around it, and the small HUD
   accents cross-fade from neutral to blue. Reduced motion shows the final
   colored state immediately.
5. **Welcome** — a `WELCOME TO` line, white `DEEPSEEK HARNESS` plate, a diamond
   mark, and a final `进入系统 / ENTER` action. It does not auto-close: the ENTER
   button is the normal exit, with `SKIP` and `Esc` as the explicit escape
   hatches.

Scene headlines, English subtitles and welcome lines enter with a per-character
typewriter and a blinking caret. The reveal interval is doubled, so typing is at
least twice as slow as the earlier builds. The caret uses the surrounding text
color, so it is black inside the white name plate. Reduced-motion users see the
full text immediately.

Every scene transition includes a short monochrome glitch: scanline flicker,
two displaced horizontal bands, and a clipped horizontal jolt on the incoming
scene. It is decorative only (pointer-events none) and is disabled under
reduced motion.

The pacing is deliberate: the check runs for 6.2 seconds, the profile holds for
4 seconds, the radar's zero-to-full read takes 2.2 seconds (well inside the
three-second limit), the verified hold is 2.6 seconds, and the exit fade is 0.9
seconds. The welcome screen waits for input instead of auto-closing. Scene
entrances, radar needle advance, action pulse, waveform and voice indicators were
slowed to match.

## Interaction and sound

- `SKIP` leaves immediately; `Esc` also exits at any point.
- Only the **GRANT ACCESS** button starts the boot and only the **ENTER** button
  leaves the welcome screen. Clicking elsewhere, or pressing Enter/Space outside
  a focused button, does nothing. `SKIP` and `Esc` remain the explicit exits.
- `AUDIO` mutes or restores the synthesized sound bed, UI tones, and voice.
- On the permission gate, the English prompt is attempted automatically. If the
  webview blocks autoplay, use the small **VOICE / EN** button to play it on
  demand. Starting the boot needs the **GRANT ACCESS** button (or Skip/Esc).
- Loading sound is synthesized with the Web Audio API: a quiet low pad, a
  filtered noise bed, periodic radar scan pulses, a confirmation pair, and a
  soft completion chime. No external audio files or network calls are used.
- Sound effects run through a dedicated **+80% SFX gain**; narration is
  attenuated to **70% of the master level**, so effects sit forward while the
  voice stays clearly audible but subordinate.
- Four **pre-rendered neural female voice** clips are embedded directly in the
  client:
  - `Access permission required. Please authorize to continue.` (English)
  - `Access granted. Initializing Harness OS.` (English)
  - `欢迎回来，操作员。` (Chinese, before the welcome line)
  - `Verification complete. Welcome to DeepSeek Harness.` (English)
  The English lines use `en-GB-Sonia`; the permission and start prompts are
  delivered at +35%, the welcome line at +18%, and the Chinese line uses
  `zh-CN-XiaoxiaoNeural` at +24%. The Chinese clip's trailing silence is
  trimmed so the line stays 1.8 seconds long and the English welcome keeps its
  original start time; the words remain slower than the original +35% take and
  sit closer to the English line.
- Keyboard focus is trapped inside the boot overlay; standard Enter/Space
  activation on the focused button still works, but pressing those keys elsewhere
  does not advance. Reduced-motion users get the same readable states without
  rotation, pulses, glitch bands, typewriter timers, or scene transitions.

The profile screen shows the local computer name, OS username, first
non-internal IPv4/IPv6 address and a live local clock. Its label/value columns are
tightened and centered, labels use a higher-contrast white, and the values use a
larger type scale than the rest of the HUD. The Host half reads those values with
Node's `os` module, injects them into `window.__DSH_BOOT_PROFILE__` at page load,
and also serves the same JSON at `/dsh-boot/profile.json`; if the inline value is
missing, the Client requests that endpoint and updates the panel. Each
installation therefore shows its own machine's values. If both local paths are
unavailable, the panel shows dashes rather than another machine's details.
Everything is CSS, inline SVG, Web Audio, and embedded audio data. The sequence
replays on each page load and when the desktop window is restored from the system
tray after being hidden for at least 800 ms; ordinary taskbar minimize/restore is
skipped.

## Voice assets

The four embedded MP3 clips were generated with Microsoft Edge neural TTS
(`en-GB-Sonia` and `zh-CN-XiaoxiaoNeural`). They are bundled for offline
playback; the plugin performs no network requests. If you redistribute the
audio outside this plugin, check Microsoft's service terms. The MIT license
below covers the plugin code, not those generated voice recordings.

## Privacy

The profile screen displays the Host's computer name, OS username, first
non-internal IPv4/IPv6 address and the local clock. The Host reads them locally,
injects them into the page's boot script, and serves the same values from the
same-origin `/dsh-boot/profile.json` endpoint. The Client only renders them. The
plugin does not read message content, make external network calls for this data,
or collect analytics. The endpoint is served by the local DSH web server and is
not exposed by the plugin outside that origin. If both local paths are
unavailable, the panel shows dashes instead of machine-specific values.

## License

MIT for the plugin code; see [LICENSE](LICENSE). The embedded TTS recordings
are excluded from that grant.
