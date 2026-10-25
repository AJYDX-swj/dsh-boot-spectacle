import os from 'node:os';

/**
 * Host half of the boot-spectacle bundle.
 *
 * The overture is browser-only. This half only exposes the local machine facts
 * the profile panel displays through `window.__DSH_BOOT_PROFILE__`, so the
 * values stay real per installation instead of being baked into the public
 * bundle. Everything visual and timed lives in the Client half.
 */
export const inject = ['webServer'];

function readLocalProfile() {
  let computer = '';
  let user = '';
  let ip = '';
  try {
    computer = os.hostname();
  } catch {
    computer = '';
  }
  try {
    user = os.userInfo().username;
  } catch {
    user = '';
  }
  try {
    const interfaces = os.networkInterfaces();
    const rows = Object.values(interfaces).flatMap((entries) => entries || []);
    const findAddress = (family) => {
      const row = rows.find(
        (entry) =>
          entry &&
          (entry.family === family || entry.family === (family === 'IPv4' ? 4 : 6)) &&
          !entry.internal,
      );
      return row ? row.address : '';
    };
    ip = findAddress('IPv4') || findAddress('IPv6') || '127.0.0.1';
  } catch {
    ip = '127.0.0.1';
  }
  return { computer, user, ip };
}

function readProfileResponse() {
  return JSON.stringify(readLocalProfile());
}

export function apply(ctx) {
  ctx.effect(() => {
    const profile = readLocalProfile();
    const payload = JSON.stringify(profile).replace(/</g, '\\u003c');
    const script = `<script>window.__DSH_BOOT_PROFILE__=${payload};</script>`;
    const disposeTap = ctx.webServer.tapIndex((html) =>
      html.includes('</head>') ? html.replace('</head>', () => script + '</head>') : html,
    );
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-boot/profile.json',
      handler(req, res) {
        if (req.method !== 'GET') {
          res.writeHead(405, { allow: 'GET' });
          res.end();
          return;
        }
        const body = readProfileResponse();
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
          'x-content-type-options': 'nosniff',
        });
        res.end(body);
      },
    });
    return () => {
      disposeTap();
      disposeRoute();
    };
  });
}
