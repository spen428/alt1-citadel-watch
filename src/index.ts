// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from "@alt1/base";

// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import "./index.html";
import "./appconfig.json";
import "./icon.png";
import ChatBoxReader from "@alt1/chatbox";


var output = document.getElementById("output");
const ocr = new ChatBoxReader();

// listen for pasted (ctrl-v) images, usually used in the browser version of an app
a1lib.PasteInput.listen(img => {
    findHomeport(img);
}, (err, errid) => {
    output.insertAdjacentHTML("beforeend", `<div><b>${errid}</b>  ${err}</div>`);
});

a1lib.

// You can reach exports on window.TestApp because of
// library:{type:"umd",name:"TestApp"} in webpack.config.ts
export function capture() {
    a1lib.PasteInput.fileDialog().showPicker();

    // if (!window.alt1) {
    //     output.insertAdjacentHTML("beforeend", `<div>You need to run this page in alt1 to capture the screen</div>`);
    //     return;
    // }
    // if (!alt1.permissionPixel) {
    //     output.insertAdjacentHTML("beforeend", `<div>Page is not installed as app or capture permission is not enabled</div>`);
    //     return;
    // }
    // var img = a1lib.captureHoldFullRs();
    // findHomeport(img)
}

function findHomeport(img: a1lib.ImgRef) {
    let pos = ocr.find(img);
    if (pos) {
        let state = ocr.read(img);
        // console.log(state);
        if (state) {
            const index = state.findIndex(line => line.text.includes('[Clan System]'));
            if (index !== -1) {
                output.insertAdjacentHTML("beforeend", `<div>${state[index].text}</div>`);
                output.insertAdjacentHTML("beforeend", `<div>${JSON.stringify(state.map(s => s.text))}</div>`);
            }
        } else {
            output.insertAdjacentHTML("beforeend", `<div>no state</div>`);
        }
    } else {
        output.insertAdjacentHTML("beforeend", `<div>no pos</div>`);
    }
}

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
    //tell alt1 about the app
    //this makes alt1 show the add app button when running inside the embedded browser
    //also updates app settings if they are changed
    alt1.identifyAppUrl("./appconfig.json");
} else {
    let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
    output.insertAdjacentHTML("beforeend", `
		Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1
	`);
}

//also the worst possible example of how to use global exposed exports as described in webpack.config.js
output.insertAdjacentHTML("beforeend", `
	<div>paste an image of rs with homeport button (or not)</div>
	<div onclick='TestApp.capture()'>Click to capture if on alt1</div>`
);
