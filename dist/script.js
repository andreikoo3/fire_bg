gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
PIXI.utils.skipHello();

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});
document.body.appendChild(app.view);

const bg_video = new PIXI.Container();
const scene = new PIXI.Container();
app.stage.addChild(bg_video, scene)


let jsonData = [];
let amount = 1200;
let row = 60;
let column = 20;
let element_width = Math.round(app.screen.width / 90);
let element_height = Math.round(app.screen.width / 90);
let videoSprite;
let phase = false;


PIXI.Loader.shared
    .add('https://res.cloudinary.com/djhqtcjps/raw/upload/v1616949556/PIXI_Fire/fire1_sc_biegxd_bgnejk.json')
    .load(jsonLoad);    

    
function jsonLoad() {
    jsonData = PIXI.Loader.shared.resources['https://res.cloudinary.com/djhqtcjps/raw/upload/v1616949556/PIXI_Fire/fire1_sc_biegxd_bgnejk.json'].data;
    firstPainting();
    window.setTimeout(() => {
        videoPlay();
        painting();
        window.setInterval(() => { painting() }, 200);
    }, 200)
}


const videoTexture = PIXI.Texture.from('https://res.cloudinary.com/djhqtcjps/video/upload/v1616949571/PIXI_Fire/fa_vowlit_yg77he.mp4');
videoTexture.baseTexture.resource.source.muted = true;  
let video = {};

function videoPlay() {
    video = videoTexture.baseTexture.resource.source;
    video.loop = true;
    videoSprite = PIXI.Sprite.from(videoTexture)
    videoSprite.width = app.screen.width
    videoSprite.height = app.screen.height;
    bg_video.addChild(videoSprite);
    bg_video.mask = scene;
}


function setupElements() {
    let spaceX = (app.screen.width - app.screen.width / row) / row;
    let spaceY = (app.screen.height - app.screen.height / column) / column;

    let temp = 0;
    let x = 0;
    let y = spaceY;

    for (let i = 1; i < amount + 1; i++) {
        if (temp === row) {
            temp = 0;
            x = 0;
            y += spaceY;
        }
        x += spaceX;
        temp++;
 
        if (scene.children.length === amount) {
            scene.children[i - 1].x = Math.round(x);
            scene.children[i - 1].y = Math.round(y);
        } else {
            let rect = new PIXI.Graphics();
            rect.beginFill(0xFFFFFF);
            rect.tint = 0x000000;
            rect.drawRoundedRect(0, 0, element_width, element_width, 5);
            rect.endFill();
            rect.pivot.set(element_width / 2, element_height / 2)
            rect.x = Math.round(x);
            rect.y = Math.round(y);
            scene.addChild(rect);
        }
        if (app.screen.height < 350) scene.children[i - 1].height = element_height / 1.8;
        else if (app.screen.height > 350 && app.screen.height < 550) scene.children[i - 1].height = element_height;
        else scene.children[i - 1].height = element_height * 1.5;

        if (app.screen.width < 1000) scene.children[i - 1].width = element_width / 1.7;
        else scene.children[i - 1].width = element_width;
    }
    phase = false;
}
setupElements()


function firstPainting() {
    for (var i = 0; i < scene.children.length; i++) {
        let element = scene.children[i];
        let color = jsonData[0][i];

        if (color === "b") element.tint = 0x000000;
        else element.tint = "0x" + color;
    }
}


function painting() {
    let random;

    if (video.currentTime > 18) {

        if (!phase) {
            gsap.fromTo(scene.children,
                { pixi: { width: element_width, height: element_height, rotation: -180 } },
                { pixi: { width: element_width - 5, height: element_height + 8, rotation: 0 }, 
                    duration: 2,
                    ease: "power3.out",
                    stagger: { from: "center", amount: 1 },
                });

        } else {
            gsap.fromTo(scene.children,
                { pixi: { width: element_width - 5, height: element_height + 8, rotation: -180 } },
                { pixi: { width: element_width, height: element_height, rotation: 0 },
                    duration: 2,
                    ease: "power3.in",
                    stagger: { from: "center", amount: 1 },
                });
        }
        video.currentTime = 0;
        phase ? phase = false : phase = true;
    }

    if (!phase && app.screen.height > 350) {                                           
        for (var i = 0; i < scene.children.length; i++) {
            if (i % 20 == 0) {
                random = gsap.utils.random(0, 1100, 1);
                gsap.fromTo(scene.children[random],
                    { pixi: { scale: 1.2 } },
                    { pixi: { scale: 0.9 }, duration: 0.4, ease: "power3.in" });
            }
        }
    }
}


window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    setupElements();
    if (videoSprite) {
        videoSprite.width = app.screen.width
        videoSprite.height = app.screen.height;
    }
});