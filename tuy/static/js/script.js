// Generated by CoffeeScript 2.3.2
(function() {
  var $, canvas, dataURItoBlob, drawText, file, generateFileName, graph, image, input, inputItems, makeStyle, readFile, redraw, textCtx;

  $ = function(sel) {
    return document.querySelector(sel);
  };

  inputItems = ['text', 'color', 'alpha', 'space', 'size'];

  input = {};

  image = $('#image');

  graph = $('#graph');

  file = null;

  canvas = null;

  textCtx = null;

  redraw = null;

  dataURItoBlob = function(dataURI) {
    var arr, binStr, i, k, len, ref;
    binStr = atob((dataURI.split(','))[1]);
    len = binStr.length;
    arr = new Uint8Array(len);
    for (i = k = 0, ref = len - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], {
      type: 'image/png'
    });
  };

  generateFileName = function() {
    var d, pad;
    pad = function(n) {
      if (n < 10) {
        return '0' + n;
      } else {
        return n;
      }
    };
    d = new Date;
    return '' + d.getFullYear() + '-' + (pad(d.getMonth() + 1)) + '-' + (pad(d.getDate())) + ' ' + (pad(d.getHours())) + (pad(d.getMinutes())) + (pad(d.getSeconds())) + '.png';
  };

  readFile = function() {
    var fileReader;
    if (file == null) {
      return;
    }
    fileReader = new FileReader;
    fileReader.onload = function() {
      var img;
      img = new Image;
      img.onload = function() {
        var ctx;
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        textCtx = null;
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        redraw = function() {
          ctx.rotate(315 * Math.PI / 180);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          return ctx.rotate(45 * Math.PI / 180);
        };
        drawText();
        graph.innerHTML = '';
        graph.appendChild(canvas);
        return canvas.addEventListener('click', function() {
          var blob, imageData, link;
          link = document.createElement('a');
          link.download = generateFileName();
          imageData = canvas.toDataURL('image/png');
          blob = dataURItoBlob(imageData);
          link.href = URL.createObjectURL(blob);
          graph.appendChild(link);
          return setTimeout(function() {
            link.click();
            return graph.removeChild(link);
          }, 100);
        });
      };
      return img.src = fileReader.result;
    };
    return fileReader.readAsDataURL(file);
  };

  makeStyle = function() {
    var match;
    match = input.color.value.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    return 'rgba(' + (parseInt(match[1], 16)) + ',' + (parseInt(match[2], 16)) + ',' + (parseInt(match[3], 16)) + ',' + input.alpha.value + ')';
  };

  drawText = function() {
    var i, j, k, l, margin, ref, ref1, ref2, step, textSize, width, x, y;
    if (canvas == null) {
      return;
    }
    textSize = input.size.value * Math.max(15, (Math.min(canvas.width, canvas.height)) / 25);
    if (textCtx != null) {
      redraw();
    } else {
      textCtx = canvas.getContext('2d');
      textCtx.rotate(45 * Math.PI / 180);
    }
    textCtx.fillStyle = makeStyle();
    textCtx.font = 'bold ' + textSize + 'px -apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif';
    width = (textCtx.measureText(input.text.value)).width;
    step = Math.sqrt((Math.pow(canvas.width, 2)) + (Math.pow(canvas.height, 2)));
    margin = (textCtx.measureText('啊')).width;
    x = Math.ceil(step / (width + margin));
    y = Math.ceil((step / (input.space.value * textSize)) / 2);
    for (i = k = 0, ref = x; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
      for (j = l = ref1 = -y, ref2 = y; (ref1 <= ref2 ? l <= ref2 : l >= ref2); j = ref1 <= ref2 ? ++l : --l) {
        textCtx.fillText(input.text.value, (width + margin) * i, input.space.value * textSize * j);
      }
    }
  };

  image.addEventListener('change', function() {
    var ref;
    file = this.files[0];
    if ((ref = file.type) !== 'image/png' && ref !== 'image/jpeg' && ref !== 'image/gif') {
      return alert('仅支持 png, jpg, gif 图片格式');
    }
    return readFile();
  });

  inputItems.forEach(function(item) {
    var el;
    el = $('#' + item);
    input[item] = el;
    return el.addEventListener('input', drawText);
  });

}).call(this);

