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

entryBlockData.forEach(({ blocks }) => {
    blocks.forEach(({
        blockName,
        params,
    }) => {
        jsGenerator.forBlock[blockName] =
            (block, generator) => {
                params.map(param => {
                    //if (param ==)
                })
                return `Entry.${blockName}(
                    ${generator.blockToCode(block.getNextBlock())}
                )`
            }
    })
})

const findBlock = (targetName: string) =>
    entryBlockData.find(({ blocks }) =>
        blocks.find(({ blockName }) => blockName == targetName)
    )?.blocks.find(({ blockName }) => blockName == targetName)

findBlock("repeat_inf")!.params.splice(1)
findBlock("get_sound_volume")!.template = "%1"

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
        output: "String",
    },
    basic_boolean_field: {
        output: "Boolean",
    },
    basic_text: {},
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
        .map(block => {
            if (block.statements?.length) {
                block.params.push({ type: "LineBreak" })
                block.template += `\n%${block.params.length}`
            }
            return {
                type: block.blockName,
                inputsInline: true,
                message0: block.template,
                args0: block.params.map((param, i) => {
                    if (typeof param == "string") throw new Error(param)
                    switch (param.type) {
                        case "Indicator":
                            /*
                            return {
                                type: "field_image",
                            }
                            */
                            return {
                                type: "field_label_serializable",
                                name: "%" + i,
                                text: "",
                            }
                        case "DropdownDynamic":
                        case "Dropdown":
                            return {
                                type: "field_dropdown",
                                name: "%" + i,
                                options: param.options || [["?", "null"]]
                            }
                        case "Keyboard":
                        case "TextInput":
                            return {
                                type: "field_input",
                                name: "%" + i,
                                text: param.type,
                            }
                        case "Block":
                            return {
                                type: "input_value",
                                name: "%" + i,
                                check: param.accept?.replace(/^(.)/, x => x.toUpperCase()),
                            }
                        case "LineBreak":
                            return {
                                type: "input_statement",
                                name: "%" + i,
                            }
                        case "Text":
                            return {
                                type: "field_label_serializable",
                                name: "%" + i,
                                text: param.text,
                            }
                        case "Color":
                            return {
                                type: "field_colour",
                                name: "%" + i,
                                colour: "red",
                            }
                        default:
                    }
                }),
                colour: block.color,
                ...skeleton[block.skeleton],
            }
        })
])