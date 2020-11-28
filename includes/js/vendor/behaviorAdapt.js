var DEFAULT_WIDTH = 1920;
var DEFAULT_HEIGHT = 1080;
var DEFAULT_FONT_SIZE = 22;

var MakeResizeAspect = {
    CONTAIN: 'contain',
    COVER: 'cover'
};

window.ContainDimentions = {};
window.CoverDimentions = {};

/**
 * @param {number} _width
 * @param {number} _height
 * @returns {{ WIDTH: number, HEIGHT: number, RATIO:number, widthProportion:Function, heightProportion:Function, keyProperty:Function }}
 */
function ResizeHelper(_width, _height) {
    return {
        WIDTH: _width,
        HEIGHT: _height,
        RATIO: _width / _height,
        widthProportion: function widthProportion(width) {
            return width / this.WIDTH * 100;
        },
        heightProportion: function heightProportion(height) {
            return height / this.HEIGHT * 100;
        },
        keyProperty: function keyProperty(aspect) {
            return document.documentElement.clientWidth / document.documentElement.clientHeight > this.RATIO && aspect != MakeResizeAspect.COVER ? 'height' : 'width';
        }
    };
}

/**
 * @param {Array<string>} content
 * @returns
 */
function code_block(content) {
    return ['{', content, '}'].join(' ');
}

/**
 * @param {{ left: number, top: number, width: number, height: number, fontSize: number }} stylesHolder
 * @returns {string} css style
 */
function createCSS(stylesHolder) {

    var style_width = ['width: ' + stylesHolder.width];
    var style_height = ['height: ' + stylesHolder.height];
    var style_left = ['left: ' + stylesHolder.left];
    var style_top = ['top: ' + stylesHolder.top];
    var style_right = ['right: ' + stylesHolder.left];
    var style_bottom = ['bottom: ' + stylesHolder.top];
    var bsbbx = ["box-sizing: border-box"];
    var style_fontSize = ['font-size: ' + stylesHolder.fontSize + ' !important'];

    var style_size = [].concat(style_width).concat(style_height).concat(bsbbx).concat(style_fontSize);
    var style_position = ['position: absolute'].concat(style_left).concat(style_top);

    var style_horz = ['position: absolute'].concat(style_width).concat(style_left).concat(bsbbx);
    var style_vert = ['position: absolute'].concat(style_height).concat(style_top).concat(bsbbx);

    var style_full = [].concat(style_position).concat(style_size);

    var styleAll = [];

    styleAll.push('.mr-fontsize ' + code_block(style_fontSize.join('; ')));

    styleAll.push('.mr-full ' + code_block(style_full.join('; ')));

    styleAll.push('.mr-horz ' + code_block(style_horz.join('; ')));
    styleAll.push('.mr-vert ' + code_block(style_vert.join('; ')));

    styleAll.push('.mr-size ' + code_block(style_size.join('; ')));
    styleAll.push('.mr-width ' + code_block(style_width.join('; ')));
    styleAll.push('.mr-height ' + code_block(style_height.join('; ')));

    styleAll.push('.mr-position ' + code_block(style_position.join('; ')));
    styleAll.push('.mr-left ' + code_block(style_left.join('; ')));
    styleAll.push('.mr-top ' + code_block(style_top.join('; ')));
    styleAll.push('.mr-right ' + code_block(style_right.join('; ')));
    styleAll.push('.mr-bottom ' + code_block(style_bottom.join('; ')));

    return styleAll.join('\n');
}

function createCSSCover(stylesHolder) {

    var absolute = ['position: absolute'];
    var style_width = ['width: ' + stylesHolder.width];
    var style_height = ['height: ' + stylesHolder.height];
    var style_left = ['left: ' + stylesHolder.left];
    var style_top = ['top: ' + stylesHolder.top];
    var style_right = ['right: ' + stylesHolder.left];
    var style_bottom = ['bottom: ' + stylesHolder.top];
    var bsbbx = ["box-sizing: border-box"];
    var style_fontSize = ['font-size: ' + stylesHolder.fontSize + ' !important'];

    var style_size = [].concat(style_width).concat(style_height).concat(bsbbx).concat(style_fontSize);
    var style_position = absolute.concat(style_left).concat(style_top);

    var style_horz = absolute.concat(style_width).concat(style_left).concat(bsbbx);
    var style_vert = absolute.concat(style_height).concat(style_top).concat(bsbbx);

    var style_full = [].concat(style_position).concat(style_size);
    var styleAll = [];

    styleAll.push('.mr-cover-fontsize ' + code_block(style_fontSize.join('; ')));

    styleAll.push('.mr-cover-full ' + code_block(style_full.join('; ')));

    styleAll.push('.mr-cover-horz ' + code_block(style_horz.join('; ')));
    styleAll.push('.mr-cover-vert ' + code_block(style_vert.join('; ')));

    styleAll.push('.mr-cover-size ' + code_block(style_size.join('; ')));
    styleAll.push('.mr-cover-width ' + code_block(style_width.join('; ')));
    styleAll.push('.mr-cover-height ' + code_block(style_height.join('; ')));

    styleAll.push('.mr-cover-position ' + code_block(style_position.join('; ')));
    styleAll.push('.mr-cover-left ' + code_block(style_left.join('; ')));
    styleAll.push('.mr-cover-top ' + code_block(style_top.join('; ')));
    styleAll.push('.mr-cover-right ' + code_block(style_right.join('; ')));
    styleAll.push('.mr-cover-bottom ' + code_block(style_bottom.join('; ')));

    return styleAll.join('\n');
}

/**
 * @param {string} property
 * @param {number} fontSize
 * @param {number} width
 * @param {number} height
 * @returns {number}
 */
function calculateFont(resizeHelper, _aspect, fontSize, width, height) {
    var newFontSize = 0;
    if (resizeHelper.keyProperty(_aspect) == 'height') {
        newFontSize = height / resizeHelper.HEIGHT * fontSize;
    } else {
        newFontSize = width / resizeHelper.WIDTH * fontSize;
    }
    return newFontSize;
}

/**
 * MakeResize
 * 
 * @param {ResizeHelper} resizeHelper
 * @param {{ fontSize: number }} config
 * @returns {void} void
 */
function MakeResize(resizeHelper, config) {
    var _desiredRatio = resizeHelper.RATIO || 1000 / 600;
    var _config = Object.assign({
        fontSize: 18,
        customClasses: {}
    }, config);
    var _aspect = _config.aspect || MakeResizeAspect.CONTAIN;
    var methods = {};
    var head = document.querySelector('head');
    var style = document.createElement('style');
    head.appendChild(style);

    methods[MakeResizeAspect.CONTAIN] = function(actualWidth, actualHeight) {
        return actualWidth / actualHeight > _desiredRatio ? {
            width: actualHeight * _desiredRatio,
            height: actualHeight
        } : {
            width: actualWidth,
            height: actualWidth / _desiredRatio
        };
    };

    methods[MakeResizeAspect.COVER] = function(actualWidth, actualHeight) {
        return actualWidth / actualHeight > _desiredRatio ? {
            width: actualWidth,
            height: actualWidth / _desiredRatio
        } : {
            width: actualHeight * _desiredRatio,
            height: actualHeight
        };
    };

    function makeStylesHolder(_aspect, resizeHelper, _config) {
        var retorno = methods[_aspect](document.documentElement.clientWidth, document.documentElement.clientHeight);
        var width = retorno.width;
        var height = retorno.height;

        var stylesHolder = {
            custom: [],
            left: (width - document.documentElement.clientWidth).toFixed(2) / -2 + 'px',
            top: (height - document.documentElement.clientHeight).toFixed(2) / -2 + 'px',
            width: width + 'px',
            height: height + 'px',
            fontSize: calculateFont(resizeHelper, _config.aspect, _config.fontSize, width, height) + 'px'
        };
        return stylesHolder;
    }

    function resize() {
        var stylesHolder = makeStylesHolder(MakeResizeAspect.CONTAIN, resizeHelper, _config);
        var stylesHolderCover = makeStylesHolder(MakeResizeAspect.COVER, resizeHelper, _config);

        window.ContainDimentions = stylesHolder;
        window.CoverDimentions = stylesHolderCover;

        stylesHolder.custom = Object.assign({}, _config.customClasses);
        style.innerHTML = createCSS(stylesHolder) + createCSSCover(stylesHolderCover);

        $(window).trigger({
            type: "BehaviorAdapt",
            BehaviorAdapt: {
                ContainDimentions: stylesHolder,
                CoverDimentions: stylesHolderCover
            }
        });

    }

    window.addEventListener('resize', resize);
    setTimeout(resize, 100);
}

function BehaviorAdapt(largura, altura, font_size) {
    let _width = isNaN(largura) ? DEFAULT_WIDTH : largura;
    let _height = isNaN(altura) ? DEFAULT_HEIGHT : altura;
    let _font_size = isNaN(font_size) ? DEFAULT_FONT_SIZE : font_size;
    return MakeResize(ResizeHelper(_width, _height), {
        fontSize: _font_size
    });
}

window.ResizeHelper = ResizeHelper;
window.BehaviorAdapt = BehaviorAdapt;