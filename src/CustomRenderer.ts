import { Blockly } from "./deps/blockly.ts"

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    constructor() {
        super()
    }
    override makeNotch() {
        /* https://github.com/google/blockly/blob/develop/core/renderers/zelos/constants.ts */
        const arc = 2
        const height = 8 // this.NOTCH_HEIGHT
        const width = height + arc // this.NOTCH_WIDTH
    
        return {
            type: this.SHAPES.NOTCH,
            width,
            height,
            pathLeft: `
                l ${height} ${height}
                v -${height - arc}
                a ${arc} ${arc}
                  0 0 1
                  ${arc} -${arc}
            `,
            pathRight: `
                a ${arc} ${arc}
                  0 0 0
                  -${arc} ${arc}
                v ${height - arc}
                l -${height} -${height}
            `,
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