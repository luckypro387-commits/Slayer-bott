import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as satoriModule from "satori";

let satori: any;
const rawSatori = satoriModule as any;
if (typeof rawSatori.default === "function") {
  satori = rawSatori.default;
} else if (rawSatori.default && typeof rawSatori.default.default === "function") {
  satori = rawSatori.default.default;
} else {
  satori = rawSatori;
}
import { Resvg } from "@resvg/resvg-js";
import React from "react";
import { parseMotd, MotdSegment } from "../src/utils/motdParser.ts";

// Safely determine directory name for both ESM and CJS environments
function getDirname(): string {
  try {
    if (typeof import.meta !== "undefined" && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch (err) {
    // Ignore
  }
  return typeof __dirname !== "undefined" ? __dirname : process.cwd();
}

export const app = express();
const PORT = 3000;

// Simple disk-persisted and in-memory cache for server icons
const cacheFilePath = path.join(process.cwd(), "icon-cache.json");
const iconCache = new Map<string, string>();

// Load initial cache from disk if it exists
try {
  if (fs.existsSync(cacheFilePath)) {
    const rawData = fs.readFileSync(cacheFilePath, "utf-8");
    const parsed = JSON.parse(rawData);
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === "string") {
        iconCache.set(key, val);
      }
    }
    console.log(`Loaded ${iconCache.size} server icons from disk cache.`);
  }
} catch (err) {
  console.error("Failed to load icon cache:", err);
}

function saveIconToCache(serverName: string, iconBase64: string) {
  const key = serverName.toLowerCase().trim();
  if (!iconBase64 || iconBase64 === DEFAULT_ICON_BASE64) return;
  if (iconCache.get(key) === iconBase64) return;

  iconCache.set(key, iconBase64);
  try {
    const obj = Object.fromEntries(iconCache.entries());
    fs.writeFileSync(cacheFilePath, JSON.stringify(obj, null, 2), "utf-8");
    console.log(`Saved icon for ${key} to disk cache.`);
  } catch (err) {
    console.error("Failed to save icon cache to disk:", err);
  }
}

// Helper to sanitize and ensure perfectly valid padding for Satori base64 image decoding
function safeBase64DataUri(uri: string): string {
  if (!uri || typeof uri !== "string") return uri;
  if (!uri.startsWith("data:")) return uri;
  const parts = uri.split(",");
  if (parts.length < 2) return uri;
  let b64 = parts[1].replace(/\s/g, ""); // Strip any whitespace
  while (b64.length % 4 !== 0) {
    b64 += "=";
  }
  return `${parts[0]},${b64}`;
}

// Default server icon in base64 format (a high-quality, pixel-art cobblestone or grass block)
const DEFAULT_ICON_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzsIOGSoThZERRy1CkUoEGqFVh1MXvohSBpYHAWXD06Lg4+GxUFXwdVb8OHgIsjVwUlXoUhfXCpYxMTLce+e++fev8O/3WClmdV0Dshqmno6ERYz87vY6Ioe+tGPEGIIIDMzdV6YpMv7XmPDo6vYI+Pez+Nf1KMy4AOIn8S8YIdXjZ5YtXasf957uNiryxPnzS9n8fK88fIcrzxvPjxXPO88vFw8r1z8vPjxXPF88vBScXzxvPJwy3PF88pDzePtX/A8erjYrcvzxMtx/PJwcXGxV9fnmZfjePni4uKyrs8zL8bx8sXFxUVDl2dZjmNeXl4eNjS0eZZleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQWOfZ1meNTS0eZbleeI85uXhQf3MAsg0zDzMPMx8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfP/++f/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/+j/6P/o/0H9zAKYfsw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfMw8zDzMfP7///8BAAEAAADwPwAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

let monocraftFontBuffer: Buffer | null = null;

async function loadGoogleFontTtf(fontName: string): Promise<Buffer> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}`;
    console.log(`Querying Google Fonts CSS for ${fontName}...`);
    const cssRes = await fetch(cssUrl);
    if (!cssRes.ok) throw new Error(`Failed to fetch CSS for ${fontName}: ${cssRes.status}`);
    const cssText = await cssRes.text();
    const match = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
    if (!match) {
      throw new Error(`No TTF font URL found in CSS for ${fontName}`);
    }
    const ttfUrl = match[1];
    console.log(`Downloading ${fontName} TTF from: ${ttfUrl}...`);
    const ttfRes = await fetch(ttfUrl);
    if (!ttfRes.ok) throw new Error(`Failed to fetch TTF for ${fontName}: ${ttfRes.status}`);
    const arrayBuffer = await ttfRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err: any) {
    console.error(`Dynamic load of Google Font ${fontName} failed:`, err.message);
    throw err;
  }
}

// Download a crisp pixel/Minecraft font for Satori text rendering
async function getFont(): Promise<Buffer> {
  if (monocraftFontBuffer) return monocraftFontBuffer;

  // 1. Try reading the updated local Minecraft font first
  try {
    const pathsToTry = [
      path.join(process.cwd(), "Font", "MinecraftTen-VGORe.ttf"),
      path.join(getDirname(), "..", "Font", "MinecraftTen-VGORe.ttf"),
      path.join(getDirname(), "Font", "MinecraftTen-VGORe.ttf"),
    ];

    for (const p of pathsToTry) {
      if (fs.existsSync(p)) {
        const buffer = fs.readFileSync(p);
        if (buffer.length > 0) {
          monocraftFontBuffer = buffer;
          console.log(`Loaded genuine Minecraft font from local TTF successfully: ${p}`);
          return monocraftFontBuffer;
        }
      }
    }
  } catch (err) {
    console.error("Failed to read local Minecraft font:", err);
  }

  // 2. Try online download of the genuine MinecraftTen font from the working repository
  try {
    const fontUrl = "https://raw.githubusercontent.com/luckypro387-commits/Mc-fonts/main/MinecraftTen-VGORe.ttf";
    console.log(`Downloading working Minecraft font from repository: ${fontUrl}...`);
    const res = await fetch(fontUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    monocraftFontBuffer = Buffer.from(arrayBuffer);
    console.log("Cached newly downloaded working MinecraftTen font successfully.");
    return monocraftFontBuffer;
  } catch (err: any) {
    console.error("Working MinecraftTen online fetch failed:", err.message);
  }

  // 3. Fallback to Pixelify Sans dynamically from Google Fonts
  try {
    console.log("Loading Pixelify Sans as Minecraft font fallback...");
    monocraftFontBuffer = await loadGoogleFontTtf("Pixelify Sans");
    console.log("Pixelify Sans font loaded and cached successfully.");
    return monocraftFontBuffer;
  } catch (err: any) {
    console.error("Failed to load Pixelify Sans:", err.message);
  }

  // 4. Fallback to Press Start 2P dynamically from Google Fonts
  try {
    console.log("Loading Press Start 2P as ultimate pixel font fallback...");
    monocraftFontBuffer = await loadGoogleFontTtf("Press Start 2P");
    console.log("Press Start 2P loaded and cached successfully.");
    return monocraftFontBuffer;
  } catch (err: any) {
    console.error("All pixel fonts failed! Returning empty buffer.", err.message);
    return Buffer.alloc(0);
  }
}

// Procedural Minecraft Dirt repeating background generator as SVG base64
function getDirtSvgDataUri(): string {
  // 16x16 pixel layout. We map letters to standard Minecraft dirt colors.
  // Darkened earthy tones with crisp contrast and beautiful shading
  const colors: Record<string, string> = {
    A: '#523a28', // light highlight
    B: '#443021', // medium-light
    C: '#37271b', // base brown
    D: '#2b1e15', // dark brown
    E: '#20160f', // very dark brown
    F: '#140e0a', // deepest shadow
  };

  const grid = [
    'A','A','A','B','B','A','A','A','D','D','A','A','A','B','B','A',
    'A','D','A','B','C','A','D','A','A','E','A','D','A','B','C','A',
    'B','B','C','C','A','A','A','A','B','B','C','C','F','A','A','A',
    'B','C','A','A','D','A','D','B','B','C','A','A','D','A','D','B',
    'A','A','D','D','A','A','E','B','A','A','D','D','A','A','A','B',
    'A','D','F','A','A','D','A','B','A','D','A','A','A','D','A','B',
    'B','B','A','A','B','C','C','C','B','B','A','E','B','C','C','C',
    'C','C','C','D','D','C','C','A','C','C','C','D','D','C','C','A',
    'A','A','E','B','B','A','A','A','D','D','A','A','A','B','B','A',
    'A','D','A','B','C','A','D','A','A','A','F','D','A','B','C','A',
    'B','B','C','C','A','A','A','E','B','B','C','C','A','A','A','D',
    'B','C','A','A','D','A','D','B','B','C','A','A','D','A','D','B',
    'A','A','D','D','F','A','A','B','A','A','D','D','A','E','A','B',
    'A','D','A','A','A','D','A','B','A','D','A','A','A','D','A','B',
    'B','B','A','A','B','C','C','E','B','B','A','A','B','C','C','C',
    'C','C','C','D','D','C','C','A','C','F','C','D','D','C','C','A',
  ];

  let rects = '';
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const char = grid[y * 16 + x];
      const color = colors[char] || colors.C;
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`;
    }
  }

  // Draw a subtle 40% black overlay to keep the texture rich and deep
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">${rects}<rect width="16" height="16" fill="black" fill-opacity="0.4" /></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// REST API endpoint: query server status from mcstatus.io
app.get("/api/motd", async (req, res) => {
  const server = String(req.query.server || "play.hypixel.net").trim();
  const platform = String(req.query.platform || "java").toLowerCase() === "bedrock" ? "bedrock" : "java";
  
  // Custom sizing is hardcoded to 960*120, theme is always dirt
  const width = 960;
  const height = 120;
  const theme = "dirt";

  console.log(`Generating card for server: ${server} (${platform}), Theme: ${theme}, Dimensions: ${width}x${height}`);

  let serverData = {
    online: false,
    host: server,
    players: { online: 0, max: 0 },
    version: "Unknown",
    motd: "§cOffline or Can't Connect§r\n§7Check server IP address",
    icon: DEFAULT_ICON_BASE64,
  };

  try {
    const response = await fetch(`https://api.mcstatus.io/v2/status/${platform}/${encodeURIComponent(server)}`);
    if (response.ok) {
      const json = await response.json();
      if (json.online) {
        serverData.online = true;
        serverData.players = {
          online: json.players?.online ?? 0,
          max: json.players?.max ?? 0,
        };
        serverData.version = json.version?.name_clean || json.version?.name_raw || "Minecraft";
        
        // Handle server MOTD lines
        if (json.motd?.raw) {
          serverData.motd = json.motd.raw;
        } else if (json.motd?.clean) {
          serverData.motd = json.motd.clean;
        }

        // Server Icon (if returned by server)
        if (json.icon) {
          serverData.icon = json.icon;
          saveIconToCache(server, json.icon);
        }
      }
    }
  } catch (err) {
    console.error(`Failed to fetch status for ${server} from mcstatus.io:`, err);
  }

  // If we couldn't get a new icon, check the cache for a cached server icon
  if (serverData.icon === DEFAULT_ICON_BASE64) {
    const cachedIcon = iconCache.get(server.toLowerCase().trim());
    if (cachedIcon) {
      serverData.icon = cachedIcon;
    }
  }

  try {
    const fontData = await getFont();

    // Render MOTD to segments for styled tags inside Satori JSX
    const motdLines = serverData.motd.split('\n');
    const parsedLine1 = parseMotd(motdLines[0] || "");
    const parsedLine2 = parseMotd(motdLines[1] || "");

    const dirtBgUri = getDirtSvgDataUri();

    const bgStyle: React.CSSProperties = {
      backgroundImage: `url("${dirtBgUri}")`,
      backgroundRepeat: "repeat",
      backgroundSize: "32px 32px", // exactly 3.75 tiles vertically (120 / 32 = 3.75) for 2x pixel-perfect scaling
      imageRendering: "pixelated",
    };

    // Helper to render segment array to JSX inline-spans, with optional shadow layer
    const renderSegmentsToJsx = (segments: MotdSegment[], isShadow: boolean = false) => {
      if (segments.length === 0 || (segments.length === 1 && segments[0].text === "")) {
        return <span style={{ color: isShadow ? "rgba(0,0,0,0.85)" : "#aaaaaa" }}>&nbsp;</span>;
      }
      return segments.map((seg, idx) => {
        const segStyle: React.CSSProperties = {
          color: isShadow ? "rgba(0,0,0,0.85)" : (seg.color || "#aaaaaa"),
          fontWeight: seg.bold ? "bold" : "normal",
          fontStyle: seg.italic ? "italic" : "normal",
        };
        const decoration = [
          seg.underlined ? "underline" : "",
          seg.strikethrough ? "line-through" : "",
        ].filter(Boolean).join(" ");
        if (decoration) {
          segStyle.textDecoration = decoration as any;
        }
        return (
          <span key={idx} style={segStyle}>
            {seg.text}
          </span>
        );
      });
    };

    // Card Satori element structure matching Minecraft multiplayer server rows 100000% exactly!
    const element = (
      <div
        style={{
          display: "flex",
          width: "960px",
          height: "120px",
          padding: "24px 32px",
          boxSizing: "border-box",
          fontFamily: "Minecraft, monospace",
          position: "relative",
          ...bgStyle,
        }}
      >
        {/* Left Side Server Icon Slot */}
        <div
          style={{
            position: "absolute",
            left: "24px",
            top: "24px",
            width: "72px",
            height: "72px",
            backgroundColor: "#222222",
            border: "4px solid #1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "3px 3px 0px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src={safeBase64DataUri(serverData.icon)}
            alt="Icon"
            style={{
              width: "64px",
              height: "64px",
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* IP Text - Vertically Aligned near top, next to icon */}
        <div
          style={{
            position: "absolute",
            left: "112px",
            top: "22px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Shadow layer */}
          <span
            style={{
              position: "absolute",
              left: "2px",
              top: "2px",
              fontSize: "21px",
              color: "rgba(0,0,0,0.85)",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            IP: {serverData.host.toUpperCase()}
          </span>
          {/* Foreground layer */}
          <span
            style={{
              position: "relative",
              fontSize: "21px",
              color: "#ffffff",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            IP: {serverData.host.toUpperCase()}
          </span>
        </div>

        {/* Players Count - Vertically Aligned near top-right */}
        <div
          style={{
            position: "absolute",
            right: "32px",
            top: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* Shadow layer */}
          <span
            style={{
              position: "absolute",
              left: "2px",
              top: "2px",
              fontSize: "21px",
              color: "rgba(0,0,0,0.85)",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            {serverData.players.online}/{serverData.players.max}
          </span>
          {/* Foreground layer */}
          <span
            style={{
              position: "relative",
              fontSize: "21px",
              color: "#ffffff",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            {serverData.players.online}/{serverData.players.max}
          </span>
        </div>

        {/* Center Container for MOTD text lines */}
        <div
          style={{
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "960px",
            height: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* Centered Line 1 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "19px",
              lineHeight: "1.4",
              marginBottom: "6px",
              position: "relative",
            }}
          >
            {/* Shadow layer */}
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: "2px",
                top: "2px",
              }}
            >
              {renderSegmentsToJsx(parsedLine1, true)}
            </div>
            {/* Foreground layer */}
            <div style={{ display: "flex", position: "relative" }}>
              {renderSegmentsToJsx(parsedLine1, false)}
            </div>
          </div>

          {/* Centered Line 2 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "19px",
              lineHeight: "1.4",
              position: "relative",
            }}
          >
            {/* Shadow layer */}
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: "2px",
                top: "2px",
              }}
            >
              {renderSegmentsToJsx(parsedLine2, true)}
            </div>
            {/* Foreground layer */}
            <div style={{ display: "flex", position: "relative" }}>
              {renderSegmentsToJsx(parsedLine2, false)}
            </div>
          </div>
        </div>

        {/* Bottom Right Attribution: POWERED BY LUCKY */}
        <div
          style={{
            position: "absolute",
            right: "32px",
            bottom: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Shadow layer */}
          <span
            style={{
              position: "absolute",
              left: "2px",
              top: "2px",
              fontSize: "12px",
              color: "rgba(0,0,0,0.85)",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            POWERED BY LUCKY
          </span>
          {/* Foreground layer */}
          <span
            style={{
              position: "relative",
              fontSize: "12px",
              color: "#ffffff",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            POWERED BY LUCKY
          </span>
        </div>
      </div>
    );

    // Compile React Element to clean SVG
    const svg = await satori(element, {
      width,
      height,
      fonts: [
        {
          name: "Minecraft",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    });

    // Render SVG into crisp PNG
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: width,
      },
    });

    const pngBuffer = resvg.render().asPng();

    // Send the image response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=60"); // Cache image for 60 seconds
    res.send(pngBuffer);
  } catch (err: any) {
    console.error("Error generating MOTD card PNG image:", err);
    res.status(500).json({
      error: "Failed to generate image",
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      details: err
    });
  }
});

let pacificoFontBuffer: Buffer | null = null;
let fredokaFontBuffer: Buffer | null = null;

async function getPacificoFont(): Promise<Buffer> {
  if (pacificoFontBuffer) return pacificoFontBuffer;
  try {
    pacificoFontBuffer = await loadGoogleFontTtf("Pacifico");
    console.log("Pacifico font loaded successfully.");
    return pacificoFontBuffer;
  } catch (err) {
    console.error("Pacifico font load failed, using empty buffer:", err);
    return Buffer.alloc(0);
  }
}

async function getFredokaFont(): Promise<Buffer> {
  if (fredokaFontBuffer) return fredokaFontBuffer;
  try {
    // Fredoka One is deprecated, so we load Fredoka which looks identical and is fully supported
    fredokaFontBuffer = await loadGoogleFontTtf("Fredoka");
    console.log("Fredoka font loaded successfully.");
    return fredokaFontBuffer;
  } catch (err) {
    console.error("Fredoka font load failed, using empty buffer:", err);
    return Buffer.alloc(0);
  }
}

// Science/STEM Banner Card PNG generator API
app.get("/api/science-banner", async (req, res) => {
  const text = String(req.query.text || "STEM Lab").trim();
  const subtitle = String(req.query.subtitle || "Exploring the Unknown 🔬").trim();
  const theme = String(req.query.theme || "space_theater").toLowerCase().trim();

  const width = 900;
  const height = 150;

  console.log(`Generating Science Banner: Theme=${theme}, Text="${text}", Subtitle="${subtitle}"`);

  try {
    // Load required fonts
    const [fredokaFont, pacificoFont] = await Promise.all([
      getFredokaFont(),
      getPacificoFont(),
    ]);

    let bg = "#3c4ab5";
    let mainFontFamily = "Pacifico, cursive";
    let subFontFamily = "Fredoka, sans-serif";
    let mainTextColor = "#ffffff";
    let mainTextShadow = "0 2px 8px rgba(0,0,0,0.5)";
    let subTextColor = "#cbd5e1";
    let svgContent: React.JSX.Element | null = null;

    if (theme === "science_lab") {
      bg = "#c9c6f0";
      mainFontFamily = "Fredoka, sans-serif";
      subFontFamily = "Fredoka, sans-serif";
      mainTextColor = "#5b21b6";
      mainTextShadow = "0 1px 3px rgba(255,255,255,0.7)";
      subTextColor = "#6b21a8";

      svgContent = (
        <svg
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Organic Purple Blobs */}
          <path d="M -20,150 Q 80,160 110,90 Q 140,20 60,-10 Q -20,-40 -20,150 Z" fill="#796ec7" opacity="0.25" />
          <path d="M 920,150 Q 820,160 790,90 Q 760,20 840,-10 Q 920,-40 920,150 Z" fill="#796ec7" opacity="0.25" />

          {/* Atom diagram watermarks */}
          <ellipse cx="100" cy="45" rx="30" ry="10" fill="none" stroke="#796ec7" strokeWidth="1" opacity="0.3" transform="rotate(30, 100, 45)" />
          <ellipse cx="100" cy="45" rx="30" ry="10" fill="none" stroke="#796ec7" strokeWidth="1" opacity="0.3" transform="rotate(-30, 100, 45)" />
          <circle cx="100" cy="45" r="4" fill="#796ec7" opacity="0.4" />

          <ellipse cx="800" cy="105" rx="30" ry="10" fill="none" stroke="#796ec7" strokeWidth="1" opacity="0.3" transform="rotate(45, 800, 105)" />
          <ellipse cx="800" cy="105" rx="30" ry="10" fill="none" stroke="#796ec7" strokeWidth="1" opacity="0.3" transform="rotate(-45, 800, 105)" />
          <circle cx="800" cy="105" r="4" fill="#796ec7" opacity="0.4" />

          {/* Left Cluster */}
          {/* Yellow lightbulb with science "idea" beaker inside */}
          <path d="M 45,15 A 14,14 0 0,1 57,41 L 53,48 L 37,48 L 33,41 A 14,14 0 0,1 45,15 Z" fill="#fef08a" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="39" y="48" width="12" height="4" rx="1" fill="#94a3b8" stroke="#7c3aed" strokeWidth="1" />
          <rect x="41" y="52" width="8" height="2" fill="#64748b" />
          <path d="M 43,30 L 43,34 L 41,38 L 49,38 L 47,34 L 47,30 Z" fill="none" stroke="#7c3aed" strokeWidth="1.2" />

          {/* Purple round-bottomed flask filled with red liquid on a stand */}
          <line x1="90" y1="65" x2="90" y2="135" stroke="#475569" strokeWidth="2.5" />
          <line x1="75" y1="135" x2="115" y2="135" stroke="#475569" strokeWidth="3.5" />
          <line x1="90" y1="100" x2="105" y2="100" stroke="#475569" strokeWidth="2" />
          <circle cx="112" cy="110" r="14" fill="#a78bfa" stroke="#5b21b6" strokeWidth="1.5" />
          <rect x="109" y="85" width="6" height="12" fill="#a78bfa" stroke="#5b21b6" strokeWidth="1.5" />
          <line x1="107" y1="85" x2="117" y2="85" stroke="#5b21b6" strokeWidth="1.5" />
          <path d="M 100,116 A 12,12 0 0,0 124,116 Z" fill="#ef4444" />
          {/* Teal bubbles */}
          <circle cx="112" cy="74" r="2.5" fill="#2dd4bf" />
          <circle cx="118" cy="66" r="1.5" fill="#2dd4bf" />

          {/* Mortar & pestle with teal leaf/herb sprig */}
          <path d="M 155,100 C 155,125 195,125 195,100 L 190,122 L 160,122 Z" fill="#c084fc" stroke="#6b21a8" strokeWidth="1.5" />
          <rect x="150" y="85" width="8" height="26" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" transform="rotate(35, 150, 85)" />
          <path d="M 172,92 Q 170,82 178,84 Q 182,90 172,92 Z" fill="#2dd4bf" />

          {/* Left scattered particles */}
          <circle cx="30" cy="100" r="2.5" fill="#796ec7" opacity="0.6" />
          <circle cx="140" cy="35" r="3.5" fill="#796ec7" opacity="0.6" />

          {/* Right Cluster */}
          {/* Small yellow beaker element partially cropped */}
          <rect x="835" y="-10" width="22" height="30" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
          <rect x="837" y="5" width="18" height="13" fill="#3b82f6" />

          {/* Purple & teal microscope */}
          <ellipse cx="750" cy="125" rx="18" ry="4" fill="#2dd4bf" stroke="#0d9488" strokeWidth="1.5" />
          <path d="M 760,125 Q 775,100 760,80" fill="none" stroke="#7c3aed" strokeWidth="3" />
          <line x1="735" y1="102" x2="755" y2="102" stroke="#1e293b" strokeWidth="2" />
          <rect x="734" y="66" width="10" height="32" rx="1.5" fill="#7c3aed" stroke="#5b21b6" strokeWidth="1.5" transform="rotate(-25, 734, 66)" />
          <rect x="726" y="58" width="12" height="5" fill="#2dd4bf" transform="rotate(-25, 726, 58)" />
          <circle cx="764" cy="98" r="3.5" fill="#ef4444" />

          {/* Conical flask (Erlenmeyer) */}
          <path d="M 870,85 L 874,85 L 864,125 L 895,125 L 885,85 Z" fill="#a78bfa" stroke="#5b21b6" strokeWidth="1.5" />
          <path d="M 866,115 L 892,115 L 895,125 L 864,125 Z" fill="#14b8a6" />

          {/* Yellow lightbulb with molecule/leaf inside */}
          <path d="M 820,70 A 13,13 0 0,1 831,94 L 828,101 L 812,101 L 809,94 A 13,13 0 0,1 820,70 Z" fill="#fef08a" stroke="#7c3aed" strokeWidth="1.5" />
          <circle cx="820" cy="82" r="3" fill="#7c3aed" />
          <line x1="816" y1="86" x2="824" y2="86" stroke="#7c3aed" strokeWidth="1" />

          {/* Right scattered particles */}
          <circle cx="730" cy="40" r="3" fill="#796ec7" opacity="0.6" />
          <circle cx="870" cy="50" r="2.5" fill="#796ec7" opacity="0.6" />
        </svg>
      );
    } else if (theme === "purple_swirl") {
      bg = "#4238a3";
      mainFontFamily = "Fredoka, sans-serif";
      subFontFamily = "Fredoka, sans-serif";
      mainTextColor = "#ffffff";
      mainTextShadow = "0 3px 10px rgba(0,0,0,0.6), 2px 2px 0px #1e1b4b";
      subTextColor = "#fde047";

      svgContent = (
        <svg
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Waves / Swooshes */}
          <path d="M -20,60 C 200,120 300,-10 500,40 C 700,90 800,10 920,50 L 920,150 L -20,150 Z" fill="#9482eb" opacity="0.65" />
          <path d="M -20,80 C 180,140 280,20 480,70 C 680,120 780,40 920,80 L 920,150 L -20,150 Z" fill="#bcb1fa" opacity="0.85" />

          {/* Left Side Sparkles & Stars */}
          <path d="M 55,20 L 57,28 L 65,30 L 57,32 L 55,40 L 53,32 L 45,30 L 53,28 Z" fill="#ffffff" />
          <path d="M 35,45 L 36,49 L 40,50 L 36,51 L 35,55 L 34,51 L 30,50 L 34,49 Z" fill="#f59e0b" />
          <path d="M 75,20 L 76,24 L 80,25 L 76,26 L 75,30 L 74,26 L 70,25 L 74,24 Z" fill="#f59e0b" />

          {/* Chevron shape */}
          <path d="M -5,10 L 15,10 L 5,20 L -5,10 Z" fill="#1e293b" opacity="0.8" />

          {/* Zigzag ribbon */}
          <path d="M 10,-10 L 35,20 L 15,45 L 40,75 L 20,105 L 45,135 L 30,160" fill="none" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

          {/* Coiled Spring squiggle */}
          <path d="M 50,135 Q 60,120 70,135 Q 80,120 90,135 Q 100,120 110,135 Q 120,120 130,135 Q 140,120 150,135 Q 160,120 170,135 Q 180,120 190,135 Q 200,120 210,135" fill="none" stroke="#fbcfe8" strokeWidth="3.5" strokeLinecap="round" />

          {/* Top-Center/Right crosshatch grid */}
          <line x1="440" y1="-10" x2="440" y2="25" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="452" y1="-10" x2="452" y2="25" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="464" y1="-10" x2="464" y2="25" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="476" y1="-10" x2="476" y2="25" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="430" y1="5" x2="485" y2="5" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="430" y1="17" x2="485" y2="17" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Far right edge orange shape */}
          <path d="M 890,5 L 905,-10 L 910,15 Z" fill="#fb923c" />

          {/* Scattered white confetti-like streaks */}
          <line x1="785" y1="40" x2="790" y2="30" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="800" y1="55" x2="805" y2="45" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="790" y1="70" x2="795" y2="60" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="815" y1="75" x2="820" y2="65" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="805" y1="95" x2="810" y2="85" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="825" y1="110" x2="830" y2="100" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* Large orange ring */}
          <circle cx="830" cy="150" r="32" fill="#fb923c" stroke="#d97706" strokeWidth="2.5" />
          <circle cx="830" cy="150" r="22" fill="#4238a3" />

          {/* Small top-right pink accent */}
          <path d="M 885,-5 Q 895,15 910,5" fill="none" stroke="#ec4899" strokeWidth="4" />
        </svg>
      );
    } else {
      // DEFAULT / space_theater Theme
      bg = "#3c4ab5";
      mainFontFamily = "Pacifico, cursive";
      subFontFamily = "Fredoka, sans-serif";
      mainTextColor = "#ffffff";
      mainTextShadow = "0 2px 8px rgba(0,0,0,0.5)";
      subTextColor = "#cbd5e1";

      svgContent = (
        <svg
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {/* Waves / Swooshes */}
          <path d="M 0 110 Q 250 140, 450 115 T 900 120 L 900 150 L 0 150 Z" fill="#586be3" opacity="0.3" />
          <path d="M 0 125 Q 300 100, 600 135 T 900 125 L 900 150 L 0 150 Z" fill="#586be3" opacity="0.15" />
          <path d="M 0 50 Q 200 15, 450 65 T 900 45" fill="none" stroke="#586be3" strokeWidth="18" opacity="0.15" />

          {/* Left Cluster */}
          {/* White fabric drape */}
          <path d="M 0,0 Q 40,25 90,0 Q 110,-10 120,-10 L 0,-10 Z" fill="#ffffff" opacity="0.95" />

          {/* Hanging star mobiles */}
          <line x1="60" y1="0" x2="60" y2="75" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <line x1="120" y1="0" x2="120" y2="45" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <line x1="170" y1="0" x2="170" y2="95" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <line x1="210" y1="0" x2="210" y2="55" stroke="#ffffff" strokeWidth="1" opacity="0.6" />

          {/* Saturn-like planet */}
          <circle cx="60" cy="75" r="14" fill="#f59e0b" />
          <ellipse cx="60" cy="75" rx="24" ry="5" fill="none" stroke="#fef08a" strokeWidth="3.5" transform="rotate(-15, 60, 75)" />

          {/* Hanging star 1 */}
          <path d="M 120,38 L 122,43 L 127,43 L 123,46 L 125,51 L 120,48 L 115,51 L 117,46 L 113,43 L 118,43 Z" fill="#fde047" />

          {/* Marbled teal planet */}
          <circle cx="170" cy="95" r="18" fill="#14b8a6" />
          <path d="M 154,95 C 160,105 180,105 186,95" fill="none" stroke="#0d9488" strokeWidth="2.5" />
          <path d="M 156,91 C 165,83 175,83 184,91" fill="none" stroke="#2dd4bf" strokeWidth="2" />

          {/* Hanging star 2 */}
          <path d="M 210,48 L 212,53 L 217,53 L 213,56 L 215,61 L 210,58 L 205,61 L 207,56 L 203,53 L 208,53 Z" fill="#fde047" />

          {/* Scattered left confetti */}
          <circle cx="40" cy="110" r="3" fill="#2dd4bf" />
          <circle cx="100" cy="120" r="2" fill="#1e293b" />
          <circle cx="140" cy="30" r="2.5" fill="#2dd4bf" />
          <circle cx="190" cy="130" r="3" fill="#1e293b" />

          {/* Right Cluster */}
          {/* White fabric drape */}
          <path d="M 900,0 Q 860,25 810,0 Q 790,-10 780,-10 L 900,-10 Z" fill="#ffffff" opacity="0.95" />

          {/* Theater comedy/tragedy masks */}
          {/* Comedy (yellow) */}
          <path d="M 720,40 C 720,30 760,30 760,40 L 755,75 C 755,80 725,80 720,75 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="732" cy="48" r="2.5" fill="#1e293b" />
          <circle cx="748" cy="48" r="2.5" fill="#1e293b" />
          <path d="M 728,58 Q 740,72 752,58 Z" fill="#1e293b" />
          <circle cx="725" cy="54" r="2" fill="#ef4444" opacity="0.4" />
          <circle cx="755" cy="54" r="2" fill="#ef4444" opacity="0.4" />

          {/* Tragedy (teal) */}
          <path d="M 755,55 C 755,45 795,45 795,55 L 790,90 C 790,95 760,95 755,90 Z" fill="#2dd4bf" stroke="#0d9488" strokeWidth="1.5" />
          <path d="M 764,65 Q 768,61 772,65" fill="none" stroke="#1e293b" strokeWidth="2" />
          <path d="M 778,65 Q 782,61 786,65" fill="none" stroke="#1e293b" strokeWidth="2" />
          <path d="M 768,82 Q 775,74 782,82" fill="none" stroke="#1e293b" strokeWidth="2" />
          <path d="M 783,70 Q 785,76 783,78 Q 781,76 783,70 Z" fill="#38bdf8" />

          {/* Musical staff below masks */}
          <path d="M 700,105 Q 780,115 880,95" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.25" />
          <path d="M 700,110 Q 780,120 880,100" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.25" />
          <path d="M 700,115 Q 780,125 880,105" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.25" />

          {/* Music notes */}
          <circle cx="720" cy="104" r="3" fill="#1e293b" />
          <line x1="723" y1="104" x2="723" y2="92" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 723,92 Q 730,94 732,98" fill="none" stroke="#1e293b" strokeWidth="1.5" />

          <circle cx="810" cy="108" r="3" fill="#1e293b" />
          <line x1="813" y1="108" x2="813" y2="96" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 813,96 Q 820,98 822,102" fill="none" stroke="#1e293b" strokeWidth="1.5" />

          {/* Confetti & sparkles */}
          <circle cx="710" cy="35" r="2.5" fill="#ec4899" />
          <circle cx="830" cy="40" r="3" fill="#2dd4bf" />
          <circle cx="850" cy="65" r="2" fill="#1e293b" />
          <circle cx="780" cy="20" r="2" fill="#2dd4bf" />
          <path d="M 810,25 L 812,28 L 815,25 L 812,22 Z" fill="#fde047" />
          <path d="M 720,15 L 722,18 L 725,15 L 722,12 Z" fill="#fde047" />
        </svg>
      );
    }

    const element = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: bg,
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Draw specific SVG illustration layout */}
        {svgContent}

        {/* Dynamic Center Text Overlay */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "380px",
            height: "110px",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: mainFontFamily,
              fontSize: "36px",
              fontWeight: "bold",
              color: mainTextColor,
              textShadow: mainTextShadow,
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            {text}
          </span>
          {subtitle && (
            <span
              style={{
                fontFamily: subFontFamily,
                fontSize: "13px",
                color: subTextColor,
                marginTop: "4px",
                textShadow: theme === "science_lab" ? "none" : "0 1px 3px rgba(0,0,0,0.4)",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );

    // Compile React Element to clean SVG
    const svg = await satori(element, {
      width,
      height,
      fonts: [
        {
          name: "Fredoka",
          data: fredokaFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Pacifico",
          data: pacificoFont,
          weight: 400,
          style: "normal",
        },
      ],
    });

    // Render SVG to beautiful PNG
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: width,
      },
    });

    const pngBuffer = resvg.render().asPng();

    // Send the image response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=60"); // Cache image for 60 seconds
    res.send(pngBuffer);
  } catch (err: any) {
    console.error("Error generating Science Banner PNG image:", err);
    res.status(500).json({
      error: "Failed to generate image",
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
});

async function startServer() {
  // Configure Vite middleware for dev mode, or serve build outputs in prod
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
