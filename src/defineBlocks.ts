import { Blockly } from "./deps/blockly.ts"

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
        nextStatement: null,
        colour: 135,
    }
])

const jsGenerator = new Blockly.Generator("js")

jsGenerator.forBlock["when_run_button_click"] =
    function (block, generator) {
        console.log("ggg")
        generator.statementToCode(block, "NAME")
        return "hi()"
    }

export { jsGenerator }