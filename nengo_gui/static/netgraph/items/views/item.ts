import { dom, h  } from "maquette";

import { Shape } from "../../../utils";
import { NetGraph } from "../../netgraph";
import { NetGraphItemArg } from "../item";

export class NetGraphItemView {
    gItems: SVGElement;
    ng: NetGraph;

    // TODO: protect these later
    g: SVGElement;
    shape: SVGElement;

    minHeight: number;
    minWidth: number;

    _h: number;
    _w: number;
    _x: number;
    _y: number;

    constructor(ngiArg: NetGraphItemArg) {
        // mostly just takes care of the g when things change
        this.ng = ngiArg.ng;

        this._x = ngiArg.posX;
        this._y = ngiArg.posY;
        this._w = ngiArg.width;
        this._h = ngiArg.height;
        this.gItems = this.ng.gItems;

        // Minimum and maximum drawn size, in pixels
        this.minWidth = 5;
        this.minHeight = 5;

        // temporary visible shape for debugging
        const visShape = h("circle#cool.sweet", {cx: "50", cy: "50", r: "50", fill: "red"});
        // Create the SVG group to hold this item's shape and it's label
        this.g = dom.create(
            visShape,
            {namespace: "http://www.w3.org/2000/svg"}
        ).domNode as SVGElement;
        this.gItems.appendChild(this.g);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get height(): number {
        return this._h;
    }

    /**
     * Return the height of the item, taking into account parent heights.
     */
    // get nestedHeight() {
    //     let h = this.height;
    //     let parent = this.parent;
    //     while (parent !== null) {
    //         h *= parent.height * 2;
    //         parent = parent.parent;
    //     }
    //     return h;
    // }

    get width(): number {
        return this._w;
    }

    /**
     * Return the width of the item, taking into account parent widths.
     */
    // get nestedWidth() {
    //     let w = this.width;
    //     let parent = this.parent;
    //     while (parent !== null) {
    //         w *= parent.width * 2;
    //         parent = parent.parent;
    //     }
    //     return w;
    // }

    get displayedSize() {
        return [this.width, this.height];
    }

    get displayedShape(): Shape {
        const screenW = this.screenWidth;
        const screenH = this.screenHeight;
        return {height: screenH, width: screenW};
    }

    // TODO: rename
    // abstract _getPos(): {
    //     w: number, h: number, offsetX: number, offsetY: number
    // };

    /**
     * Determine the pixel location of the centre of the item.
     */
    get screenLocation() {
        // FIXME: this should probably use this.ng.getScaledWidth
        // and this.ng.getScaledHeight

        const pos = this._getPos();

        let dx = 0;
        let dy = 0;
        // let parent = this.parent;
        // while (parent !== null) {
        //     dx *= parent.width * 2;
        //     dy *= parent.height * 2;

        //     dx += (parent.x - parent.width);
        //     dy += (parent.y - parent.height);
        //     parent = parent.parent;
        // }
        dx *= pos.w;
        dy *= pos.h;

        let ww = pos.w;
        let hh = pos.h;
        // if (this.parent !== null) {
        //     ww *= this.parent.nestedWidth * 2;
        //     hh *= this.parent.nestedHeight * 2;
        // }

        return [this.x * ww + dx + pos.offsetX,
                this.y * hh + dy + pos.offsetY];
    }

    /* 
        Different implementation for normal and mini objects 
    */
    // abstract _getScreenW(): number;

    // temporary accessors because we're not concerning ourselves
    // with the minimap yet
    _getScreenW() {
        return this.ng.width * this.ng.scale;
    }

    _getScreenH() {
        return this.ng.height * this.ng.scale;
    }

    _getPos() {
        const w = this.ng.scaledWidth;
        const h = this.ng.scaledHeight;

        const offsetX = this.ng.offsetX * w;
        const offsetY = this.ng.offsetY * h;

        return {w, h, offsetX, offsetY};
    }

    get screenWidth() {
        let screenW = this._getScreenW();

        if (screenW < this.minWidth) {
            screenW = this.minWidth;
        }

        return screenW * 2;
    }

    // abstract _getScreenH(): number;

    get screenHeight() {
        let screenH = this._getScreenH();

        if (screenH < this.minHeight) {
            screenH = this.minHeight;
        }

        return screenH * 2;
    }

    get minMaxXY() {
        const minX = this.x - this.width;
        const maxX = this.x + this.width;
        const minY = this.y - this.height;
        const maxY = this.y + this.height;
        return [minX, maxX, minY, maxY];
    }

    // abstract _renderShape();

    redrawPosition() {
        const screen = this.screenLocation;

        this.g.setAttribute(
            "transform",
            "translate(" + screen[0] + ", " + screen[1] + ")"
        );
    }

    remove() {
        this.gItems.removeChild(this.g);
    }

    /**
    * Helper function for setting attributes.
    */
    setAttributes(el, attrs) {
        Object.keys(attrs).forEach(key => {
            el.setAttribute(key, attrs[key]);
        });
    }
}