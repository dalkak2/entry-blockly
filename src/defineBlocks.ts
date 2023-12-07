import { Blockly, javascriptGenerator } from "./deps/blockly.ts"

Blockly.defineBlocksWithJsonArray([
    {
        type: "when_run_button_click",
        message0: "시작하기 버튼을 클릭했을 때",
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

javascriptGenerator.forBlock["when_run_button_click"] =
    (block, generator) => {
        generator.statementToCode(block, "NAME")
    }