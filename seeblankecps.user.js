// ==UserScript==
// @name         [C-I] See Blank ECP's
// @description  Lets you see blank ECP's
// @version      0.1
// @author       official_troller
// @license      MIT
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// ==/UserScript==

const modName = "See Blank ECP's";

const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");

async function injector(sbCode) {
    let src = sbCode;
    let prevSrc = src;

    function checkSrcChange() {
        if (src == prevSrc) throw new Error("src didn't change");
        prevSrc = src;
    }
    const defaultcase = src.match(/default:t\.fillStyle="hsl\(50,100%,70%\)",t\.fillText\("S",e\/2,i\/2\)/);

    src = src.replace(/"blank"\s*!==\s*this\.custom\.badge/, '"v"!==this.custom.badge');
    checkSrcChange();

    src = src.replace(/case"star":.*?break;/g, `$&case"blank":t.fillStyle="hsla(200, 0%, 0%, 0)";break;`);
    checkSrcChange();

    if (defaultcase !== null) src = src.replace(/(default:t\.fillStyle="hsl\(50,100%,70%\)",t\.fillText\("S",e\/2,i\/2\))/, 'case"blank":t.fillStyle="hsla(200, 0%, 0%, 1)";break;$1')
    else src = src.replace(/(default:t\.fillStyle="hsl\(0,50%,30%\)",t\.fillText\("8",e\/2,i\/2\))/, 'case"star":t.fillStyle="hsl(50,100%,70%)",t.fillText("S",e/2,i/2);break;case"blank":t.fillStyle="hsla(200, 0%, 0%, 1)";break;$1')
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
