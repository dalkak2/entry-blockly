import { Blockly } from "./deps/blockly.ts"

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    ARC_SIZE: number
    constructor() {
        super()
        this.ARC_SIZE = 8
        this.NOTCH_HEIGHT = 20
        this.NOTCH_WIDTH = this.NOTCH_HEIGHT + this.ARC_SIZE
        this.NOTCH_OFFSET_LEFT = 0
        
        this.CORNER_RADIUS = 0
            this.TOP_ROW_MIN_HEIGHT = this.CORNER_RADIUS
            this.BOTTOM_ROW_MIN_HEIGHT = this.CORNER_RADIUS
            this.FIELD_BORDER_RECT_RADIUS = this.CORNER_RADIUS
    }
    override makeNotch() {
        /* https://github.com/google/blockly/blob/develop/core/renderers/zelos/constants.ts */
        const arc = this.ARC_SIZE
        const height = this.NOTCH_HEIGHT
        const width = height + arc // this.NOTCH_WIDTH
    
        return {
            type: this.SHAPES.NOTCH,
            width,
            height, /* 블록 상단 여백 */
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

class TopRow extends Blockly.zelos.TopRow {
    measure(): void {
        let height = 0;
        let width = 0;
        let ascenderHeight = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];
            width += elem.width;
            /* <edited> */ /*
            if (!Types.isSpacer(elem)) {
                if (Types.isHat(elem) && elem instanceof Hat) {
                ascenderHeight = Math.max(ascenderHeight, elem.ascenderHeight);
                } else {
                height = Math.max(height, elem.height);
                }
            }
            */ /* </edited> */
        }
        this.width = Math.max(this.minWidth, width);
        this.height = Math.max(this.minHeight, height) + ascenderHeight;
        this.ascenderHeight = ascenderHeight;
        this.capline = this.ascenderHeight;
        this.widthWithConnectedBlocks = this.width;
    }
}

class CustomRenderInfo extends Blockly.zelos.RenderInfo {
    constructor(
        renderer: Blockly.zelos.Renderer,
        block: Blockly.BlockSvg,
    ) {
        super(renderer, block)
        this.topRow = new TopRow(this.constants_)
    }
    override getSpacerRowHeight_(
        _prev: Blockly.blockRendering.Row,
        _next: Blockly.blockRendering.Row
    ): number {
        /* 블록 하단 여백 */
        return 4
    }
    protected adjustXPosition_(): void {
        /* 블록 왼쪽 여백 (노치 공간) */
        const Types = Blockly.blockRendering.Types
        
        const notchTotalWidth =
        this.constants_.NOTCH_OFFSET_LEFT + this.constants_.NOTCH_WIDTH;
        let minXPos = notchTotalWidth;
        // Run through every input row on the block and only apply bump logic to the
        // first input row (if the block has prev connection) and every input row
        // that has a prev and next notch.
        for (let i = 2; i < this.rows.length - 1; i += 2) {
            const prevSpacer = this.rows[i - 1] as Blockly.blockRendering.SpacerRow;
            const row = this.rows[i];
            const nextSpacer = this.rows[i + 1] as Blockly.blockRendering.SpacerRow;

            const hasPrevNotch =
                i === 2
                ? !!this.topRow.hasPreviousConnection
                : !!prevSpacer.followsStatement;
            const hasNextNotch =
                i + 2 >= this.rows.length - 1
                ? !!this.bottomRow.hasNextConnection
                : !!nextSpacer.precedesStatement;

            if (Types.isInputRow(row) && row.hasStatement) {
                row.measure();
                minXPos =
                row.width - (row.getLastInput()?.width ?? 0) + notchTotalWidth;
            } else if (
                hasPrevNotch &&
                (i === 2 || hasNextNotch) &&
                Types.isInputRow(row) &&
                !row.hasStatement
            ) {
                let xCursor = row.xPos;
                let prevInRowSpacer = null;
                for (let j = 0; j < row.elements.length; j++) {
                const elem = row.elements[j];
                if (Types.isSpacer(elem)) {
                    prevInRowSpacer = elem;
                }
                if (prevInRowSpacer && (Types.isField(elem) || Types.isInput(elem))) {
                    if (
                        xCursor < minXPos /* <edited> */ /* &&
                        !(
                            Types.isField(elem) &&
                            elem instanceof Blockly.blockRendering.Field &&
                            (elem.field instanceof Blockly.FieldLabel ||
                            elem.field instanceof Blockly.FieldImage)
                        ) */
                        /* </edited> */
                    ) {
                        const difference = minXPos - xCursor;
                        prevInRowSpacer.width += difference;
                        /* <edited> */
                        if (
                            Types.isField(elem) &&
                            elem instanceof Blockly.blockRendering.Field &&
                            (elem.field instanceof Blockly.FieldLabel ||
                            elem.field instanceof Blockly.FieldImage)
                        ) {
                            prevInRowSpacer.width += this.constants_.SMALL_PADDING
                        }
                        /* </edited> */
                    }
                }
                xCursor += elem.width;
                }
            }
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
    makeRenderInfo_(block: Blockly.BlockSvg): CustomRenderInfo {
        return new CustomRenderInfo(this, block)
    }
}

Blockly.blockRendering.register("custom_renderer", CustomRenderer)