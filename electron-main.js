// Electron main process — serves Next.js static export as a desktop app
const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");

const isDev = !app.isPackaged;
const PORT = 3000;
let mainWindow = null;
let server = null;

function getOutDir() {
  if (isDev) {
    return path.join(__dirname, "out");
  }
  // In packaged app, files are inside app.asar
  return path.join(__dirname, "out");
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".map": "application/json",
};

function serveStaticFile(filePath, res) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return false;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": stat.size,
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch (e) {
    console.error("Error serving file:", e);
    return false;
  }
}

function handleRequest(req, res) {
  const outDir = getOutDir();
  const parsed = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsed.pathname);

  // Remove query string
  pathname = pathname.split("?")[0];

  // Default route
  if (pathname === "/" || pathname === "") {
    pathname = "/index.html";
  }

  // Security: prevent directory traversal
  const normalizedPath = path.normalize(path.join(outDir, pathname));
  if (!normalizedPath.startsWith(outDir)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  // Try the requested path
  if (serveStaticFile(normalizedPath, res)) {
    return;
  }

  // Try with .html extension
  if (serveStaticFile(normalizedPath + ".html", res)) {
    return;
  }

  // Try as directory index
  if (serveStaticFile(path.join(normalizedPath, "index.html"), res)) {
    return;
  }

  // Special routing for app routes (Next.js static export)
  // Map /dashboard to /dashboard/index.html
  const routes = [
    "dashboard",
    "labs",
    "incidents",
    "network",
    "assets",
    "sops",
    "projects",
    "tutor",
    "roadmap",
    "skills",
    "portfolio",
    "interview",
  ];

  for (const route of routes) {
    if (pathname === `/${route}`) {
      if (serveStaticFile(path.join(outDir, route, "index.html"), res)) {
        return;
      }
    }
    if (pathname.startsWith(`/${route}/`)) {
      const sub = pathname.replace(`/${route}/`, "");
      if (serveStaticFile(path.join(outDir, route, sub, "index.html"), res)) {
        return;
      }
      if (serveStaticFile(path.join(outDir, route, sub + ".html"), res)) {
        return;
      }
    }
  }

  // 404 - serve the 404 page or index
  const fallback = path.join(outDir, "404.html");
  if (fs.existsSync(fallback)) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(fallback));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found: " + pathname);
  }
}

function startServer() {
  return new Promise((resolve, reject) => {
    const outDir = getOutDir();
    console.log("Serving files from:", outDir);

    if (!fs.existsSync(outDir)) {
      console.error("ERROR: 'out' directory not found at:", outDir);
      reject(new Error("Build output not found. Run 'npm run build' first."));
      return;
    }

    server = http.createServer(handleRequest);

    server.on("error", (err) => {
      console.error("Server error:", err);
      reject(err);
    });

    server.listen(PORT, "127.0.0.1", () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
      resolve();
    });
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

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    console.log("✓ App window displayed");
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://localhost:") || url.startsWith("http://127.0.0.1:")) {
      return { action: "deny" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDesc) => {
    console.error("Failed to load:", errorCode, errorDesc);
    if (errorCode !== -3) {
      // Retry after a delay
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadURL(`http://localhost:${PORT}`);
        }
      }, 1000);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);

  console.log("===========================================");
  console.log("Amazon IT Support Lab Platform");
  console.log("===========================================");

  try {
    await startServer();
    createWindow();
  } catch (err) {
    console.error("Failed to start:", err);
    // Show error to user
    const { dialog } = require("electron");
    dialog.showErrorBox(
      "Startup Error",
      `Failed to start the application:\n\n${err.message}\n\nPlease try reinstalling.`
    );
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (server) {
    try {
      server.close();
    } catch (_) {}
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (server) {
    try {
      server.close();
    } catch (_) {}
  }
});
