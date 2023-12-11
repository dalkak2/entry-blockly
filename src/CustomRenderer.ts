import { Blockly } from "./deps/blockly.ts"

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    constructor() {
        super()
        //this.NOTCH_HEIGHT = 20
    }
}

class CustomRenderer extends Blockly.zelos.Renderer {
    constructor() {
        super("custom_renderer")
    }
    makeConstants_() {
        return new CustomConstantProvider()
    }
}

Blockly.blockRendering.register("custom_renderer", CustomRenderer)