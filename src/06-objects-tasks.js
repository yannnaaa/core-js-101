/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  Rectangle.prototype.getArea = function f() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return JSON.parse(json, (k, v) => {
    if (k === '') {
      const arr = [];

      Object.keys(v).forEach((property) => {
        if (Object.prototype.hasOwnProperty.call(v, property)) {
          arr.push(v[property]);
        }
      });

      return new proto.constructor(...arr);
    } return v;
  });
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  str: '',

  element(v) {
    const MySuperBaseElementSelector = function f(value) {
      MySuperBaseElementSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += value;
      this.val = cssSelectorBuilder.str;

      this.element = function g() {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      };

      this.id = this.constructor.prototype.id;
      this.class = this.constructor.prototype.class;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    };

    return new MySuperBaseElementSelector(v);
  },

  id(v) {
    const MySuperBaseIdSelector = function f(value) {
      MySuperBaseIdSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += `#${value}`;
      this.val = cssSelectorBuilder.str;

      this.element = function g() {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, '
              + 'attribute, pseudo-class, pseudo-element');
      };

      this.id = function h() {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      };

      this.class = this.constructor.prototype.class;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    };

    return new MySuperBaseIdSelector(v);
  },

  class(v) {
    const MySuperBaseClassSelector = function f(value) {
      MySuperBaseClassSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += `.${value}`;
      this.val = cssSelectorBuilder.str;

      this.element = function g() {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element');
      };

      this.id = this.element;
      this.class = this.constructor.prototype.class;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    };

    return new MySuperBaseClassSelector(v);
  },

  attr(v) {
    const MySuperBaseAttrSelector = function f(value) {
      MySuperBaseAttrSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += `[${value}]`;
      this.val = cssSelectorBuilder.str;

      this.element = function g() {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element');
      };

      this.id = this.element;
      this.class = this.element;
      this.attr = this.constructor.prototype.attr;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    };

    return new MySuperBaseAttrSelector(v);
  },

  pseudoClass(v) {
    const MySuperBasePseudoClassSelector = function f(value) {
      MySuperBasePseudoClassSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += `:${value}`;
      this.val = cssSelectorBuilder.str;

      this.element = function g() {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element');
      };

      this.id = this.element;
      this.class = this.element;
      this.attr = this.element;
      this.pseudoClass = this.constructor.prototype.pseudoClass;
      this.pseudoElement = this.constructor.prototype.pseudoElement;
      this.stringify = this.constructor.prototype.stringify;
    };

    return new MySuperBasePseudoClassSelector(v);
  },

  pseudoElement(v) {
    const MySuperBasePseudoElementSelector = function f(value) {
      MySuperBasePseudoElementSelector.prototype = cssSelectorBuilder;
      cssSelectorBuilder.str += `::${value}`;
      this.val = cssSelectorBuilder.str;

      this.element = function g() {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, '
          + 'attribute, pseudo-class, pseudo-element');
      };

      this.id = this.element;
      this.class = this.element;
      this.attr = this.element;
      this.pseudoClass = this.element;

      this.pseudoElement = function h() {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      };

      this.stringify = this.constructor.prototype.stringify;
    };

    return new MySuperBasePseudoElementSelector(v);
  },

  combine(s1, comb, s2) {
    const MySuperBaseCombineSelector = function f(selector1, combinator, selector2) {
      const selector1Val = selector1.val;
      const selector2Val = selector2.val.slice((selector1.val).length);

      this.val = `${selector1Val} ${combinator} ${selector2Val}`;
      this.stringify = function g() {
        cssSelectorBuilder.str = '';

        return this.val;
      };
    };

    return new MySuperBaseCombineSelector(s1, comb, s2);
  },

  stringify() {
    // let value = cssSelectorBuilder.str;
    // cssSelectorBuilder.str = '';
    this.val = cssSelectorBuilder.str;
    cssSelectorBuilder.str = '';

    return this.val;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
