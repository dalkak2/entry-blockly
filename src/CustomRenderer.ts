import { Blockly } from "./deps/blockly.ts"

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    constructor() {
        super()
    }
    override makeNotch() {
        /* https://github.com/google/blockly/blob/develop/core/renderers/zelos/constants.ts */
        // const width = this.NOTCH_WIDTH
        // const height = this.NOTCH_HEIGHT
    
        return {
            type: this.SHAPES.NOTCH,
            width: 10,
            height: 8,
            pathLeft: ` l 8 8 v -6 a 2 2 0 0 1 2 -2 `,
            pathRight: ` a 2 2 0 0 0 -2 2 v 6 l -8 -8 `,
        }
      }
}

class CustomDrawer extends Blockly.zelos.Drawer {
    constructor(
        block: Blockly.BlockSvg,
        info: Blockly.zelos.RenderInfo,
    ) {
        super(block, info)
    }

    override draw() {
        super.draw()
    }
    override drawOutline_() {
        if (
            this.info_.outputConnection &&
            this.info_.outputConnection.isDynamicShape &&
            !this.info_.hasStatementInput &&
            !this.info_.bottomRow.hasNextConnection
        ) {
            this.drawFlatTop_();
            this.drawRightDynamicConnection_();
            this.drawFlatBottom_();
            this.drawLeftDynamicConnection_();
        } else {
            super.drawOutline_();
        }
    }
}

class CustomRenderer extends Blockly.zelos.Renderer {
    constructor() {
        super("custom_renderer")
    }
    makeConstants_() {
        return new CustomConstantProvider()
    }
    makeDrawer_(
        block: Blockly.BlockSvg,
        info: Blockly.zelos.RenderInfo,
    ) {
        return new CustomDrawer(block, info)
    }
}

Blockly.blockRendering.register("custom_renderer", CustomRenderer)