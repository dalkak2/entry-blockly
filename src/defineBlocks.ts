import { Blockly } from "./deps/blockly.ts"

const jsGenerator = new Blockly.Generator("js")

Blockly.defineBlocksWithJsonArray([
    {
        type: "when_run_button_click",
        message0: "시작하기 버튼을 클릭했을 때 %1 %2",
        args0: [
            { type: "input_dummy" },
            {
                type: "input_statement",
                name: "NAME",
            }
        ],
        colour: 135,
    }
])

jsGenerator.forBlock["when_run_button_click"] =
    (block, generator) => {
        return `hi(${
            generator.statementToCode(block, "NAME")
        })`
    }


export { jsGenerator }