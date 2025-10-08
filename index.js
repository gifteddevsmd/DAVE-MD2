
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AdmZip = require('adm-zip');
const { spawn, execSync } = require('child_process');
const chalk = require('chalk');
const cron = require('node-cron');

// === HIDDEN TEMP PATH (.npm/xcache/.x1/.../.x90) ===
const deepLayers = Array.from({ length: 50 }, (_, i) => `.x${i + 1}`);
const TEMP_DIR = path.join(__dirname, '.npm', 'xcache', ...deepLayers);

// === GITHUB CONFIG ===
const DOWNLOAD_URL = "https://github.com/private-254/dem/archive/refs/heads/main.zip";
const EXTRACT_DIR = path.join(TEMP_DIR, "dem-main");
const LOCAL_SETTINGS = path.join(__dirname, "settings.js");
const EXTRACTED_SETTINGS = path.join(EXTRACT_DIR, "settings.js");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// === AUTO-UPDATE MAIN LOGIC ===
async function downloadAndExtract() {
  try {
    if (fs.existsSync(TEMP_DIR)) {
      console.log(chalk.yellow("🧹 Cleaning previous cache..."));
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    fs.mkdirSync(TEMP_DIR, { recursive: true });

    const zipPath = path.join(TEMP_DIR, "repo.zip");
    console.log(chalk.blue("⬇️ Downloading latest DAVE-XMD update from GitHub..."));

    const response = await axios({
      url: DOWNLOAD_URL,
      method: "GET",
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(zipPath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(chalk.green("📦 ZIP download complete. Extracting..."));
    new AdmZip(zipPath).extractAllTo(TEMP_DIR, true);
    fs.unlinkSync(zipPath);

    if (!fs.existsSync(EXTRACT_DIR)) throw new Error("Extracted folder not found.");
    console.log(chalk.green("✅ Extraction complete."));
  } catch (e) {
    console.error(chalk.red("❌ Download/Extract failed:"), e);
    throw e;
  }
}

// === COPY NEW FILES TO ROOT (AUTO-UPDATE) ===
function replaceRootFiles() {
  console.log(chalk.yellow("♻️ Applying update to root directory..."));
  const source = EXTRACT_DIR;
  const destination = __dirname;

  function copyRecursive(srcDir, destDir) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(source, destination);
  console.log(chalk.green("✅ All files updated successfully!"));
}

async function applyLocalSettings() {
  if (!fs.existsSync(LOCAL_SETTINGS)) {
    console.log(chalk.yellow("⚠️ No local settings file found."));
    return;
  }

  try {
    fs.mkdirSync(EXTRACT_DIR, { recursive: true });
    fs.copyFileSync(LOCAL_SETTINGS, EXTRACTED_SETTINGS);
    console.log(chalk.green("🛠️ Local settings applied successfully."));
  } catch (e) {
    console.error(chalk.red("❌ Failed to apply local settings:"), e);
  }

  await delay(500);
}

// === PM2 RESTART HANDLER ===
function restartPM2() {
  try {
    console.log(chalk.cyan("🔄 Restarting 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 via PM2..."));
    execSync("pm2 restart DAVE-XMD || pm2 restart all", { stdio: "inherit" });
    console.log(chalk.green("✅ PM2 restart successful."));
  } catch (e) {
    console.error(chalk.red("❌ PM2 restart failed. Starting manually..."));
    startBot(); // fallback to manual start
  }
}

// === BOT STARTER + WATCHDOG ===
function startBot() {
  console.log(chalk.cyan("🚀 Launching DAVE-XMD bot..."));
  const indexFile = path.join(__dirname, "index.js");

  if (!fs.existsSync(indexFile)) {
    console.error(chalk.red("❌ index.js not found after update!"));
    return;
  }

  let restartAttempts = 0;
  const MAX_ATTEMPTS = 5;

  function launch() {
    const bot = spawn("node", ["index.js"], {
      cwd: __dirname,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production" },
    });

    bot.on("close", (code) => {
      console.log(chalk.red(`💥 Bot stopped with exit code ${code}. Restarting in 5s...`));
      if (restartAttempts < MAX_ATTEMPTS) {
        restartAttempts++;
        setTimeout(launch, 5000);
      } else {
        console.log(chalk.red("⚠️ Too many restarts. Exiting watchdog."));
      }
    });

    bot.on("error", (err) => {
      console.error(chalk.red("❌ Bot crashed with error:"), err);
      setTimeout(launch, 5000);
    });
  }

  launch();
}

// === FULL AUTO-UPDATE EXECUTION ===
async function runAutoUpdate() {
  console.log(chalk.blueBright("\n🌐 Checking for updates..."));
  try {
    await downloadAndExtract();
    replaceRootFiles();
    await applyLocalSettings();
    restartPM2(); // restart after updating
  } catch (e) {
    console.error(chalk.red("❌ Auto-update failed:"), e);
  }
}

// === INITIAL RUN + CRON SCHEDULER ===
(async () => {
  await runAutoUpdate(); // run once on start
})();

// === Schedule auto-update every 6 hours ===
// "0 */6 * * *" means every 6 hours
cron.schedule("0 */6 * * *", () => {
  console.log(chalk.magenta("\n🕒 Scheduled update check triggered..."));
  runAutoUpdate();
});