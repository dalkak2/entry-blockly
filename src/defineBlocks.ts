import { Blockly } from "./deps/blockly.ts"

const jsGenerator = new Blockly.Generator("js")

jsGenerator.forBlock["when_run_button_click"] =
    (block, generator) => {
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

import type { CategoryData, Skeleton } from "https://deno.land/x/entry_block_data@0.1.0/type.ts"

const entryBlockData = await fetch("https://deno.land/x/entry_block_data@0.1.0/data.json").then(x => x.json()) as CategoryData[]

console.log(
    entryBlockData
)

export const toolbox = {
    kind: "categoryToolbox",
    contents: [
        /*
        {
            kind: "category",
            name: "Core",
            contents: [
                {
                    kind: "block",
                    type: "when_run_button_click",
                },
                {
                    kind: "block",
                    type: "controls_if",
                },
            ]
        },
        */
        ...entryBlockData.map(({ category, blocks }) => ({
            kind: "category",
            name: category,
            contents: blocks
                .filter(({ template }) => template)
                .map(({ blockName }) => ({
                    kind: "block",
                    type: blockName,
                }))
        }))
    ]
}

const skeleton: Record<Skeleton, any> = {
    basic: {
        previousStatement: null,
        nextStatement: null,
    },
    basic_event: {
        nextStatement: null,
    },
    basic_without_next: {
        previousStatement: null,
    },
    basic_string_field: {
        output: null,
    },
    basic_boolean_field: {
        output: null,
    },
    basic_text: {
        output: null,
    },
    basic_button: {},
    basic_loop: {
        previousStatement: null,
        nextStatement: null,
    },
    basic_double_loop: {
        previousStatement: null,
        nextStatement: null,
    },
}

Blockly.defineBlocksWithJsonArray([
    /*
    {
        type: "when_run_button_click",
        message0: "시작하기 버튼을 클릭했을 때",
        nextStatement: null,
        colour: 135,
    },
    */
    ...entryBlockData
        .map(({ blocks }) => blocks)
        .flat()
        .filter(({ template }) => template)
        .map(block => ({
            type: block.blockName,
            message0: block.template?.replaceAll("%", ""),
            colour: block.color,
            ...skeleton[block.skeleton],
        }))
])