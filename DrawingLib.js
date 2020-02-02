//****************************************
//DRAWING LIBRARY
//****************************************
//Copyright: Major, Balazs
//E-mail: majorstructures@gmail.com
//****************************************
//Change history
//2019-01-20 Copy and from methods added to PrimitivePolygon
//2019-01-03 PrimitiveText added
//2019-01-02 Plenty of primitive drawables added
//2019-01-01 Started

//****************************************
//Todo
// - Fix rotate of PrimitiveText (angle has to be rotated too)
//****************************************
//Dependencies
// - TwoDGeometry.js
//****************************************


//=======================
//DRAWINGLIB OBJECT	
//=======================
var DrawingLib={};

DrawingLib.svgNS="http://www.w3.org/2000/svg";

DrawingLib.ZeroTransform=function(x, y, s)
{
	this.originX=x;
	this.originY=y
	this.scale=s;
	return this;
};
/*
//Style objects

//=======================
//LINESTYLE OBJECT	
//=======================
DrawingLib.LineStyle=function()
{
	this.color="#000000";
	this.width=1;
	this.pattern="solid";
	return this;
};

//=======================
//FILLSTYLE OBJECT	
//=======================
DrawingLib.FillStyle=function()
{
	this.color="#000000";
	return this;
};
*/

//Drawable primitives

//=======================
//GENERICPRIMITIVE OBJECT	
//=======================
DrawingLib.GenericPrimitive=function(st)
//st: style as Object
{
	this.parent=null;
	//this.lineStyle=ls==undefined?null:ls;
	//this.fillStyle=fs==undefined?null:fs;
	this.style=st;
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.GenericPrimitive.prototype.getSVGStyleString=function()
{
	var str="";
	var key;
	for(key in this.style)
	{
		str+=key.replace("_", "-")+": "+this.style[key]+"; ";
	}
	return str;
};

//-----------------------------------------------------------------------
DrawingLib.GenericPrimitive.prototype.from=function(template)
{
	//console.log("DrawingLib.GenericPrimitive.from() starts");
	this.parent=template.parent;
	this.style=template.style;
	//console.log("DrawingLib.GenericPrimitive.from() ends");
};

//-----------------------------------------------------------------------
/*DrawingLib.GenericPrimitive.prototype.getSVGStyleString2=function()
{
	var str="";
	if(this.lineStyle!=null)
	{
		str+="stroke: "+this.lineStyle.color+"; ";
		str+="stroke-width: "+this.lineStyle.width+"; ";
	}
	else
	{
		str+="stroke: none;";
	}
	if(this.fillStyle!=null)
	{
		str+="fill: "+this.fillStyle.color+"; ";
	}
	else
	{
		str+="fill: none;";
	}
	return str;
};*/

//=======================
//PRIMITIVEPOINT OBJECT	
//=======================

DrawingLib.PrimitivePoint=function(p, st)
//p: point as TwoDGeometry.Vector
//ls: line style as TwoDGeomety.LineStyle
{
	DrawingLib.GenericPrimitive.call(this, st);
	TwoDGeometry.Vector.call(this, p.x, p.y);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitivePoint.prototype = Object.create(TwoDGeometry.Vector.prototype);

Object.assign(DrawingLib.PrimitivePoint.prototype, DrawingLib.GenericPrimitive.prototype);

DrawingLib.PrimitivePoint.prototype.constructor = DrawingLib.PrimitivePoint;

//-----------------------------------------------------------------------
DrawingLib.PrimitivePoint.prototype.from=function(template)
{
	DrawingLib.GenericPrimitive.prototype.from.call(this, template);
	TwoDGeometry.Vector.prototype.from.call(this, template);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitivePoint.prototype.copy=function()
{
	return new DrawingLib.PrimitivePoint(this.x, this.y, this.style);
};

//-----------------------------------------------------------------------
DrawingLib.PrimitivePoint.prototype.getDOMObject=function(tr)
{
	
	var g=document.createElementNS(DrawingLib.svgNS, "g");
	var o=document.createElementNS(DrawingLib.svgNS, "line");
	o.setAttribute("x1", (tr.originX+tr.scale*this.x-3).toFixed(1));
	o.setAttribute("y1", (tr.originY-tr.scale*this.y+3).toFixed(1));
	o.setAttribute("x2", (tr.originX+tr.scale*this.x+3).toFixed(1));
	o.setAttribute("y2", (tr.originY-tr.scale*this.y-3).toFixed(1));
	o.setAttribute("style", this.getSVGStyleString());
	g.appendChild(o);
	var o=document.createElementNS(DrawingLib.svgNS, "line");
	o.setAttribute("x1", (tr.originX+tr.scale*this.x-3).toFixed(1));
	o.setAttribute("y1", (tr.originY-tr.scale*this.y-3).toFixed(1));
	o.setAttribute("x2", (tr.originX+tr.scale*this.x+3).toFixed(1));
	o.setAttribute("y2", (tr.originY-tr.scale*this.y+3).toFixed(1));
	o.setAttribute("style", this.getSVGStyleString());
	g.appendChild(o);
	return g;
};

//=======================
//PRIMITIVELINE OBJECT	
//=======================
DrawingLib.PrimitiveLine=function(p0, p1, st)
//p0: start point as TwoDGeometry.Vector
//p1: end point as TwoDGeometry.Vector
//ls: line style as TwoDGeomety.LineStyle
{
	DrawingLib.GenericPrimitive.call(this, st);
	TwoDGeometry.Section.call(this, p0, p1);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveLine.prototype = Object.create(TwoDGeometry.Section.prototype);

Object.assign(DrawingLib.PrimitiveLine.prototype, DrawingLib.GenericPrimitive.prototype);

DrawingLib.PrimitiveLine.prototype.constructor = DrawingLib.PrimitiveLine;

//-----------------------------------------------------------------------
DrawingLib.PrimitiveLine.prototype.from=function(template)
{
	DrawingLib.GenericPrimitive.prototype.from.call(this, template);
	TwoDGeometry.Section.prototype.from.call(this, template);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveLine.prototype.copy=function()
{
	return new DrawingLib.PrimitiveLine(this.p0, this.p1, this.style);
};


//-----------------------------------------------------------------------
DrawingLib.PrimitiveLine.prototype.getDOMObject=function(tr)
{
	var o=document.createElementNS(DrawingLib.svgNS, "line");
	o.setAttribute("x1", (tr.originX+tr.scale*this.p0.x).toFixed(1));
	o.setAttribute("y1", (tr.originY-tr.scale*this.p0.y).toFixed(1));
	o.setAttribute("x2", (tr.originX+tr.scale*this.p1.x).toFixed(1));
	o.setAttribute("y2", (tr.originY-tr.scale*this.p1.y).toFixed(1));
	o.setAttribute("style", this.getSVGStyleString());
	return o;
};

//=======================
//PRIMITIVECIRCLE OBJECT	
//=======================

DrawingLib.PrimitiveCircle=function(c, r, st)
//c: center as TwoDGeometry.Vector
//r: radius as float
//ls: line style as TwoDGeomety.LineStyle
//fs: fill style as TwoDGeometry.FillStyle
{
	DrawingLib.GenericPrimitive.call(this, st);
	TwoDGeometry.Circle.call(this, c, r);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveCircle.prototype = Object.create(TwoDGeometry.Circle.prototype);

Object.assign(DrawingLib.PrimitiveCircle.prototype, DrawingLib.GenericPrimitive.prototype);

DrawingLib.PrimitiveCircle.prototype.constructor = DrawingLib.PrimitiveCircle;

//-----------------------------------------------------------------------
DrawingLib.PrimitiveCircle.prototype.from=function(template)
{
	DrawingLib.GenericPrimitive.prototype.from.call(this, template);
	TwoDGeometry.Circle.prototype.from.call(this, template);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveCircle.prototype.copy=function()
{
	var r=new DrawingLib.PrimitiveCircle(this.c, this.r, this.style);
	//r.from(this);
	return r;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveCircle.prototype.getDOMObject=function(tr)
{
	var o=document.createElementNS(DrawingLib.svgNS, "circle");
	o.setAttribute("cx", (tr.originX+tr.scale*this.c.x).toFixed(1));
	o.setAttribute("cy", (tr.originY-tr.scale*this.c.y).toFixed(1));
	o.setAttribute("r", (tr.scale*this.r).toFixed(1));
	o.setAttribute("style", this.getSVGStyleString());
	return o;
};

//=======================
//PRIMITIVEARC OBJECT	
//=======================

DrawingLib.PrimitiveArc=function(p, r, alpha0, beta, st)
//p: center as TwoDGeometry.Vector
//r: radius as float
//sa: start angle as float
//ca: central angle as float
//st: style as ???
{
	DrawingLib.GenericPrimitive.call(this, st);
	TwoDGeometry.Arc.call(this, p, r, alpha0, beta);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveArc.prototype = Object.create(TwoDGeometry.Arc.prototype);

Object.assign(DrawingLib.PrimitiveArc.prototype, DrawingLib.GenericPrimitive.prototype);

DrawingLib.PrimitiveArc.prototype.constructor = DrawingLib.PrimitiveArc;

//-----------------------------------------------------------------------
DrawingLib.PrimitiveArc.prototype.from=function(template)
{
	DrawingLib.GenericPrimitive.prototype.from.call(this, template);
	TwoDGeometry.Arc.prototype.from.call(this, template);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveArc.prototype.copy=function()
{
	return new DrawingLib.PrimitiveArc(this.p, this.r, this.alpha0, this.beta, this.style);
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveArc.prototype.getDOMObject=function(tr)
{
	//EZ NEM JÓ!!!!!!
	var o=document.createElementNS(DrawingLib.svgNS, "circle");
	o.setAttribute("cx", (tr.originX+tr.scale*this.c.x).toFixed(1));
	o.setAttribute("cy", (tr.originY-tr.scale*this.c.y).toFixed(1));
	o.setAttribute("r", (tr.scale*this.r).toFixed(1));
	o.setAttribute("style", this.getSVGStyleString());
	return o;
};

//=======================
//PRIMITIVEPOLYGON OBJECT	
//=======================
DrawingLib.PrimitivePolygon=function(st)
//p0: start point as TwoDGeometry.Vector
//p1: end point as TwoDGeometry.Vector
//st: style

{
	DrawingLib.GenericPrimitive.call(this, st);
	TwoDGeometry.Polygon.call(this);
	return this;
};

//-----------------------------------------------------------------------
//setupInheritance(DrawingLib.PrimitivePolygon, TwoDGeometry.Polygon);

DrawingLib.PrimitivePolygon.prototype = Object.create(TwoDGeometry.Polygon.prototype);

Object.assign(DrawingLib.PrimitivePolygon.prototype, DrawingLib.GenericPrimitive.prototype);

DrawingLib.PrimitivePolygon.prototype.constructor = DrawingLib.PrimitivePolygon;

//-----------------------------------------------------------------------
DrawingLib.PrimitivePolygon.prototype.from=function(template)
{
	//console.log("DrawingLib.PrimitivePolygon.from() starts");
	DrawingLib.GenericPrimitive.prototype.from.call(this, template);
	TwoDGeometry.Polygon.prototype.from.call(this, template);
	//console.log("DrawingLib.PrimitivePolygon.from() ends");
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitivePolygon.prototype.copy=function()
{
	//console.log("DrawingLib.PrimitivePolygon.copy() starts");
	var r=new DrawingLib.PrimitivePolygon(this.style);
	r.from(this);
	//console.log("DrawingLib.PrimitivePolygon.copy() ends");
	return r;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitivePolygon.prototype.getDOMObject=function(tr)
{
	var points="";
	for(var i=0; i<this.vertices.length; i++)
	{
		points+=(tr.originX+tr.scale*this.vertices[i].x).toFixed(1)+","+(tr.originY-tr.scale*this.vertices[i].y).toFixed(1)+" ";
	}
	var o=document.createElementNS(DrawingLib.svgNS, "polygon");
	o.setAttribute("points", points);
	o.setAttribute("style", this.getSVGStyleString());
	return o;
};

//=======================
//PRIMITIVETEXT OBJECT	
//=======================

DrawingLib.PrimitiveText=function(p, alpha, text, st)
//p: point as TwoDGeometry.Vector
//alpha: rotation angle as float
//text: the text content as String
//align: String
//ls: line style as TwoDGeomety.LineStyle
{
	DrawingLib.GenericPrimitive.call(this, st);
	TwoDGeometry.Vector.call(this, p.x, p.y);
	this.alpha=alpha;
	this.text=text;
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveText.prototype = Object.create(TwoDGeometry.Vector.prototype);

Object.assign(DrawingLib.PrimitiveText.prototype, DrawingLib.GenericPrimitive.prototype);

DrawingLib.PrimitiveText.prototype.constructor = DrawingLib.PrimitiveText;

//-----------------------------------------------------------------------
DrawingLib.PrimitiveText.prototype.from=function(template)
{
	DrawingLib.GenericPrimitive.prototype.from.call(this, template);
	TwoDGeometry.Vector.prototype.from.call(this, template);
	this.alpha=template.alpha;
	this.text=template.alpha;
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveText.prototype.copy=function()
{
	return new DrawingLib.PrimitiveText(new TwoDGeometry.Vector(this.x, this.y), this.alpha, this.text, this.style);
};

//-----------------------------------------------------------------------
DrawingLib.PrimitiveText.prototype.getDOMObject=function(tr)
{
	
	var x=(tr.originX+tr.scale*this.x).toFixed(1);
	var y=(tr.originY-tr.scale*this.y).toFixed(1);
	var o=document.createElementNS(DrawingLib.svgNS, "text");
	o.setAttribute("x", x);
	o.setAttribute("y", y);
	o.setAttribute("transform", "rotate("+(-this.alpha/Math.PI*180).toFixed(3)+" "+x+" "+y+")");
	o.setAttribute("style", this.getSVGStyleString());
	o.textContent=this.text;
	return o;
};

//=======================
//DRAWINGFRAGMENT OBJECT	
//=======================
//The DrawingContent object contains drawable primitive objects
//If you add a complex object, it will be breaken down to drawable primitives
//Drawable primitives will keep a reference to the complex object		
DrawingLib.DrawingFragment=function()
{
	this.drawables=[];
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.from=function(template)
{
	this.drawables=[];
	for(var i=0; i<template.drawables.length; i++)
	{
		this.add(template.drawables[i].copy());
	}
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.copy=function()
{
	var r=new DrawingLib.DrawingFragment();
	r.from(this);
	return r;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.add=function(o)
{
	this.drawables.push(o);
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.addPoint=function(x, y, st)
{
	var o=new DrawingLib.PrimitivePoint(new TwoDGeometry.Vector(x, y), st);
	this.drawables.push(o);
	return o;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.addLine=function(x0, y0, x1, y1, st)
{
	var o=new DrawingLib.PrimitiveLine(new TwoDGeometry.Vector(x0, y0), new TwoDGeometry.Vector(x1, y1), st);
	this.drawables.push(o);
	return o;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.addCircle=function(x, y, r, st)
{
	var o=new DrawingLib.PrimitiveCircle(new TwoDGeometry.Vector(x, y), r, st);
	this.drawables.push(o);
	return o;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.addPolygon=function(coos, st)
{
	var o=new DrawingLib.PrimitivePolygon(st);
	for(var i=0; i<coos.length; i+=2)
	{
		o.addVertex(new TwoDGeometry.Vector(coos[i], coos[i+1]));
	}
	this.drawables.push(o);
	return o;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.addText=function(x, y, alpha, text, st)
{
	var o=new DrawingLib.PrimitiveText(new TwoDGeometry.Vector(x, y), alpha, text, ts);
	this.drawables.push(o);
	return o;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.multiplyThis=function(m)
{
	for(var i=0; i<this.drawables.length; i++)
	{
		this.drawables[i].multiplyThis(m);
	}
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.plusThis=function(v)
{
	for(var i=0; i<this.drawables.length; i++)
	{
		this.drawables[i].plusThis(v);
	}
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.minusThis=function(v)
{
	for(var i=0; i<this.drawables.length; i++)
	{
		this.drawables[i].minusThis(v);
	}
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.rotateThis=function(v)
{
	for(var i=0; i<this.drawables.length; i++)
	{
		this.drawables[i].rotateThis(v);
	}
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.getBoundingBox=function()
{
	var bb=this.drawables[0].getBoundingBox();
	for(var i=1; i<this.drawables.length; i++)
	{
		bb.plusThis(this.drawables[i].getBoundingBox());
	}
	return bb;
};

//-----------------------------------------------------------------------
DrawingLib.DrawingFragment.prototype.getDOMObject=function(tr)
{
	var o=document.createElementNS(DrawingLib.svgNS, "g");
	for(var i=0; i<this.drawables.length; i++)
	{
		o.appendChild(this.drawables[i].getDOMObject(tr));
	}
	return o;
};

//=======================
//SVGDRAWING OBJECT	
//=======================
//The DrawingContent object contains drawable primitive objects
//If you add a complex object, it will be breaken down to drawable primitives
//Drawable primitives will keep a reference to the complex object		
DrawingLib.SVGDrawing=function()
{
	DrawingLib.DrawingFragment.call(this);
	this.height=100;
	this.width=150;
	this.zeroTransform=new DrawingLib.ZeroTransform(0, this.height, 1);
	return this;
};

//-----------------------------------------------------------------------
DrawingLib.SVGDrawing.prototype = Object.create(DrawingLib.DrawingFragment.prototype);

//-----------------------------------------------------------------------
DrawingLib.SVGDrawing.prototype.constructor = DrawingLib.SVGDrawing;

//-----------------------------------------------------------------------
DrawingLib.SVGDrawing.prototype.getDOMObject=function(tr)
{
	var o=document.createElementNS(DrawingLib.svgNS, "svg");
	o.setAttribute("width", (this.width).toFixed(1));
	o.setAttribute("height", (this.height).toFixed(1));
	var r=document.createElementNS(DrawingLib.svgNS, "rect");
	r.setAttribute("x", 0);
	r.setAttribute("y", 0); 
	r.setAttribute("width", this.width);
	r.setAttribute("height", this.height);
	r.setAttribute("style", "stroke: #00ffff; stroke-width: 2; fill: none;");
	o.appendChild(r); 
	for(var i=0; i<this.drawables.length; i++)
	{
		o.appendChild(this.drawables[i].getDOMObject(this.zeroTransform));
	}
	return o;
};

//-----------------------------------------------------------------------
DrawingLib.SVGDrawing.prototype.scaleContentToBox=function()
{
	var bb=this.getBoundingBox();
	var hScale=this.width/bb.getWidth();
	var vScale=this.height/bb.getHeight();
	this.zeroTransform.scale=Math.min(hScale, vScale);
	this.zeroTransform.originX=0.5*(this.width-(bb.p0.x+bb.p1.x)*this.zeroTransform.scale);
	this.zeroTransform.originY=0.5*(this.height+(bb.p0.y+bb.p1.y)*this.zeroTransform.scale);
};

//-----------------------------------------------------------------------
DrawingLib.SVGDrawing.prototype.scaleBoxToContent=function(s)
{
	var bb=this.getBoundingBox();
	this.zeroTransform.scale=s;
	this.width=bb.getWidth()*this.zeroTransform.scale;
	this.height=bb.getHeight()*this.zeroTransform.scale;
	this.zeroTransform.originX=0.5*(this.width-(bb.p0.x+bb.p1.x)*this.zeroTransform.scale);
	this.zeroTransform.originY=0.5*(this.height+(bb.p0.y+bb.p1.y)*this.zeroTransform.scale);
};

//-----------------------------------------------------------------------
DrawingLib.SVGDrawing.prototype.scaleToDiameter=function(d)
{
	var bb=this.getBoundingBox();
	this.zeroTransform.scale=d/Math.sqrt(bb.p1.minusNew(bb.p0).getLength2());
	this.width=bb.getWidth()*this.zeroTransform.scale;
	this.height=bb.getHeight()*this.zeroTransform.scale;
	this.zeroTransform.originX=0.5*(this.width-(bb.p0.x+bb.p1.x)*this.zeroTransform.scale);
	this.zeroTransform.originY=0.5*(this.height+(bb.p0.y+bb.p1.y)*this.zeroTransform.scale);
};


//******************************
//Generic helper functions
function setupInheritance(drawable, parent)
{
	drawable.prototype = Object.create(parent.prototype);
	drawable.prototype.constructor = drawable;
	drawable.prototype.getSVGStyleString=DrawingLib.GenericPrimitive.prototype.getSVGStyleString;
};

