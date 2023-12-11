import { Blockly } from "./deps/blockly.ts"
import { jsGenerator, toolbox } from "./defineBlocks.ts"

import {
    ContinuousToolbox,
    ContinuousFlyout,
    ContinuousMetrics,
} from "./deps/continuous-toolbox/index.js"

const workspace = Blockly.inject("blocklyDiv", {
    plugins: {
        toolbox: ContinuousToolbox,
        flyoutsVerticalToolbox: ContinuousFlyout,
        metricsManager: ContinuousMetrics,
    },
    renderer: "zelos",
    toolbox,
})

const blocklyArea = document.getElementById("blocklyArea")!
const blocklyDiv = document.getElementById("blocklyDiv")!
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

workspace.addChangeListener(() => {
    const code = jsGenerator.workspaceToCode(workspace)
    document.getElementById("textarea")!.innerText = code
})