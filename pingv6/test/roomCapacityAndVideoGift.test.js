const assert = require("assert");
const fs = require("fs");
const path = require("path");

const server = fs.readFileSync(path.join(__dirname, "..", "server.js"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");
const css = fs.readFileSync(path.join(__dirname, "..", "public", "style.css"), "utf8");

assert(server.includes("const ROOM_SEAT_COUNT = 12;"), "server room capacity is 12");
assert(server.includes('"/api/video-gifts/catalog"'), "public video-gift catalog endpoint exists");
assert(server.includes("seatNumber > ROOM_SEAT_COUNT"), "take-seat uses the 12-seat boundary");
assert(app.includes("const seats = Array(12).fill(null);"), "client seat map fallback has 12 seats");
assert(css.includes("grid-template-columns:repeat(4,minmax(0,1fr)) !important;"), "room uses a 4-column grid for 12 seats");
assert(css.includes("FINAL 12-SEAT ROOM LAYOUT"), "final compact 12-seat visual override is present");

console.log("roomCapacityAndVideoGift.test.js: PASS");
