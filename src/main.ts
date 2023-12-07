import { Blockly } from "./deps/blockly.ts"
import "./defineBlocks.ts"
import { jsGenerator } from "./defineBlocks.ts"

Blockly.inject("blocklyDiv", {
    toolbox: {
        kind: "categoryToolbox",
        contents: [
            {
                kind: "category",
                name: "Core",
                contents: [
                    {
                        kind: "block",
                        type: "when_run_button_click",
                    }
                ]
            }
        ]
    }
})

const blocklyArea = document.getElementById("blocklyArea")!
const blocklyDiv = document.getElementById("blocklyDiv")!
const workspace = Blockly.inject(
    blocklyDiv,
    {
        toolbox: document.getElementById("toolbox")!
    }
)
const onresize = () => {
    let element = blocklyArea!
    let x = 0
    let y = 0
    do {
        x += element.offsetLeft
        y += element.offsetTop
        element = element.offsetParent as HTMLElement
    } while (element)
    blocklyDiv.style.left = x + "px"
    blocklyDiv.style.top = y + "px"
    blocklyDiv.style.width = blocklyArea.offsetWidth + "px"
    blocklyDiv.style.height = blocklyArea.offsetHeight + "px"
    Blockly.svgResize(workspace)
}
addEventListener("resize", onresize, false)

document.querySelector("button")!.addEventListener("click", () => {
    console.log("codegen")
    const code = jsGenerator.workspaceToCode(workspace)
    console.log(code)
    document.getElementById("textarea")!.innerText = code
})