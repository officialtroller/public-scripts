// ==UserScript==
// @name         [C-I] Custom ECP Detector
// @description  Shows a different ECP when the User has a modded ECP
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "Custom ECP Detector";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }

    src = src.replace(/default:t.fillStyle="hsl\(200,50%,20%\)"/, 'default:t.fillStyle = "hsl(50,100%,50%)"');
    checkSrcChange();
    src = src.replace(/default:t\.fillStyle="hsl\(50,100%,70%\)",t\.fillText\("S",e\/2,i\/2\)/, 'case"star":t.fillStyle="hsl(50,100%,70%)",t.fillText("S",e/2,i/2);break;default:t.fillStyle="hsl(0,50%,30%)",t.fillText("8",e/2,i/2)');
    checkSrcChange();
    src = src.replace(/case\s*"titanium"\s*:(s=t.createLinearGradient\(0,0,0,i\),[\s\S]*?);break;/, '$&case"zinc":s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"#EEE"),s.addColorStop(1,"#666");break;');
    checkSrcChange();
    src = src.replace(/default:s=t\.createLinearGradient\(0,0,0,i\),s\.addColorStop\(0,"#EEE"\),s\.addColorStop\(1,"#666"\)/, 'default:s=t.createLinearGradient(0,0,0,i),s.addColorStop(0,"hsl(0,100%,50%)"),s.addColorStop(.5,"hsl(60,100%,50%)"),s.addColorStop(.5,"hsl(120,100%,50%)"),s.addColorStop(1,"hsl(180,100%,50%)")');
    checkSrcChange();

    log(`Mod injected`);
    return src;
}

if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
    try {
        return injector(sbCode);
    } catch (error) {
        alert(`${modName} failed to load`);
        throw error;
    }
});
log(`Mod loaded`);
