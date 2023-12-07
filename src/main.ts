import Blockly from "https://esm.sh/v135/blockly@10.2.2"

Blockly.defineBlocksWithJsonArray([
    {
        type: "when_run_button_click",
        message0: "시작하기 버튼을 클릭했을 때",
        nextStatement: null,
        colour: 135,
    }
])

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