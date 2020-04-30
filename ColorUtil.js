// Turn 'rgba(0, 0, 0, 0)' into {r:0, g:0, b:0, a:0}
// and 'hsla(0, 0%, 0%, 0)' into {h:0, s:0, l:0, a:0}
export function parseColor(string) {
  const tmp = string.trim().split('(');
  const keys = tmp[0].split('');
  const values = tmp[1].split(')')[0].split(',').map(value => parseFloat(value));

  const ret = {};
  keys.forEach((key, i) => {
    ret[key] = values[i];
  });

  if (ret.a === undefined) ret.a = 1;

  return ret;
}

export function getComputedColor(el, prop) {
  const computedColorString = window.getComputedStyle(el).getPropertyValue(prop || 'background-color');
  return parseColor(computedColorString);
}

// https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
export function luminance({r, g, b}) {
  const a = [r, g, b].map(function(v) {
    v /= 255;
    return v <= 0.03928 ?
      v / 12.92 :
      Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
export function getContrast(rgb1, rgb2) {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) /
    (darkest + 0.05);
}

// From https://stackoverflow.com/questions/36260689/convert-hsla-to-rgba-by-javascript-or-jquery
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the sets h:[0, 360], s:[0, 100], and l:[0, 100].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
export function rgbToHsl({r, g, b, a}) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);

  s = Math.round(s * 100);

  l = Math.round(l * 100);

  return {
    h,
    s,
    l,
    a
  };
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the sets
 * h:[0, 360], s:[0, 100] and l:[0, 100], and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
export function hslToRgb({h, s, l, a}) {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return {
    r,
    g,
    b,
    a
  };
}
