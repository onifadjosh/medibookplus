const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const html = fs.readFileSync("onboarding_feature_walkthrough.html", "utf-8");
const script = fs.readFileSync("scripts.js", "utf-8");

const dom = new JSDOM(html, { runScripts: "dangerously" });
try {
  dom.window.eval(script);
  console.log("Script executed without top-level errors.");
  dom.window.eval("nextSlide()");
  console.log("nextSlide() executed without errors.");
} catch (e) {
  console.error(e);
}
