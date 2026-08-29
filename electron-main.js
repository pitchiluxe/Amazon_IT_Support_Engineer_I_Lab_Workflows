// Electron main process — wraps the Next.js production build
// so the platform can be launched as a standalone Windows desktop app.
const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

const isDev = !app.isPackaged;
const NEXT_PORT = 3000;
let nextServer = null;
let mainWindow = null;

function waitForServer(url, timeoutMs = 60000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          resolve();
        } else if (Date.now() - started > timeoutMs) {
          reject(new Error("Server start timeout"));
        } else {
          setTimeout(tryOnce, 500);
        }
      });
      req.on("error", () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error("Server start timeout"));
        } else {
          setTimeout(tryOnce, 500);
        }
      });
      req.setTimeout(2000, () => req.destroy());
    };
    tryOnce();
  });
}

function startNextServer() {
  return new Promise((resolve, reject) => {
    if (isDev) {
      nextServer = spawn("npx", ["next", "dev", "-p", String(NEXT_PORT)], {
        cwd: __dirname,
        shell: true,
        stdio: "pipe",
      });
    } else {
      nextServer = spawn("npx", ["next", "start", "-p", String(NEXT_PORT)], {
        cwd: __dirname,
        shell: true,
        stdio: "pipe",
      });
    }
    nextServer.stdout?.on("data", (d) => process.stdout.write(`[next] ${d}`));
    nextServer.stderr?.on("data", (d) => process.stderr.write(`[next] ${d}`));
    nextServer.on("error", reject);
    waitForServer(`http://localhost:${NEXT_PORT}`)
      .then(resolve)
      .catch(reject);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    show: false,
    backgroundColor: "#0b1020",
    title: "Amazon IT Support Lab Platform",
    icon: path.join(__dirname, "build", "icon.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${NEXT_PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  try {
    await startNextServer();
    createWindow();
  } catch (err) {
    console.error("Failed to start Next.js server:", err);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (nextServer) nextServer.kill();
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("before-quit", () => {
  if (nextServer) {
    try {
      nextServer.kill();
    } catch (_) {}
  }
});
