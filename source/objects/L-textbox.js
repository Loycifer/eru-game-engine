/* global L */
L.objects.Textbox = function(text, x, y, width, height, wordwrap)
{


    this.width = (width === undefined) ? 200 : width;
    this.height = height;

    this.words = (text === undefined) ? [] : text.split(" ");
    this.textArray = [];
    Object.defineProperty(this, "text", {
	set: function(text)
	{
	    this.words = text.split(" ");
	    // this.autoSizeX();
	    this.wrapText();
	}.bind(this),
	get: function() {
	    return this.words.join(" ");
	}.bind(this)
    });



    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
    this.alpha = 1;
    this.font = "Times";
    this.fontSize = 30;
    this.lineSpacing = 1;

    this.handle = {};
    this.handle.x = 0;
    this.handle.y = 0;

    this.angle = 0;
    this.scale = 1;

    this.speedX = 0;
    this.speedY = 0;
    this.accelX = 0;
    this.accelY = 0;
    this.rotation = 0;

    this.textFill = "#000000";
    this.textStrokeStyle = "";
    this.textLineWidth = "2";
    this.wrap = true;
    this.alignment = "left";
    this.alignmentY = "top";
    //this.textBaseline = "bottom";



    this.backgroundFill = "#FFFFFF";
    this.borderFill = "";
    this.borderWidth = 0;

    this.marginLeft = 5;
    this.marginTop = 5;
    this.marginRight = 5;
    this.marginBottom = 5;

    this.visible = true;
    this.isClickable = true;
};

L.objects.Textbox.prototype.draw = function(layer)
{
    this.autoDraw(layer);

};

L.objects.Textbox.prototype.autoDraw = function(layer)
{
    if (!this.visible) {
	return;
    }
    layer.globalAlpha = this.alpha;
    var drawBox = (this.backgroundFill !== "" && this.borderWodth > 0);
    layer.textAlign = "left";//this.alignment;
    layer.font = this.fontSize + "px " + this.font;
    if (!this.height)
    {
	this.height = this.fontSize;
    }
    var arrayLength = this.textArray.length;
    if (this.angle !== 0)
    {
	var radians = this.angle;
	layer.save();
	layer.translate(this.x, this.y);
	layer.rotate(-radians);

	if (drawBox) {

	    layer.beginPath();

	    layer.rect(-this.handle.x, -this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom + (this.fontSize * (arrayLength - 1) * this.lineSpacing));
	    if (this.backgroundFill !== "")
	    {
		layer.fillStyle = this.backgroundFill;
		layer.fill();
	    }
	    if (this.borderWidth > 0)
	    {
		layer.strokeStyle = this.borderFill;
		layer.lineWidth = this.borderWidth;
		layer.stroke();
	    }
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";
	for (var i = 0; i < arrayLength; i++)
	{
	    var text = this.textArray[i];
	    var xPos = this.marginLeft - this.handle.x;
	    var yPos = this.marginTop + this.fontSize - this.handle.y + (this.fontSize * i * this.lineSpacing);
	    if (this.scale !== 1)
	    {
		layer.save();
		layer.translate(this.x, this.y);
		layer.scale(this.scale, this.scale);
		layer.translate(-this.x, -this.y);
	    }

	    if (this.textStrokeStyle !== "")
	    {
		layer.lineWidth = this.textLineWidth;
		layer.strokeStyle = this.textStrokeStyle;
		layer.strokeText(text, xPos, yPos);
	    }
	    layer.fillText(text, xPos, yPos);
	    if (this.scale !== 1)
	    {
		layer.restore();
	    }
	}



	//layer.fillText(this.text, 0, 0);
	layer.restore();
    } else {
	if (drawBox)
	{
	    layer.beginPath();
	    layer.rect(this.x - this.handle.x, this.y - this.handle.y, this.width + this.marginLeft + this.marginRight, this.height + this.marginTop + this.marginBottom + (this.fontSize * (arrayLength - 1) * this.lineSpacing));
	    if (this.backgroundFill !== "")
	    {
		layer.fillStyle = this.backgroundFill;
		layer.fill();
	    }
	    if (this.borderWidth > 0)
	    {
		layer.strokeStyle = this.borderFill;
		layer.lineWidth = this.borderWidth;
		layer.stroke();
	    }
	}
	layer.fillStyle = this.textFill;
	layer.textBaseline = "bottom";

	for (var i = 0; i < arrayLength; i++)
	{
	    var text = this.textArray[i];
	    var xPos = this.x + this.marginLeft - this.handle.x;
	    var yPos = this.y + this.marginTop + this.fontSize - this.handle.y + (this.fontSize * i * this.lineSpacing);
	    if (this.scale !== 1)
	    {
		layer.save();
		layer.translate(this.x, this.y);
		layer.scale(this.scale, this.scale);
		layer.translate(-this.x, -this.y);
	    }

	    if (this.textStrokeStyle !== "")
	    {
		layer.lineWidth = this.textLineWidth;
		layer.strokeStyle = this.textStrokeStyle;
		layer.strokeText(text, xPos, yPos);
	    }
	    layer.fillText(text, xPos, yPos);
	    if (this.scale !== 1)
	    {
		layer.restore();
	    }
	}
    }
};


L.objects.Textbox.prototype.update = function(dt)
{
    this.autoUpdate(dt);
};

L.objects.Textbox.prototype.autoUpdate = function(dt)
{

};

L.objects.Textbox.prototype.autoSize = function()
{
    this.autoSizeX();
    this.autoSizeY();
    this.wrapText();
};

L.objects.Textbox.prototype.autoSizeX = function()
{
    this.width = this.getTextWidth();
    this.realign();
};

L.objects.Textbox.prototype.autoSizeY = function()
{
    this.height = this.fontSize;
};

L.objects.Textbox.prototype.wrapText = function()
{
    var arrayLength = this.words.length;
    this.textArray = [];
    var currentLineNumber = 0;
    var currentLineText = "";
    var textBoxWidth = this.width;
    for (var i = 0; i < arrayLength; i++)
    {
	var currentLineWidth = this.getTextWidth(currentLineText);
	if (currentLineWidth === 0)
	{
	    currentLineText = this.words[i];
	}
	else if (this.getTextWidth(currentLineText + " " + this.words[i]) <= textBoxWidth)
	{
	    currentLineText += " " + this.words[i];
	}
	else
	{
	    this.textArray[currentLineNumber] = currentLineText;
	    currentLineNumber++;
	    currentLineText = this.words[i];
	    //  alert(this.words[i]);
	}

    }
    this.textArray[currentLineNumber] = currentLineText;
};

L.objects.Textbox.prototype.getTextWidth = function(text)
{
    var buffer = L.system.bufferContext[0];
    buffer.font = this.fontSize + "px " + this.font;
    if (text === "")
    {
	return 0;
    }
    var metrics = buffer.measureText(text ? text : this.text);
    return metrics.width;
};

L.objects.Textbox.prototype.getTotalWidth = function()
{
    return (this.width + this.marginLeft + this.marginRight);
};

L.objects.Textbox.prototype.getTotalHeight = function()
{
    return (this.height + this.marginTop + this.marginBottom);
};

L.objects.Textbox.prototype.realign = function()
{
    this[this.alignment]();
    this[this.alignmentY]();
};

L.objects.Textbox.prototype.center = function()
{
    this.handle.x = (this.getTotalWidth() / 2);
    this.alignment = "center";
    return this;
};

L.objects.Textbox.prototype.centerY = function()
{
    this.handle.y = (this.getTotalHeight() / 2);
    this.alignmentY = "centerY";
    return this;
};

L.objects.Textbox.prototype.top = function()
{
    this.handle.y = 0;
    this.alignmentY = "top";
    return this;
};

L.objects.Textbox.prototype.bottom = function()
{
    this.handle.y = this.getTotalHeight();
    this.alignmentY = "bottom";
    return this;
};

L.objects.Textbox.prototype.left = function()
{
    this.handle.x = 0;
    this.alignment = "left";
    return this;
};

L.objects.Textbox.prototype.right = function()
{
    this.handle.x = this.getTotalWidth();
    this.alignment = "right";
    return this;
};

L.objects.Textbox.prototype.setMargins = function()
{
    switch (arguments.length)
    {
	case 1:
	    this.marginLeft = this.marginTop = this.marginRight = this.marginBottom = arguments[0];
	    break;
	case 2:
	    this.marginTop = this.marginBottom = arguments[0];
	    this.marginLeft = this.marginRight = arguments[1];
	    break;
	case 3:
	    this.marginTop = arguments[0];
	    this.marginRight = this.marginLeft = arguments[1];
	    this.marginBottom = arguments[2];
	    break;
	case 4:
	    this.marginTop = arguments[0];
	    this.marginRight = arguments[1];
	    this.marginBottom = arguments[2];
	    this.marginLeft = arguments[3];
	    break;
	default:
	    alert("Textbox.setMargins() called with wrong number of arguments.");
	    break;

    }
    this.realign();
    return this;
};

L.objects.Textbox.prototype.handleClick = function(mouseX, mouseY, e)
{
    if (this.isClickable)
    {
	if ((this.angle === 0 &&
	mouseX >= this.x - this.handle.x &&
	mouseX <= this.x + this.width + this.marginLeft + this.marginRight - this.handle.x &&
	mouseY >= this.y - this.handle.y &&
	mouseY <= this.y + this.height + this.marginTop + this.marginBottom - this.handle.y + (this.fontSize * (this.textArray.length - 1) * this.lineSpacing)
	) || (
	this.angle !== 0 &&
	Math.jordanCurve(mouseX, mouseY, this.getVertices())))
	{
	    if (e.type === "mousedown" || e.type === "touchstart")
	    {
		this.onClick(mouseX, mouseY, e);

		return true;
	    }

	}
    }
};

L.objects.Textbox.prototype.getVertices = function()
{
    var Math = window.Math;
    var xTransform = this.x;// + this.offset.x;
    var yTransform = this.y;// + this.offset.y;
    var scale = this.scale;
    var top = 0 - this.handle.y;
    var left = 0 - this.handle.x;
    var right = left + this.width + this.marginLeft + this.marginRight;
    var bottom = top + this.height + this.marginTop + this.marginBottom + (this.fontSize * (this.textArray.length - 1) * this.lineSpacing);
    var vertices = [[left, top], [right, top], [right, bottom], [left, bottom]];

    if (this.scale !== 1)
    {
	vertices.mapQuick(function(entry) {
	    entry[0] *= scale;
	    entry[1] *= scale;
	});

    }
    if (this.angle !== 0)
    {
	var length = vertices.length;

	for (var i = 0; i < length; i++)
	{
	    vertices[i] = [
		vertices[i][0] * Math.cos(-this.angle) - vertices[i][1] * Math.sin(-this.angle),
		vertices[i][0] * Math.sin(-this.angle) + vertices[i][1] * Math.cos(-this.angle)
	    ];
	}
    }


    vertices.mapQuick(function(entry) {
	entry[0] += xTransform;
	entry[1] += yTransform;
    });


    return vertices;

};