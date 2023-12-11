import { Blockly } from "./deps/blockly.ts"

const jsGenerator = new Blockly.Generator("js")

Blockly.defineBlocksWithJsonArray([
    {
        type: "when_run_button_click",
        message0: "시작하기 버튼을 클릭했을 때",
        nextStatement: null,
        colour: 135,
    }
])

jsGenerator.forBlock["when_run_button_click"] =
    (block, generator) => {
        console.log(block.getChildren(false))
        block.nextConnection
        return `hi(${
            block.getNextBlock()
                ? generator.blockToCode(block.getNextBlock()!)
                : ""
        })`
    }
jsGenerator.forBlock["controls_if"] =
    (block, generator) => {
        return `if` + (block.getNextBlock()
                ? generator.blockToCode(block.getNextBlock()!)
                : "")
    }

export { jsGenerator }