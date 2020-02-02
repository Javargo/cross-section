//****************************************
// CROSS SECTION LIBRARY
//****************************************
//Copyright: Major, Balazs
//E-mail: majorstructures@gmail.com
//****************************************
//Change history
//2019-07-15 Center bug fixed
//2018-12-30 All cross section related code moved into this file
//2018-12-26 First letter of object constructor functions turned to capital

//****************************************
//Todo
// - Move member functions to prototype and set up inheritance
// - Different alphas for hot rolled and cold formed pipes

//****************************************
//Dependencies
// - TwoDGeometry.js

//****************************************

//=======================
//CROSSSECTIONLIB OBJECT	
//=======================
var CrossSectionLib={};

//=======================
//PRIMERVERTEX OBJECT	
//=======================
//contour point with radius at the pont
CrossSectionLib.PrimerVertex=function(x, y, r)
{
	TwoDGeometry.Vector.call(this, x, y);
	this.r=r;
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerVertex.prototype = Object.create(TwoDGeometry.Vector.prototype);

//-----------------------------------------------------------------------
CrossSectionLib.PrimerVertex.prototype.constructor = CrossSectionLib.PrimerVertex;

//-----------------------------------------------------------------------
CrossSectionLib.PrimerVertex.prototype.toString=function()
{
	return "ConturVertex "+this.x+", "+this.y+", "+this.r;
};

//=======================
//PRIMERPOLYGON OBJECT	
//=======================	
//an array of primerVertexes
CrossSectionLib.PrimerPolygon=function()
{
	this.vertices=[];
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.addVertex=function(x, y, r)
{
	this.vertices[this.vertices.length]=new CrossSectionLib.PrimerVertex(x, y, r);
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.multiplyThis=function(m)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].multiplyThis(m);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.plusThis=function(v)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].plusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.minusThis=function(v)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].minusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.rotateThis=function(v)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].rotateThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.getBoundingBox=function()
{
	var b=this.vertices[0].getBoundingBox();
	for(var i=1; i<this.vertices.length; i++)
	{
		b.plusThis(this.vertices[i].getBoundingBox());
	}
	return b;
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerPolygon.prototype.getSVGObject=function()
{
	var points="";
	for(var i=0; i<this.vertices.length; i++)
	{
		points+=this.vertices[i].x+","+this.vertices[i].y+" ";
	}
	var x=document.createElementNS("http://www.w3.org/2000/svg","polygon");
	x.setAttribute("points", points);
	//x.setAttribute("style", "fill: none; stroke: red; stroke-width: 1px;"); 
	x.setAttribute("stroke", "red");
	x.setAttribute("stroke-width", "1");
	x.setAttribute("fill", "none");
	return x;
};

//=======================
//PRIMERCONTOUR OBJECT	
//=======================
//an array of primerPolygons
CrossSectionLib.PrimerContour=function()
{
	this.polygons=[];
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.getPolygon=function(i)
{
	if(this.polygons[i]==undefined) this.polygons[i]=new CrossSectionLib.PrimerPolygon();
	return this.polygons[i];
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.multiplyThis=function(m)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].multiplyThis(m);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.plusThis=function(v)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].plusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.minusThis=function(v)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].minusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.rotateThis=function(v)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].rotateThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.getBoundingBox=function()
{
	var b=this.polygons[0].vertices[0].getBoundingBox();
	for(var i=1; i<this.polygons.length; i++)
	{
		b.plusThis(this.polygons[i].getBoundingBox());
	}
	return b;
};

//-----------------------------------------------------------------------
CrossSectionLib.PrimerContour.prototype.getSVGObject=function()
{
	var b=this.getBoundingBox();
	var graphWidth=b.getWidth()*10;
	var graphHeight=b.getHeight()*10;
	var g=document.createElementNS("http://www.w3.org/2000/svg","svg");
	g.setAttribute("width", graphWidth);
	g.setAttribute("height", graphHeight);
	g.setAttribute("viewBox", ""+3*b.p0.x+" "+3*b.p0.y+" "+3*b.getWidth()+" "+3*b.getHeight());
	for(var i=0; i<this.polygons.length; i++)
	{
		g.appendChild(this.polygons[i].getSVGObject());
	}
	return g;
};

//=======================
//SECUNDERVERTEX OBJECT	
//=======================
//processed contour point with 1/radius of the following section
CrossSectionLib.SecunderVertex=function(x, y, w)
{
	TwoDGeometry.Vector.call(this, x, y);
	this.w=w; //előző szakaszhoz tartozó húrmagasság
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderVertex.prototype = Object.create(TwoDGeometry.Vector.prototype);

//-----------------------------------------------------------------------
CrossSectionLib.SecunderVertex.prototype.constructor = CrossSectionLib.SecunderVertex;

//-----------------------------------------------------------------------
CrossSectionLib.SecunderVertex.prototype.toString=function()
{
	return "SecunderVertex "+this.x+", "+this.y+", "+this.w;
};

//=======================
//SECUNDERPOLYGON OBJECT	
//=======================
CrossSectionLib.SecunderPolygon=function(primer)
{
	this.vertices=[];
	for(var i=0; i<primer.vertices.length; i++)
	{
		var actual=primer.vertices[i];
		if(actual.r==0)
		{
			this.vertices[this.vertices.length]=new CrossSectionLib.SecunderVertex(actual.x, actual.y, 0); 
		}
		else
		{
			var next=primer.vertices[i<primer.vertices.length-1?i+1:0];
			var previous=primer.vertices[i>0?i-1:primer.vertices.length-1];
			var a=new TwoDGeometry.Vector(next.x-actual.x, next.y-actual.y);
			var b=new TwoDGeometry.Vector(previous.x-actual.x, previous.y-actual.y);
			var c=new TwoDGeometry.Vector(actual.x, actual.y);
			var au=a.unitVector();
			var bu=b.unitVector();
			var sign=bu.vectorProduct(au)>0?1:-1;
			var factor=au.plusNew(bu).getLength()/au.minusNew(bu).getLength()*actual.r;
			var pa=c.plusNew(au.multiplyNew(factor));
			var pb=c.plusNew(bu.multiplyNew(factor));
			var L=pb.distance(pa); //húr hossza
			var w=sign*actual.r*(1-L/factor/2.0);
			this.vertices[this.vertices.length]=new CrossSectionLib.SecunderVertex(pb.x, pb.y, 0);
			this.vertices[this.vertices.length]=new CrossSectionLib.SecunderVertex(pa.x, pa.y, w);
			//L: a levágás (húr) hossza
			//r: lekerekítési sugár
			//w: körív legtávolabbi pontjának távolsága a húrtól
			//w=r-r*L/fact/2;
			//w=r-r^2/sqrt(r^2+factor^2);
			//w=r-Math.sqrt(r^2-L^2/4.0);
			//r=w/2.0+L^2/8.0/w;
		}
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getRoughArea=function()
{
	var A=0;
	var j;
	for(var i=0; i<this.vertices.length; i++)
	{
		j=i+1<this.vertices.length?i+1:0;
		A+=(this.vertices[i].x-this.vertices[j].x)*(this.vertices[i].y+this.vertices[j].y)/2;
	}
	return A;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getSection=function(i)
{
	var a=i;
	var b=(i+1)<this.vertices.length?(i+1):0;
	if(this.vertices[b].w==0)
	{
		return new TwoDGeometry.Section(this.vertices[a], this.vertices[b]);
	}
	else
	{
		return new TwoDGeometry.CurvedSection(this.vertices[a], this.vertices[b], this.vertices[b].w);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.multiplyThis=function(m)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].multiplyThis(m);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.plusThis=function(v)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].plusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.minusThis=function(v)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].minusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.rotateThis=function(v)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.vertices[i].rotateThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getLength=function()
{
	var sum=0;
	for(var i=0; i<this.vertices.length; i++)
	{
		sum+=this.getSection(i).getLength();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getM0x=function()
{
	var sum=0;
	for(var i=0; i<this.vertices.length; i++)
	{
		sum+=this.getSection(i).getM0x();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getM1x=function()
{
	var sum=0;
	for(var i=0; i<this.vertices.length; i++)
	{
		sum+=this.getSection(i).getM1x();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getM2x=function()
{
	var sum=0;
	for(var i=0; i<this.vertices.length; i++)
	{
		sum+=this.getSection(i).getM2x();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getBoundingBox=function()
{
	var b=this.vertices[0].getBoundingBox();
	//for(var i=1; i<this.vertices.length; i++)
	//{
	//	b.plusThis(this.vertices[i].getBoundingBox());
	//}
	for(var i=0; i<this.vertices.length; i++)
	{
		b.plusThis(this.getSection(i).getBoundingBox());
	}
	return b;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.addCrossSectionPropertiesTo=function(cp)
{
	for(var i=0; i<this.vertices.length; i++)
	{
		this.getSection(i).addCrossSectionPropertiesTo(cp);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.forEachSection=function(cbf)
//cbf: callback function; the argument is a section
{
	for(var i=0; i<this.vertices.length; i++)
	{
		cbf(this.getSection(i));
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getSVGObject=function()
{
	var points="";
	for(var i=0; i<this.vertices.length; i++)
	{
		points+=this.vertices[i].x+","+this.vertices[i].y+" ";
	}
	var x=document.createElementNS("http://www.w3.org/2000/svg","polygon");
	x.setAttribute("points", points); 
	x.setAttribute("stroke", "green");
	x.setAttribute("stroke-width", "1");
	x.setAttribute("fill", "none");
	return x;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderPolygon.prototype.getSVGdString=function()
{
	//var c=this.getRoughArea()>0?1:0;
	var d="";
	for(var i=0; i<this.vertices.length; i++)
	{
		if(i==0)
		{
			d+="M "+this.vertices[i].x+","+this.vertices[i].y+" ";
		}
		else
		{
			if(this.vertices[i].w==0)
			{
				d+="L "+this.vertices[i].x+","+this.vertices[i].y+" ";
			}
			else
			{
				var w=Math.abs(this.vertices[i].w);
				var L2=this.vertices[i].minusNew(this.vertices[i-1]).getLength2();
				var r=w/2.0+L2/8.0/w;
				var c=this.vertices[i].w>0?0:1;
				d+="A "+r+", "+r+" 0 0, "+c+" "+this.vertices[i].x+","+this.vertices[i].y+" ";
			}
		}
	}
	d+="Z ";
	return d;
};

//=======================
//SECUNDERCONTOUR OBJECT	
//=======================
CrossSectionLib.SecunderContour=function(primer)
{
	this.polygons=[];
	for(var i=0; i<primer.polygons.length; i++)
	{
		this.polygons[i]=new CrossSectionLib.SecunderPolygon(primer.polygons[i]);
	};
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.multiplyThis=function(m)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].multiplyThis(m);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.plusThis=function(v)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].plusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.minusThis=function(v)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].minusThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.rotateThis=function(v)
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].rotateThis(v);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getM0x=function()
{
	var sum=0;
	for(var i=0; i<this.polygons.length; i++)
	{
		sum+=this.polygons[i].getM0x();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getM1x=function()
{
	var sum=0;
	for(var i=0; i<this.polygons.length; i++)
	{
		sum+=this.polygons[i].getM1x();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getM2x=function()
{
	var sum=0;
	for(var i=0; i<this.polygons.length; i++)
	{
		sum+=this.polygons[i].getM2x();
	}
	return sum;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getWx1=function()
{
	return this.getM2x()/this.getBoundingBox().p1.y;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getWx2=function()
{
	return -this.getM2x()/this.getBoundingBox().p0.y;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getBoundingBox=function()
{
	var b=this.polygons[0].getBoundingBox();
	for(var i=1; i<this.polygons.length; i++)
	{
		b.plusThis(this.polygons[i].getBoundingBox());
	}
	return b;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.forEachSection=function(cbf)
//cbf: callback function; the argument is a section
{
	for(var i=0; i<this.polygons.length; i++)
	{
		this.polygons[i].forEachSection(cbf);
	}
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getBasicCrossSectionProperties=function()
{
	var cp=new CrossSectionLib.BasicCrossSectionProperties();
	//for(var i=0; i<this.polygons.length; i++)
	//{
	//	this.polygons[i].addCrossSectionPropertiesTo(cp);
	//}
	this.forEachSection(function(s){s.addCrossSectionPropertiesTo(cp)});
	return cp;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.center=function()
{
	var p=this.getBasicCrossSectionProperties();
	var c=new TwoDGeometry.Vector(p.Sy/p.A, p.Sx/p.A);
	//console.log("A="+p.A.toPrecision(3)+" Sx/A="+(p.Sx/p.A).toPrecision(3)+" Sy/A="+(p.Sy/p.A).toPrecision(3)+"<br/>");
	this.minusThis(c);
	//this.plusThis(c);
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getSVGElement=function()
{
	var dString="";
	for(var i=0; i<this.polygons.length; i++)
	{
		dString+=this.polygons[i].getSVGdString();
	}
	var p=document.createElementNS("http://www.w3.org/2000/svg","path");
	p.setAttribute("d", dString);
	p.setAttribute("stroke", "black");
	p.setAttribute("stroke-width", "0.3");
	p.setAttribute("fill", "gray");
	return p;
};

//-----------------------------------------------------------------------
CrossSectionLib.SecunderContour.prototype.getSVGObject=function()
{
	var b=this.getBoundingBox();
	var graphWidth=b.getWidth()*10;
	var graphHeight=b.getHeight()*10;
	var g=document.createElementNS("http://www.w3.org/2000/svg","svg");
	g.setAttribute("width", graphWidth);
	g.setAttribute("height", graphHeight);
	g.setAttribute("viewBox", ""+3*b.p0.x+" "+3*b.p0.y+" "+3*b.getWidth()+" "+3*b.getHeight());
	var dString="";
	for(var i=0; i<this.polygons.length; i++)
	{
		dString+=this.polygons[i].getSVGdString();
	}
	var p=document.createElementNS("http://www.w3.org/2000/svg","path");
	p.setAttribute("d", dString);
	p.setAttribute("stroke", "black");
	p.setAttribute("stroke-width", "0.3");
	p.setAttribute("fill", "gray");
	g.appendChild(p);
	var d=document.createElementNS("http://www.w3.org/2000/svg","rect");
	d.setAttribute("x", b.p0.x);
	d.setAttribute("y", b.p0.y);
	d.setAttribute("width", b.getWidth());
	d.setAttribute("height", b.getHeight());
	d.setAttribute("stroke", "red");
	d.setAttribute("stroke-width", "0.1");
	d.setAttribute("fill", "none");
	g.appendChild(d);
	return g;
};

//=======================
//BASICCROSSSECTIONPROPERTIES OBJECT	
//=======================
CrossSectionLib.BasicCrossSectionProperties=function()
{
	this.A=0;
	this.Sx=0;
	this.Sy=0;
	this.Ix=0;
	this.Iy=0;
	this.Ixy=0;
	this.Wplxp=0;
	this.Wplxn=0;
	this.Wplyp=0;
	this.Wplyn=0;
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.BasicCrossSectionProperties.prototype.show=function()
{
	document.writeln("<table>");
	document.writeln("<tr><td>A</td><td>"+this.A+"</td></tr>");
	document.writeln("<tr><td>S<sub>x</sub></td><td>"+this.Sx+"</td></tr>");
	document.writeln("<tr><td>S<sub>y</sub></td><td>"+this.Sy+"</td></tr>");
	document.writeln("<tr><td>I<sub>x</sub></td><td>"+this.Ix+"</td></tr>");
	document.writeln("<tr><td>I<sub>y</sub></td><td>"+this.Iy+"</td></tr>");
	document.writeln("<tr><td>I<sub>xy</sub></td><td>"+this.Ixy+"</td></tr>");
   document.writeln("<tr><td>W<sub>pl x</sub></td><td>"+this.Wplxp+"</td></tr>");
   document.writeln("<tr><td>W<sub>pl y</sub></td><td>"+this.Wplyp+"</td></tr>");
	document.writeln("</table>");
};

//=======================
//BUCKLABLEPART OBJECT	
//=======================

CrossSectionLib.BucklablePart=function(p0, p1, connectionType, thickness)
// p0 (TwoDGeometry.vector)
// p1 (TwoDGeometry.vector)
// connectionType (0: p0 fixed, p1 free; 1: both points fixed)
// thickness (number)
{
	TwoDGeometry.Section.call(this, p0, p1);
	this.connectionType=(connectionType==1)?1:0;
	this.thickness=thickness;
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.BucklablePart.prototype = Object.create(TwoDGeometry.Section.prototype);

//-----------------------------------------------------------------------
CrossSectionLib.BucklablePart.prototype.constructor = CrossSectionLib.BucklablePart;

//-----------------------------------------------------------------------
CrossSectionLib.BucklablePart.prototype.toString=function()
		{
			return this.p0.toString()+" "+this.p1.toString()+" type:"+this.connectionType+" t:"+this.thickness;
		};

//-----------------------------------------------------------------------
CrossSectionLib.BucklablePart.prototype.classifySimple=function(epsilon)
{
	var cpt=this.getLength()/this.thickness;
	//console.log(this.toString());
	//console.log("c/t="+cpt);
	if(this.connectionType==1)
	//both ends fixed
	{
		if(cpt<=33*epsilon) return 1;
		if(cpt<=38*epsilon) return 2;
		if(cpt<=42*epsilon) return 3;
	}
	else
	//p0 fixed, p1 free
	{
		if(cpt<=9*epsilon) return 1;
		if(cpt<=10*epsilon) return 2;
		if(cpt<=14*epsilon) return 3;
	}
	return 4;
};

//-----------------------------------------------------------------------
CrossSectionLib.BucklablePart.prototype.classify=function(NperA, MyperIy, MzperIz, epsilon)
{
	var s0=-(NperA+MyperIy*this.p0.x+MzperIz*p0.y);
	var s1=-(NperA+MyperIy*this.p1.x+MzperIz*p1.y);
	if(this.connectionType==1)
	//both ends fixed
	{
		if(s0>0)
		{
			if(s1>0)
			//pure compression
			{
				
			}
			else
			//alternating tension/compression
			{
				
			}
		}
		else
		{
			if(s1>0)
			//alternating tension/compression
			{
				
			}
			else
			//pure tension
			{
				return 0;
			}
		}
	}
	else
	// p0 fixed, p1 free
	{
		
	}
	return 4;
};

//-----------------------------------------------------------------------
CrossSectionLib.BucklablePart.prototype.getSVGElement=function()
{
	var g=document.createElementNS("http://www.w3.org/2000/svg","g");
	var l=document.createElementNS("http://www.w3.org/2000/svg","line");
	l.setAttribute("x1", this.p0.x.toFixed(1));
	l.setAttribute("y1", this.p0.y.toFixed(1));
	l.setAttribute("x2", this.p1.x.toFixed(1));
	l.setAttribute("y2", this.p1.y.toFixed(1));
	l.setAttribute("stroke", "blue");
	l.setAttribute("stroke-width", "0.5");
	l.setAttribute("fill", "none");
	g.appendChild(l);
	
	var ut=((this.p1.minusNew(this.p0)).unitVector()).multiplyNew(0.5*this.thickness);
	var pt=ut.perpendicular();
	var l=document.createElementNS("http://www.w3.org/2000/svg","line");
	l.setAttribute("x1", (this.p0.plusNew(pt)).x.toFixed(1));
	l.setAttribute("y1", (this.p0.plusNew(pt)).y.toFixed(1));
	l.setAttribute("x2", (this.p0.minusNew(pt)).x.toFixed(1));
	l.setAttribute("y2", (this.p0.minusNew(pt)).y.toFixed(1));
	l.setAttribute("stroke", "blue");
	l.setAttribute("stroke-width", "0.5");
	l.setAttribute("fill", "none");
	g.appendChild(l);
	
	if(this.connectionType==1)
	{
		var ut=((this.p1.minusNew(this.p0)).unitVector()).multiplyNew(0.5*this.thickness);
		var pt=ut.perpendicular();
		var l=document.createElementNS("http://www.w3.org/2000/svg","line");
		l.setAttribute("x1", this.p1.plusNew(pt).x.toFixed(1));
		l.setAttribute("y1", this.p1.plusNew(pt).y.toFixed(1));
		l.setAttribute("x2", this.p1.minusNew(pt).x.toFixed(1));
		l.setAttribute("y2", this.p1.minusNew(pt).y.toFixed(1));
		l.setAttribute("stroke", "blue");
		l.setAttribute("stroke-width", "0.5");
		l.setAttribute("fill", "none");
		g.appendChild(l);
	}
	else
	{
		var ut=((this.p1.minusNew(this.p0)).unitVector()).multiplyNew(0.5*this.thickness);
		var pt=ut.perpendicular();
		var l=document.createElementNS("http://www.w3.org/2000/svg","line");
		l.setAttribute("x1", this.p1.x.toFixed(1));
		l.setAttribute("y1", this.p1.y.toFixed(1));
		l.setAttribute("x2", this.p1.plusNew(pt).minusNew(ut).x.toFixed(1));
		l.setAttribute("y2", this.p1.plusNew(pt).minusNew(ut).y.toFixed(1));
		l.setAttribute("stroke", "blue");
		l.setAttribute("stroke-width", "0.5");
		l.setAttribute("fill", "none");
		g.appendChild(l);
		
		var ut=((this.p1.minusNew(this.p0)).unitVector()).multiplyNew(0.5*this.thickness);
		var pt=ut.perpendicular();
		var l=document.createElementNS("http://www.w3.org/2000/svg","line");
		l.setAttribute("x1", this.p1.x.toFixed(1));
		l.setAttribute("y1", this.p1.y.toFixed(1));
		l.setAttribute("x2", this.p1.minusNew(pt).minusNew(ut).x.toFixed(1));
		l.setAttribute("y2", this.p1.minusNew(pt).minusNew(ut).y.toFixed(1));
		l.setAttribute("stroke", "blue");

		l.setAttribute("stroke-width", "0.5");
		l.setAttribute("fill", "none");
		g.appendChild(l);
	}
	return g;
};

//=======================
//CROSSSECTION OBJECT	
//=======================
CrossSectionLib.CrossSection=function(pc)
// pc: primaryContour
{
	if(pc==undefined)
	{
		this.contour=null;
	}
	else
	{
		this.contour=new CrossSectionLib.SecunderContour(pc);
	}
	this.bucklableParts=[];
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.CrossSection.prototype.getBoundingBox=function()
{
	return this.contour.getBoundingBox();
};

//-----------------------------------------------------------------------
CrossSectionLib.CrossSection.prototype.getSVGElement=function()
{
	return this.contour.getSVGElement();
};

//-----------------------------------------------------------------------
CrossSectionLib.CrossSection.prototype.getSVGObject=function()
{
	var b=this.getBoundingBox();
	var graphWidth=b.getWidth()*1;
	var graphHeight=b.getHeight()*1;
	var g=document.createElementNS("http://www.w3.org/2000/svg","svg");
	g.setAttribute("width", graphWidth);
	g.setAttribute("height", graphHeight);
	var wbScale=1.1;
	g.setAttribute("viewBox", ""+wbScale*b.p0.x+" "+wbScale*b.p0.y+" "+wbScale*b.getWidth()+" "+wbScale*b.getHeight());
	g.appendChild(this.getSVGElement());
	for(var i=0; i<this.bucklableParts.length; i++)
	{
		g.appendChild(this.bucklableParts[i].getSVGElement());
	}
	return g;
};

//-----------------------------------------------------------------------
CrossSectionLib.CrossSection.prototype.getBasicCrossSectionProperties=function()
{
	return this.contour.getBasicCrossSectionProperties();
};

//-----------------------------------------------------------------------
CrossSectionLib.CrossSection.prototype.classifySimple=function(epsilon)
{
	if(this.bucklableParts.length==0) return 5;
	var worst=1;
	for(var i=0; i<this.bucklableParts.length; i++)
	{
		var c=this.bucklableParts[i].classifySimple(epsilon);
		if(c>worst) worst=c;
	}
	return worst;
};
	
//=======================
//FLATSTEEL OBJECT	
//=======================
CrossSectionLib.FlatSteel=function(h_, b_)
//h: height
//b: width
{
	var h=parseFloat(h_);
	var b=parseFloat(b_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(b/2, -h/2, 0);
	c.getPolygon(0).addVertex(b/2, h/2, 0);
	c.getPolygon(0).addVertex(-b/2, h/2, 0);
	c.getPolygon(0).addVertex(-b/2, -h/2, 0);
	CrossSectionLib.CrossSection.call(this, c);
	this.alphay=0.49; //buckling curve "c"
	this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.FlatSteel.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.FlatSteel.prototype.constructor = CrossSectionLib.FlatSteel;
	
//=======================
//ROUNDBAR OBJECT	
//=======================
CrossSectionLib.RoundBar=function(d_)
//d: diameter
{
	var d=parseFloat(d_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(d/2, -d/2, d/2);
	c.getPolygon(0).addVertex(d/2, d/2, d/2);
	c.getPolygon(0).addVertex(-d/2, d/2, d/2);
	c.getPolygon(0).addVertex(-d/2, -d/2, d/2);
	CrossSectionLib.CrossSection.call(this, c);
	this.alphay=0.49; //buckling curve "c"
	this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.RoundBar.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.RoundBar.prototype.constructor = CrossSectionLib.RoundBar;

//-----------------------------------------------------------------------
CrossSectionLib.RoundBar.prototype.classifySimple=function(epsilon)
{
	return 1;
};
	
//=======================
//PIPE OBJECT	
//=======================
CrossSectionLib.Pipe=function(d_, t_)
//d: outside diameter
//t: wall thickness
{
	var d=parseFloat(d_);
	var t=parseFloat(t_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(d/2, -d/2, d/2);
	c.getPolygon(0).addVertex(d/2, d/2, d/2);
	c.getPolygon(0).addVertex(-d/2, d/2, d/2);
	c.getPolygon(0).addVertex(-d/2, -d/2, d/2);
	c.getPolygon(1).addVertex(d/2-t, -d/2+t, d/2-t);
	c.getPolygon(1).addVertex(-d/2+t, -d/2+t, d/2-t);
	c.getPolygon(1).addVertex(-d/2+t, d/2-t, d/2-t);
	c.getPolygon(1).addVertex(d/2-t, d/2-t, d/2-t);
	CrossSectionLib.CrossSection.call(this, c);
	// if hot rolled
	this.alphay=0.21; //buckling curve "a"
	this.alphaz=0.21; //buckling curve "a"
	// if cold formed
	//this.alphay=0.49; //buckling curve "c"
	//this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.Pipe.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.Pipe.prototype.constructor = CrossSectionLib.Pipe;

//-----------------------------------------------------------------------
CrossSectionLib.Pipe.prototype.classifySimple=function(epsilon)
{
	if((d/t)<=50*epsilon*epsilon) return 1;
	if((d/t)<=70*epsilon*epsilon) return 2;
	if((d/t)<=90*epsilon*epsilon) return 3;
	return 4;
};
	
//=======================
//GENERICPARALLELFLANGEH OBJECT	
//=======================
CrossSectionLib.GenericParallelFlangeH=function(h_, b_, f_, w_, r_)
//h: height
//b: width of flange
//f: thickness of flange
//w: thickness of web
//r: rounding radius
{
	var h=parseFloat(h_);
	var b=parseFloat(b_);
	var f=parseFloat(f_);
	var w=parseFloat(w_);
	var r=parseFloat(r_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(b/2, -h/2, 0);
	c.getPolygon(0).addVertex(b/2, -h/2+f, 0);
	c.getPolygon(0).addVertex(w/2, -h/2+f, r);
	c.getPolygon(0).addVertex(w/2, h/2-f, r);
	c.getPolygon(0).addVertex(b/2, h/2-f, 0);
	c.getPolygon(0).addVertex(b/2, h/2, 0);
	c.getPolygon(0).addVertex(-b/2, h/2, 0);
	c.getPolygon(0).addVertex(-b/2, h/2-f, 0);
	c.getPolygon(0).addVertex(-w/2, h/2-f, r);
	c.getPolygon(0).addVertex(-w/2, -h/2+f, r);
	c.getPolygon(0).addVertex(-b/2, -h/2+f, 0);
	c.getPolygon(0).addVertex(-b/2, -h/2, 0);
	CrossSectionLib.CrossSection.call(this, c);
	this.It=1.30*(2*b*f*f*f+(h-2*f)*w*w*w)/3;
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(w/2+r, h/2-f/2), new TwoDGeometry.Vector(b/2, h/2-f/2), 0, f));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(-w/2-r, h/2-f/2), new TwoDGeometry.Vector(-b/2, h/2-f/2), 0, f));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(w/2+r, -h/2+f/2), new TwoDGeometry.Vector(b/2, -h/2+f/2), 0, f));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(-w/2-r, -h/2+f/2), new TwoDGeometry.Vector(-b/2, -h/2+f/2), 0, f));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(0, h/2-f-r), new TwoDGeometry.Vector(0, -h/2+f+r), 1, w));
	if(h/b>1.2)
	{
		if(f<=40)
		{
			this.alphay=0.21; //buckling curve "a"
			this.alphaz=0.34; //buckling curve "b"
		}
		else
		{
			if(f<=100)
			{
				this.alphay=0.34; //buckling curve "b"
				this.alphaz=0.49; //buckling curve "c"
			}
			else
			{
				//Eurocode 3 does not define any value for this case
				this.alphay=null;
				this.alphaz=null;
			}
		}
	}
	else
	{
		if(f<=100)
		{
			this.alphay=0.34; //buckling curve "b"
			this.alphaz=0.49; //buckling curve "c"
		}
		else
		{
			this.alphay=0.76; //buckling curve "d"
			this.alphaz=0.76; //buckling curve "d"
		}
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.GenericParallelFlangeH.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.GenericParallelFlangeH.prototype.constructor = CrossSectionLib.GenericParallelFlangeH;
    
//=======================
//IPE OBJECT	
//=======================
CrossSectionLib.IPE=function(h)
//h: height
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.IPE_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.IPE_dimensions_table[i];
		if(d.h==h)
		{
			CrossSectionLib.GenericParallelFlangeH.call(this, d.h, d.b, d.tg, d.ts, d.r);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No IPE with height of "+h+" mm!");
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.IPE.prototype = Object.create(CrossSectionLib.GenericParallelFlangeH.prototype);

CrossSectionLib.IPE.prototype.constructor = CrossSectionLib.IPE;
    
//=======================
//HEA OBJECT	
//=======================
CrossSectionLib.HEA=function(h)
//h: height
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.HEA_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.HEA_dimensions_table[i];
		if(d.n==h)
		{
			CrossSectionLib.GenericParallelFlangeH.call(this, d.h, d.b, d.tg, d.ts, d.r);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No HEA with nominal height of "+h+" mm!");
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HEA.prototype = Object.create(CrossSectionLib.GenericParallelFlangeH.prototype);

CrossSectionLib.HEA.prototype.constructor = CrossSectionLib.HEA;
    
//=======================
//HEB OBJECT	
//=======================
CrossSectionLib.HEB=function(h)
//h: height
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.HEB_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.HEB_dimensions_table[i];
		if(d.n==h)
		{
			CrossSectionLib.GenericParallelFlangeH.call(this, d.h, d.b, d.tg, d.ts, d.r);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No HEB with height of "+h+" mm!");
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HEB.prototype = Object.create(CrossSectionLib.GenericParallelFlangeH.prototype);

CrossSectionLib.HEB.prototype.constructor = CrossSectionLib.HEB;
    
//=======================
//HEM OBJECT	
//=======================
CrossSectionLib.HEM=function(h)
//h: height
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.HEM_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.HEM_dimensions_table[i];
		if(d.n==h)
		{
			CrossSectionLib.GenericParallelFlangeH.call(this, d.h, d.b, d.tg, d.ts, d.r);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No HEM with nominal height of "+h+" mm!");
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HEM.prototype = Object.create(CrossSectionLib.GenericParallelFlangeH.prototype);

CrossSectionLib.HEM.prototype.constructor = CrossSectionLib.HEM;
    
//=======================
//GENERICHOTROLLEDU OBJECT	
//=======================
CrossSectionLib.GenericHotRolledU=function(h_, b_, w_, f1_, f2_, r1_, r2_)
//h: height
//b: width (of flange)
//w: thickness of web
//f1: thickness of flange at the web
//f2: thickness of flange at the free end
//r1: rounding radius at the web
//r2: rounding radius at the free end
{
	var h=parseFloat(h_);
	var b=parseFloat(b_);
	var w=parseFloat(w_);
	var f1=parseFloat(f1_);
	var f2=parseFloat(f2_);
	var r1=parseFloat(r1_);
	var r2=parseFloat(r2_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(0, -h/2, 0);
	c.getPolygon(0).addVertex(b, -h/2, 0);
	c.getPolygon(0).addVertex(b, -h/2+f2, r2);
	c.getPolygon(0).addVertex(w, -h/2+f1, r1);
	c.getPolygon(0).addVertex(w, h/2-f1, r1);
	c.getPolygon(0).addVertex(b, h/2-f2, r2);
	c.getPolygon(0).addVertex(b, h/2, 0);
	c.getPolygon(0).addVertex(0, h/2, 0);
	CrossSectionLib.CrossSection.call(this, c);
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(w/2, h/2-f1-r1), new TwoDGeometry.Vector(w/2, -h/2+f1+r1), 1, w));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(w+r1, h/2-f1/2), new TwoDGeometry.Vector(b, h/2-f2/2), 0, (f1+f2)/2));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(w+r1, -h/2+f1/2), new TwoDGeometry.Vector(b, -h/2+f2/2), 0, (f1+f2)/2));
	this.alphay=0.49; //buckling curve "c"
	this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.GenericHotRolledU.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.GenericHotRolledU.prototype.constructor = CrossSectionLib.GenericHotRolledU;
    
//=======================
//UNP OBJECT	
//=======================
CrossSectionLib.UNP=function(n)
//n: name
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.UNP_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.UNP_dimensions_table[i];
		if(d.n==n)
		{
			if(d.h<=300)
			{
				var tg1=d.tg+0.08*(d.b/2-d.ts);
				var tg2=d.tg-0.08*d.b/2;
			}
			else
			{   
				var tg1=d.tg+0.05*(d.b-d.ts)/2;
				var tg2=d.tg-0.05*(d.b-d.ts)/2;                    
			}
			CrossSectionLib.GenericHotRolledU.call(this, d.h, d.b, d.ts, tg1, tg2, d.r1, d.r2);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No UNP with height of "+n+" mm!");
	}
	var csp=this.getBasicCrossSectionProperties();
	var m=new TwoDGeometry.Vector(csp.Sy/csp.A, 0);
	this.contour.minusThis(m);
	for(var i=0; i<this.bucklableParts.length; i++)
	{
		this.bucklableParts[i].minusThis(m);
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.UNP.prototype = Object.create(CrossSectionLib.GenericHotRolledU.prototype);

CrossSectionLib.UNP.prototype.constructor = CrossSectionLib.UNP;
	
//=======================
//GENERICHOTROLLEDL OBJECT	
//=======================
CrossSectionLib.GenericHotRolledL=function(b1_, b2_, w_, rc_, re_)
//b1: length of flange 1
//b2: length of flange 2
//w: thickness
//rc: rounding radius at the center
//re: rounding radius at the end
{
	var b1=parseFloat(b1_);
	var b2=parseFloat(b2_);
	var w=parseFloat(w_);
	var rc=parseFloat(rc_);
	var re=parseFloat(re_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(0, 0, 0);
	c.getPolygon(0).addVertex(b2, 0, 0);
	c.getPolygon(0).addVertex(b2, w, re);
	c.getPolygon(0).addVertex(w, w, rc);
	c.getPolygon(0).addVertex(w, b1, re);
	c.getPolygon(0).addVertex(0, b1, 0);
	CrossSectionLib.CrossSection.call(this, c);
	//Az EC3-ban (Bautabellen) van itt egy homályos utalás, hogy lásd az egyoldalról megtámasztott lemezeket is. De ezt hogyan kell érteni? Itt nem implementáltam sehogy.
	this.alphay=0.49; //buckling curve "c"
	this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.GenericHotRolledL.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.GenericHotRolledL.prototype.constructor = CrossSectionLib.GenericHotRolledL;

//-----------------------------------------------------------------------
CrossSectionLib.GenericHotRolledL.prototype.classifySimple=function(epsilon)
{
	if((Math.max(b1, b2)/w)<=15*epsilon && ((b1+b2)/(2*w))<=11.5*epsilon) return 3;
	return 4;
};
    
//=======================
//HOTROLLEDL OBJECT	
//=======================
CrossSectionLib.HotRolledL=function(n)
//h: height
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.L_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.L_dimensions_table[i];
		if(d.n==n)
		{
			CrossSectionLib.GenericHotRolledL.call(this, d.a, d.b, d.t, d.r1, d.r1/2);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No hot rolled L with dimensions of "+n+"!");
	}
	var csp=this.getBasicCrossSectionProperties();
	this.contour.minusThis(new TwoDGeometry.Vector(csp.Sy/csp.A, csp.Sx/csp.A));
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HotRolledL.prototype = Object.create(CrossSectionLib.GenericHotRolledL.prototype);

CrossSectionLib.HotRolledL.prototype.constructor = CrossSectionLib.HotRolledL;
    
//=======================
//GENERICHOTROLLEDZ OBJECT	
//=======================
CrossSectionLib.GenericHotRolledZ=function(h_, b_, s_, t_, r1_, r2_)
//h: height
//b: width (of flange)
//s: thickness of web
//t: thickness of flange
//r1: rounding radius at the root
//r2: rounding radius at the free end
{
	var h=parseFloat(h_);
	var b=parseFloat(b_);
	var s=parseFloat(s_);
	var t=parseFloat(t_);
	var r1=parseFloat(r1_);
	var r2=parseFloat(r2_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(s/2, h/2, 0);
	c.getPolygon(0).addVertex(s/2-b, h/2, 0);
	c.getPolygon(0).addVertex(s/2-b, h/2-t, r2);
	c.getPolygon(0).addVertex(-s/2, h/2-t, r1);
	c.getPolygon(0).addVertex(-s/2, -h/2, 0);
	c.getPolygon(0).addVertex(-s/2+b, -h/2, 0);
	c.getPolygon(0).addVertex(-s/2+b, -h/2+t, r2);
	c.getPolygon(0).addVertex(s/2, -h/2+t, r1);
	CrossSectionLib.CrossSection.call(this, c);
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(0, h/2-t-r1), new TwoDGeometry.Vector(0, -h/2+t+r1), 1, s));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(-s/2-r1, h/2-t/2), new TwoDGeometry.Vector(-b+s/2, h/2-t/2), 0, t));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(s/2+r1, -h/2+t/2), new TwoDGeometry.Vector(b-s/2, -h/2+t/2), 0, t));
	//Eurocode 3 does not define any value for this case
	this.alphay=null;
	this.alphaz=null;
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.GenericHotRolledZ.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.GenericHotRolledZ.prototype.constructor = CrossSectionLib.GenericHotRolledZ;
    
//=======================
//HOTROLLEDZ OBJECT	
//=======================
CrossSectionLib.HotRolledZ=function(n)
//n: name
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.Z_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.Z_dimensions_table[i];
		if(d.n==n)
		{
			CrossSectionLib.GenericHotRolledZ.call(this, d.h, d.b, d.s, d.t, d.t, d.r2);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No Z with height of "+n+" mm!");
	}
	//var csp=this.getBasicCrossSectionProperties();
	//this.contour.minusThis(new TwoDGeometry.Vector(csp.Sy/csp.A, 0));
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HotRolledZ.prototype = Object.create(CrossSectionLib.GenericHotRolledZ.prototype);

CrossSectionLib.HotRolledZ.prototype.constructor = CrossSectionLib.HotRolledZ;
    
//=======================
//HOTROLLEDT OBJECT	
//=======================
CrossSectionLib.HotRolledT=function(n)
//n: name
{
	var created=false;
	for(var i=0; i<CrossSectionLib.ProfileTables.T_dimensions_table.length; i++)
	{
		var d=CrossSectionLib.ProfileTables.T_dimensions_table[i];
		if(d.n==n)
		{
			var c=new CrossSectionLib.PrimerContour();
			var h=d.h;
			var b=d.b;
			var s=d.s;
			var r1=d.r1;
			var r2=d.r2;
			var r3=d.r3;
			var e=0.02*(b/4-s/2-0.02*(h/2-s))/(1-0.02*0.02);
			var f=0.02*(h/2-s-e);
			c.getPolygon(0).addVertex(b/2, 0, 0);
			c.getPolygon(0).addVertex(-b/2, 0, 0);
			c.getPolygon(0).addVertex(-b/2, -s+0.02*b/4, r2);
			c.getPolygon(0).addVertex(-s/2-f, -s-e, r1);
			c.getPolygon(0).addVertex(-s/2+0.02*h/2, -h, r3);
			c.getPolygon(0).addVertex(s/2-0.02*h/2, -h, r3);
			c.getPolygon(0).addVertex(s/2+f, -s-e, r1);
			c.getPolygon(0).addVertex(b/2, -s+0.02*b/4, r2);
			CrossSectionLib.CrossSection.call(this, c);
			created=true;
			break;
		}
	}
	if(created==false)
	{
		throw("No T with height of "+n+" mm!");
	}
	var csp=this.getBasicCrossSectionProperties();
	this.contour.minusThis(new TwoDGeometry.Vector(0, csp.Sx/csp.A));
	this.alphay=0.49; //buckling curve "c"
	this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HotRolledT.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.HotRolledT.prototype.constructor = CrossSectionLib.HotRolledT;
	
//=======================
//GENERICHOLLOWRECTANGLE OBJECT	
//=======================
CrossSectionLib.GenericHollowRectangle=function(h_, b_, t_, ro_, ri_)
{
	var h=parseFloat(h_);
	var b=parseFloat(b_);
	var t=parseFloat(t_);
	var ro=parseFloat(ro_);
	var ri=parseFloat(ri_);
	var c=new CrossSectionLib.PrimerContour();
	c.getPolygon(0).addVertex(b/2, -h/2, ro);
	c.getPolygon(0).addVertex(b/2, h/2, ro);
	c.getPolygon(0).addVertex(-b/2, h/2, ro);
	c.getPolygon(0).addVertex(-b/2, -h/2, ro);
	c.getPolygon(1).addVertex(b/2-t, -h/2+t, ri);
	c.getPolygon(1).addVertex(-b/2+t, -h/2+t, ri);
	c.getPolygon(1).addVertex(-b/2+t, h/2-t, ri);
	c.getPolygon(1).addVertex(b/2-t, h/2-t, ri);
	CrossSectionLib.CrossSection.call(this, c);
	var p=new CrossSectionLib.PrimerPolygon();
	p.addVertex(b/2-t/2, -h/2+t/2, (ro+ri)/2);
	p.addVertex(b/2-t/2, h/2-t/2, (ro+ri)/2);
	p.addVertex(-b/2+t/2, h/2-t/2, (ro+ri)/2);
	p.addVertex(-b/2+t/2, -h/2+t/2, (ro+ri)/2);
	ps=new CrossSectionLib.SecunderPolygon(p);
	var A=ps.getM0x();
	var l=ps.getLength();
	//torsion
	this.It=4*A*A*t/l;
	//section classification
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(b/2-t/2, h/2-t-ri), new TwoDGeometry.Vector(b/2-t/2, -h/2+t+ri), 1, t));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(-b/2+t/2, h/2-t-ri), new TwoDGeometry.Vector(-b/2+t/2, -h/2+t+ri), 1, t));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(b/2-t-ri, h/2-t/2), new TwoDGeometry.Vector(-b/2+t+ri, h/2-t/2), 1, t));
	this.bucklableParts.push(new CrossSectionLib.BucklablePart(new TwoDGeometry.Vector(b/2-t-ri, -h/2+t/2), new TwoDGeometry.Vector(-b/2+t+ri, -h/2+t/2), 1, t));
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.GenericHollowRectangle.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.GenericHollowRectangle.prototype.constructor = CrossSectionLib.GenericHollowRectangle;
    
//=======================
//HOLLOWRECTANGLEEXTRUDED OBJECT	
//=======================
CrossSectionLib.HollowRectangleExtruded=function(h_, b_, t_)
{
	CrossSectionLib.GenericHollowRectangle.call(this, h_, b_, t_, 0, 0);
	this.alphay=0.21; //buckling curve "a"
	this.alphaz=0.21; //buckling curve "a"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HollowRectangleExtruded.prototype = Object.create(CrossSectionLib.GenericHollowRectangle.prototype);

CrossSectionLib.HollowRectangleExtruded.prototype.constructor = CrossSectionLib.HollowRectangleExtruded;
    
//=======================
//HOLLOWRECTANGLEHOTROLLED OBJECT	
//=======================
CrossSectionLib.HollowRectangleHotRolled=function(h_, b_, t_)
{
	CrossSectionLib.GenericHollowRectangle.call(this, h_, b_, t_, 1.5*t_, 1.0*t_);
	this.alphay=0.21; //buckling curve "a"
	this.alphaz=0.21; //buckling curve "a"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HollowRectangleHotRolled.prototype = Object.create(CrossSectionLib.GenericHollowRectangle.prototype);

CrossSectionLib.HollowRectangleHotRolled.prototype.constructor = CrossSectionLib.HollowRectangleHotRolled;
    
//=======================
//HOLLOWRECTANGLECOLDFORMED OBJECT	
//=======================
CrossSectionLib.HollowRectangleColdFormed=function(h_, b_, t_)
{
	if(t_<=6)
	{
		var to=2.0*t_;
		var ti=1.0*t_;
	}
	else
	{
		if(t_<=10)
		{
			var to=2.5*t_;
			var ti=1.5*t_;
		}
		else
		{
			var to=3.0*t_;
			var ti=2.0*t_;
		}
	}    
	CrossSectionLib.GenericHollowRectangle.call(this, h_, b_, t_, to, ti);
	this.alphay=0.49; //buckling curve "c"
	this.alphaz=0.49; //buckling curve "c"
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.HollowRectangleColdFormed.prototype = Object.create(CrossSectionLib.GenericHollowRectangle.prototype);

CrossSectionLib.HollowRectangleColdFormed.prototype.constructor = CrossSectionLib.HollowRectangleColdFormed;
	
//=======================
//CROSSSECTIONBYDENOMINATION OBJECT	
//=======================
CrossSectionLib.CrossSectionByDenomination=function(d)
{
	var patterns=
	[
		{pattern: /\bipe\s*(\d+)/i, action: CrossSectionLib.IPE}, //IPE
		{pattern: /\bhea\s*(\d+)/i, action: CrossSectionLib.HEA}, //HEA
		{pattern: /\bipb\s*(\d+)/i, action: CrossSectionLib.HEB}, //HEB
		{pattern: /\bheb\s*(\d+)/i, action: CrossSectionLib.HEB}, //HEB
		{pattern: /\bhem\s*(\d+)/i, action: CrossSectionLib.HEM}, //HEM
		{pattern: /\bu\s*(\d+x*\d*)/i, action: CrossSectionLib.UNP},	//UNP
		{pattern: /\bunp\s*(\d+x*\d*)/i, action: CrossSectionLib.UNP},	//UNP
		{pattern: /\bflachstahl\s*(\d+(?:\.)?\d*)[/x\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.FlatSteel},
		{pattern: /\bflat\s*steel\s*(\d+(?:\.)?\d*)[/x\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.FlatSteel},
		{pattern: /\brundstahl\s*(\d+(?:\.)?\d*)/i, action: CrossSectionLib.RoundBar},
		{pattern: /\bround\s*bar\s*(\d+(?:\.)?\d*)/i, action: CrossSectionLib.RoundBar},
		{pattern: /\brohr\s*(\d+(?:\.)?\d*)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.Pipe},
		{pattern: /\bpipe\s*(\d+(?:\.)?\d*)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.Pipe},
		{pattern: /\bfrk\s*(\d+)[/\*](\d+)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.HollowRectangleColdFormed},	//rectangular hollow cold formed
		{pattern: /\brhc\s*(\d+)[/\*](\d+)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.HollowRectangleColdFormed},	//rectangular hollow cold formed
		{pattern: /\bfrw\s*(\d+)[/\*](\d+)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.HollowRectangleHotRolled},	//rectangular hollow hot rolled
		{pattern: /\brhw\s*(\d+)[/\*](\d+)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.HollowRectangleHotRolled},	//rectangular hollow hot rolled
		{pattern: /\bfre\s*(\d+)[/\*](\d+)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.HollowRectangleExtruded},	//rectangular hollow extruded
		{pattern: /\brhe\s*(\d+)[/\*](\d+)[/\*](\d+(?:\.)?\d*)/i, action: CrossSectionLib.HollowRectangleExtruded},	//rectangular hollow extruded
		{pattern: /\blw\s*(\d+x\d+x*\d*)/i, action: CrossSectionLib.HotRolledL},	//L
		{pattern: /\bt\s*(\d+)/i, action: CrossSectionLib.HotRolledT},	//T
		{pattern: /\bz\s*(\d+)/i, action: CrossSectionLib.HotRolledZ},	//Z
	];

	var found=false;
	var d2=d.replace(",", ".");
	for(var i=0; i<patterns.length; i++)
	{
		if(patterns[i].pattern.test(d2))
		{
			found=true;
			var res=patterns[i].pattern.exec(d2);
			patterns[i].action.apply(this, res.slice(1));
			break;
		}
	}
	if(found==false)
	{
		throw("Section denominator "+d+" cannot be resolved!");
	}
	return this;
};

//-----------------------------------------------------------------------
CrossSectionLib.CrossSectionByDenomination.prototype = Object.create(CrossSectionLib.CrossSection.prototype);

CrossSectionLib.CrossSectionByDenomination.prototype.constructor = CrossSectionLib.CrossSectionByDenomination;

//=======================
//PROFILETABLES OBJECT	
//=======================

CrossSectionLib.ProfileTables=
{

	IPE_dimensions_table:
	[
        {n:	80	, h:	80.00	, b:	46.00	, ts:	3.80	, tg:	5.20	, r:	5.00	},
        {n:	100	, h:	100.00	, b:	55.00	, ts:	4.10	, tg:	5.70	, r:	7.00	},
        {n:	120	, h:	120.00	, b:	64.00	, ts:	4.40	, tg:	6.30	, r:	7.00	},
        {n:	140	, h:	140.00	, b:	73.00	, ts:	4.70	, tg:	6.90	, r:	7.00	},
        {n:	160	, h:	160.00	, b:	82.00	, ts:	5.00	, tg:	7.40	, r:	9.00	},
        {n:	180	, h:	180.00	, b:	91.00	, ts:	5.30	, tg:	8.00	, r:	9.00	},
        {n:	200	, h:	200.00	, b:	100.00	, ts:	5.60	, tg:	8.50	, r:	12.00	},
        {n:	220	, h:	220.00	, b:	110.00	, ts:	5.90	, tg:	9.20	, r:	12.00	},
        {n:	240	, h:	240.00	, b:	120.00	, ts:	6.20	, tg:	9.80	, r:	15.00	},
        {n:	270	, h:	270.00	, b:	135.00	, ts:	6.60	, tg:	10.20	, r:	15.00	},
        {n:	300	, h:	300.00	, b:	150.00	, ts:	7.10	, tg:	10.70	, r:	15.00	},
        {n:	330	, h:	330.00	, b:	160.00	, ts:	7.50	, tg:	11.50	, r:	18.00	},
        {n:	360	, h:	360.00	, b:	170.00	, ts:	8.00	, tg:	12.70	, r:	18.00	},
        {n:	400	, h:	400.00	, b:	180.00	, ts:	8.60	, tg:	13.50	, r:	21.00	},
        {n:	450	, h:	450.00	, b:	190.00	, ts:	9.40	, tg:	14.60	, r:	21.00	},
        {n:	500	, h:	500.00	, b:	200.00	, ts:	10.20	, tg:	16.00	, r:	21.00	},
        {n:	550	, h:	550.00	, b:	210.00	, ts:	11.10	, tg:	17.20	, r:	24.00	},
        {n:	600	, h:	600.00	, b:	220.00	, ts:	12.00	, tg:	19.00	, r:	24.00	}
	],
    
    HEA_dimensions_table:
	[
        {n:	100	, h:	96	, b:	100	, ts:	5.0	, tg:	8.0	, r:	12.0	},
        {n:	120	, h:	114	, b:	120	, ts:	5.0	, tg:	8.0	, r:	12.0	},
        {n:	140	, h:	133	, b:	140	, ts:	5.5	, tg:	8.5	, r:	12.0	},
        {n:	160	, h:	152	, b:	160	, ts:	6.0	, tg:	9.0	, r:	15.0	},
        {n:	180	, h:	171	, b:	180	, ts:	6.0	, tg:	9.5	, r:	15.0	},
        {n:	200	, h:	190	, b:	200	, ts:	6.5	, tg:	10.0	, r:	18.0	},
        {n:	220	, h:	210	, b:	220	, ts:	7.0	, tg:	11.0	, r:	18.0	},
        {n:	240	, h:	230	, b:	240	, ts:	7.5	, tg:	12.0	, r:	21.0	},
        {n:	260	, h:	250	, b:	260	, ts:	7.5	, tg:	12.5	, r:	24.0	},
        {n:	280	, h:	270	, b:	280	, ts:	8.0	, tg:	13.0	, r:	24.0	},
        {n:	300	, h:	290	, b:	300	, ts:	8.5	, tg:	14.0	, r:	27.0	},
        {n:	320	, h:	310	, b:	300	, ts:	9.0	, tg:	15.5	, r:	27.0	},
        {n:	340	, h:	330	, b:	300	, ts:	9.5	, tg:	16.5	, r:	27.0	},
        {n:	360	, h:	350	, b:	300	, ts:	10.0	, tg:	17.5	, r:	27.0	},
        {n:	400	, h:	390	, b:	300	, ts:	11.0	, tg:	19.0	, r:	27.0	},
        {n:	450	, h:	440	, b:	300	, ts:	11.5	, tg:	21.0	, r:	27.0	},
        {n:	500	, h:	490	, b:	300	, ts:	12.0	, tg:	23.0	, r:	27.0	},
        {n:	550	, h:	540	, b:	300	, ts:	12.5	, tg:	24.0	, r:	27.0	},
        {n:	600	, h:	590	, b:	300	, ts:	13.0	, tg:	25.0	, r:	27.0	},
        {n:	650	, h:	640	, b:	300	, ts:	13.5	, tg:	26.0	, r:	27.0	},
        {n:	700	, h:	690	, b:	300	, ts:	14.5	, tg:	27.0	, r:	27.0	},
        {n:	800	, h:	790	, b:	300	, ts:	15.0	, tg:	28.0	, r:	30.0	},
        {n:	900	, h:	890	, b:	300	, ts:	16.0	, tg:	30.0	, r:	30.0	},
        {n:	1000	, h:	990	, b:	300	, ts:	16.5	, tg:	31.0	, r:	30.0	},
	],
	
    HEB_dimensions_table:
	[
        {n:	100	, h:	100	, b:	100	, ts:	6.0	, tg:	10.0	, r:	12.0	},
        {n:	120	, h:	120	, b:	120	, ts:	6.5	, tg:	11.0	, r:	12.0	},
        {n:	140	, h:	140	, b:	140	, ts:	7.0	, tg:	12.0	, r:	12.0	},
        {n:	160	, h:	160	, b:	160	, ts:	8.0	, tg:	13.0	, r:	15.0	},
        {n:	180	, h:	180	, b:	180	, ts:	8.5	, tg:	14.0	, r:	15.0	},
        {n:	200	, h:	200	, b:	200	, ts:	9.0	, tg:	15.0	, r:	18.0	},
        {n:	220	, h:	220	, b:	220	, ts:	9.5	, tg:	16.0	, r:	18.0	},
        {n:	240	, h:	240	, b:	240	, ts:	10.0	, tg:	17.0	, r:	21.0	},
        {n:	260	, h:	260	, b:	260	, ts:	10.0	, tg:	17.5	, r:	24.0	},
        {n:	280	, h:	280	, b:	280	, ts:	10.5	, tg:	18.0	, r:	24.0	},
        {n:	300	, h:	300	, b:	300	, ts:	11.0	, tg:	19.0	, r:	27.0	},
        {n:	320	, h:	320	, b:	300	, ts:	11.5	, tg:	20.5	, r:	27.0	},
        {n:	340	, h:	340	, b:	300	, ts:	12.0	, tg:	21.5	, r:	27.0	},
        {n:	360	, h:	360	, b:	300	, ts:	12.5	, tg:	22.5	, r:	27.0	},
        {n:	400	, h:	400	, b:	300	, ts:	13.5	, tg:	24.0	, r:	27.0	},
        {n:	450	, h:	450	, b:	300	, ts:	14.0	, tg:	26.0	, r:	27.0	},
        {n:	500	, h:	500	, b:	300	, ts:	14.5	, tg:	28.0	, r:	27.0	},
        {n:	550	, h:	550	, b:	300	, ts:	15.0	, tg:	29.0	, r:	27.0	},
        {n:	600	, h:	600	, b:	300	, ts:	15.5	, tg:	30.0	, r:	27.0	},
        {n:	650	, h:	650	, b:	300	, ts:	16.0	, tg:	31.0	, r:	27.0	},
        {n:	700	, h:	700	, b:	300	, ts:	17.0	, tg:	32.0	, r:	27.0	},
        {n:	800	, h:	800	, b:	300	, ts:	17.5	, tg:	33.0	, r:	30.0	},
        {n:	900	, h:	900	, b:	300	, ts:	18.5	, tg:	35.0	, r:	30.0	},
        {n:	1000	, h:	1000	, b:	300	, ts:	19.0	, tg:	36.0	, r:	30.0	}
    ],
    
    HEM_dimensions_table:
	[
        {n:	100	, h:	120	, b:	106	, ts:	12.0	, tg:	20.0	, r:	12.0	},
        {n:	120	, h:	140	, b:	126	, ts:	12.5	, tg:	21.0	, r:	12.0	},
        {n:	140	, h:	160	, b:	146	, ts:	13.0	, tg:	22.0	, r:	12.0	},
        {n:	160	, h:	180	, b:	166	, ts:	14.0	, tg:	23.0	, r:	15.0	},
        {n:	180	, h:	200	, b:	186	, ts:	14.5	, tg:	24.0	, r:	15.0	},
        {n:	200	, h:	220	, b:	206	, ts:	15.0	, tg:	25.0	, r:	18.0	},
        {n:	220	, h:	240	, b:	226	, ts:	15.5	, tg:	26.0	, r:	18.0	},
        {n:	240	, h:	270	, b:	248	, ts:	18.0	, tg:	32.0	, r:	21.0	},
        {n:	260	, h:	290	, b:	268	, ts:	18.0	, tg:	32.5	, r:	24.0	},
        {n:	280	, h:	310	, b:	288	, ts:	18.5	, tg:	33.0	, r:	24.0	},
        {n:	300	, h:	340	, b:	310	, ts:	21.0	, tg:	39.0	, r:	27.0	},
        {n:	320	, h:	359	, b:	309	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	340	, h:	377	, b:	309	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	360	, h:	395	, b:	308	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	400	, h:	432	, b:	307	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	450	, h:	478	, b:	307	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	500	, h:	524	, b:	306	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	550	, h:	572	, b:	306	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	600	, h:	620	, b:	305	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	650	, h:	668	, b:	305	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	700	, h:	716	, b:	304	, ts:	21.0	, tg:	40.0	, r:	27.0	},
        {n:	800	, h:	814	, b:	303	, ts:	21.0	, tg:	40.0	, r:	30.0	},
        {n:	900	, h:	910	, b:	302	, ts:	21.0	, tg:	40.0	, r:	30.0	},
        {n:	1000	, h:	1008	, b:	302	, ts:	21.0	, tg:	40.0	, r:	30.0	}
	],
    
	UNP_dimensions_table:
	[
        {n:	"30x15"	, h:	30.00	, b:	15.00	, ts:	4.00	, tg:	4.50	, r1:	4.50	, r2:	2.00	},
        {n:	"30"	, h:	30.00	, b:	33.00	, ts:	5.00	, tg:	7.00	, r1:	7.00	, r2:	3.50	},
        {n:	"40"	, h:	40.00	, b:	35.00	, ts:	5.00	, tg:	7.00	, r1:	7.00	, r2:	3.50	},
        {n:	"40x20"	, h:	40.00	, b:	20.00	, ts:	5.00	, tg:	5.50	, r1:	5.00	, r2:	2.50	},
        {n:	"50"	, h:	50.00	, b:	38.00	, ts:	5.00	, tg:	7.00	, r1:	7.00	, r2:	3.50	},
        {n:	"50x25"	, h:	50.00	, b:	25.00	, ts:	5.00	, tg:	6.00	, r1:	6.00	, r2:	3.00	},
        {n:	"60"	, h:	60.00	, b:	30.00	, ts:	6.00	, tg:	6.00	, r1:	6.00	, r2:	3.00	},
        {n:	"65"	, h:	65.00	, b:	42.00	, ts:	5.50	, tg:	7.50	, r1:	7.50	, r2:	4.00	},
        {n:	"80"	, h:	80.00	, b:	45.00	, ts:	6.00	, tg:	8.00	, r1:	8.00	, r2:	4.00	},
        {n:	"100"	, h:	100.00	, b:	50.00	, ts:	6.00	, tg:	8.50	, r1:	8.50	, r2:	4.50	},
        {n:	"120"	, h:	120.00	, b:	55.00	, ts:	7.00	, tg:	9.00	, r1:	9.00	, r2:	4.50	},
        {n:	"140"	, h:	140.00	, b:	60.00	, ts:	7.00	, tg:	10.00	, r1:	10.00	, r2:	5.00	},
        {n:	"160"	, h:	160.00	, b:	65.00	, ts:	7.50	, tg:	10.50	, r1:	10.50	, r2:	5.50	},
        {n:	"180"	, h:	180.00	, b:	70.00	, ts:	8.00	, tg:	11.00	, r1:	11.00	, r2:	5.50	},
        {n:	"200"	, h:	200.00	, b:	75.00	, ts:	8.50	, tg:	11.50	, r1:	11.50	, r2:	6.00	},
        {n:	"220"	, h:	220.00	, b:	80.00	, ts:	9.00	, tg:	12.50	, r1:	12.50	, r2:	6.50	},
        {n:	"240"	, h:	240.00	, b:	85.00	, ts:	9.50	, tg:	13.00	, r1:	13.00	, r2:	6.50	},
        {n:	"260"	, h:	260.00	, b:	90.00	, ts:	10.00	, tg:	14.00	, r1:	14.00	, r2:	7.00	},
        {n:	"280"	, h:	280.00	, b:	95.00	, ts:	10.00	, tg:	15.00	, r1:	15.00	, r2:	7.50	},
        {n:	"300"	, h:	300.00	, b:	100.00	, ts:	10.00	, tg:	16.00	, r1:	16.00	, r2:	8.00	},
        {n:	"320"	, h:	320.00	, b:	100.00	, ts:	14.00	, tg:	17.50	, r1:	17.50	, r2:	8.80	},
        {n:	"350"	, h:	350.00	, b:	100.00	, ts:	14.00	, tg:	16.00	, r1:	16.00	, r2:	8.00	},
        {n:	"380"	, h:	380.00	, b:	102.00	, ts:	13.50	, tg:	16.00	, r1:	16.00	, r2:	8.00	},
        {n:	"400"	, h:	400.00	, b:	110.00	, ts:	14.00	, tg:	18.00	, r1:	18.00	, r2:	9.00	}
	],
    
    L_dimensions_table:
    [
        {n:	"20x20x3"	, a:	20	, b:	20	, t:	3	, r1:	3.5	},
        {n:	"25x25x3"	, a:	25	, b:	25	, t:	3	, r1:	3.5	},
        {n:	"25x25x4"	, a:	25	, b:	25	, t:	4	, r1:	3.5	},
        {n:	"30x30x3"	, a:	30	, b:	30	, t:	3	, r1:	5	},
        {n:	"30x30x4"	, a:	30	, b:	30	, t:	4	, r1:	5	},
        {n:	"35x35x4"	, a:	35	, b:	35	, t:	4	, r1:	5	},
        {n:	"40x40x4"	, a:	40	, b:	40	, t:	4	, r1:	6	},
        {n:	"40x40x5"	, a:	40	, b:	40	, t:	5	, r1:	6	},
        {n:	"45x45x4,5"	, a:	45	, b:	45	, t:	4.5	, r1:	7	},
        {n:	"50x50x4"	, a:	50	, b:	50	, t:	4	, r1:	7	},
        {n:	"50x50x5"	, a:	50	, b:	50	, t:	5	, r1:	7	},
        {n:	"50x50x6"	, a:	50	, b:	50	, t:	6	, r1:	7	},
        {n:	"60x60x5"	, a:	60	, b:	60	, t:	5	, r1:	8	},
        {n:	"60x60x6"	, a:	60	, b:	60	, t:	6	, r1:	8	},
        {n:	"60x60x8"	, a:	60	, b:	60	, t:	8	, r1:	8	},
        {n:	"65x65x7"	, a:	65	, b:	65	, t:	7	, r1:	9	},
        {n:	"70x70x6"	, a:	70	, b:	70	, t:	6	, r1:	9	},
        {n:	"70x70x7"	, a:	70	, b:	70	, t:	7	, r1:	9	},
        {n:	"75x75x6"	, a:	75	, b:	75	, t:	6	, r1:	9	},
        {n:	"75x75x8"	, a:	75	, b:	75	, t:	8	, r1:	9	},
        {n:	"80x80x8"	, a:	80	, b:	80	, t:	8	, r1:	10	},
        {n:	"80x80x10"	, a:	80	, b:	80	, t:	10	, r1:	10	},
        {n:	"90x90x7"	, a:	90	, b:	90	, t:	7	, r1:	11	},
        {n:	"90x90x8"	, a:	90	, b:	90	, t:	8	, r1:	11	},
        {n:	"90x90x9"	, a:	90	, b:	90	, t:	9	, r1:	11	},
        {n:	"90x90x10"	, a:	90	, b:	90	, t:	10	, r1:	11	},
        {n:	"100x100x8"	, a:	100	, b:	100	, t:	8	, r1:	12	},
        {n:	"100x100x10"	, a:	100	, b:	100	, t:	10	, r1:	12	},
        {n:	"100x100x12"	, a:	100	, b:	100	, t:	12	, r1:	12	},
        {n:	"120x100x10"	, a:	120	, b:	120	, t:	10	, r1:	13	},
        {n:	"120x120x12"	, a:	120	, b:	120	, t:	12	, r1:	13	},
        {n:	"130x130x12"	, a:	130	, b:	130	, t:	12	, r1:	14	},
        {n:	"150x150x10"	, a:	150	, b:	150	, t:	10	, r1:	16	},
        {n:	"150x150x12"	, a:	150	, b:	150	, t:	12	, r1:	16	},
        {n:	"150x150x15"	, a:	150	, b:	150	, t:	15	, r1:	16	},
        {n:	"160x160x15"	, a:	160	, b:	160	, t:	15	, r1:	17	},
        {n:	"180x180x16"	, a:	180	, b:	180	, t:	16	, r1:	18	},
        {n:	"180x180x18"	, a:	180	, b:	180	, t:	18	, r1:	18	},
        {n:	"200x200x16"	, a:	200	, b:	200	, t:	16	, r1:	18	},
        {n:	"200x200x18"	, a:	200	, b:	200	, t:	18	, r1:	18	},
        {n:	"200x200x20"	, a:	200	, b:	200	, t:	20	, r1:	18	},
        {n:	"200x200x24"	, a:	200	, b:	200	, t:	24	, r1:	18	},
        {n:	"250x250x28"	, a:	250	, b:	250	, t:	28	, r1:	18	},
        {n:	"250x250x35"	, a:	250	, b:	250	, t:	35	, r1:	18	},
        {n:	"40x20x4"	, a:	40	, b:	20	, t:	4	, r1:	4	},
        {n:	"40x25x4"	, a:	40	, b:	25	, t:	4	, r1:	4	},
        {n:	"45x30x4"	, a:	45	, b:	30	, t:	4	, r1:	4.5	},
        {n:	"50x30x5"	, a:	50	, b:	30	, t:	5	, r1:	5	},
        {n:	"60x30x5"	, a:	60	, b:	30	, t:	5	, r1:	5	},
        {n:	"60x40x5"	, a:	60	, b:	40	, t:	5	, r1:	6	},
        {n:	"60x40x6"	, a:	60	, b:	40	, t:	6	, r1:	6	},
        {n:	"65x50x5"	, a:	65	, b:	50	, t:	5	, r1:	6	},
        {n:	"70x50x6"	, a:	70	, b:	50	, t:	6	, r1:	7	},
        {n:	"75x50x6"	, a:	75	, b:	50	, t:	6	, r1:	7	},
        {n:	"75x50x8"	, a:	75	, b:	50	, t:	8	, r1:	7	},
        {n:	"80x40x6"	, a:	80	, b:	40	, t:	6	, r1:	7	},
        {n:	"80x40x8"	, a:	80	, b:	40	, t:	8	, r1:	7	},
        {n:	"80x60x7"	, a:	80	, b:	60	, t:	7	, r1:	8	},
        {n:	"100x50x6"	, a:	100	, b:	50	, t:	6	, r1:	8	},
        {n:	"100x50x8"	, a:	100	, b:	50	, t:	8	, r1:	8	},
        {n:	"100x65x7"	, a:	100	, b:	65	, t:	7	, r1:	10	},
        {n:	"100x65x8"	, a:	100	, b:	65	, t:	8	, r1:	10	},
        {n:	"100x65x10"	, a:	100	, b:	65	, t:	10	, r1:	10	},
        {n:	"100x75x8"	, a:	100	, b:	75	, t:	8	, r1:	10	},
        {n:	"100x75x10"	, a:	100	, b:	75	, t:	10	, r1:	10	},
        {n:	"100x75x12"	, a:	100	, b:	75	, t:	12	, r1:	10	},
        {n:	"120x80x8"	, a:	120	, b:	80	, t:	8	, r1:	11	},
        {n:	"120x80x10"	, a:	120	, b:	80	, t:	10	, r1:	11	},
        {n:	"120x80x12"	, a:	120	, b:	80	, t:	12	, r1:	11	},
        {n:	"125x75x8"	, a:	125	, b:	75	, t:	8	, r1:	11	},
        {n:	"125x75x10"	, a:	125	, b:	75	, t:	10	, r1:	11	},
        {n:	"125x75x12"	, a:	125	, b:	75	, t:	12	, r1:	11	},
        {n:	"135x65x8"	, a:	135	, b:	65	, t:	8	, r1:	11	},
        {n:	"135x65x10"	, a:	135	, b:	65	, t:	10	, r1:	11	},
        {n:	"150x75x9"	, a:	150	, b:	75	, t:	9	, r1:	12	},
        {n:	"150x75x10"	, a:	150	, b:	75	, t:	10	, r1:	12	},
        {n:	"150x75x12"	, a:	150	, b:	75	, t:	12	, r1:	12	},
        {n:	"150x75x15"	, a:	150	, b:	75	, t:	15	, r1:	12	},
        {n:	"150x90x10"	, a:	150	, b:	90	, t:	10	, r1:	12	},
        {n:	"150x90x12"	, a:	150	, b:	90	, t:	12	, r1:	12	},
        {n:	"150x90x15"	, a:	150	, b:	90	, t:	15	, r1:	12	},
        {n:	"150x100x10"	, a:	150	, b:	100	, t:	10	, r1:	12	},
        {n:	"150x100x12"	, a:	150	, b:	100	, t:	12	, r1:	12	},
        {n:	"200x100x10"	, a:	200	, b:	100	, t:	10	, r1:	15	},
        {n:	"200x100x12"	, a:	200	, b:	100	, t:	12	, r1:	15	},
        {n:	"200x100x15"	, a:	200	, b:	100	, t:	15	, r1:	15	},
        {n:	"200x150x12"	, a:	200	, b:	150	, t:	12	, r1:	15	},
        {n:	"200x150x15"	, a:	200	, b:	150	, t:	15	, r1:	15	}
    ],
    
    T_dimensions_table:
    [
        {n:	"30"	, h:	30	, b:	30	, s:	4.0	, r1:	4.0	, r2:	2.0	, r3:	1.0	},
        {n:	"35"	, h:	35	, b:	35	, s:	4.5	, r1:	4.5	, r2:	2.3	, r3:	1.0	},
        {n:	"40"	, h:	40	, b:	40	, s:	5.0	, r1:	5.0	, r2:	2.5	, r3:	1.0	},
        {n:	"50"	, h:	50	, b:	50	, s:	6.0	, r1:	6.0	, r2:	3.0	, r3:	1.5	},
        {n:	"60"	, h:	60	, b:	60	, s:	7.0	, r1:	7.0	, r2:	3.5	, r3:	2.0	},
        {n:	"70"	, h:	70	, b:	70	, s:	8.0	, r1:	8.0	, r2:	4.0	, r3:	2.0	},
        {n:	"80"	, h:	80	, b:	80	, s:	9.0	, r1:	9.0	, r2:	4.5	, r3:	2.0	},
        {n:	"100"	, h:	100	, b:	100	, s:	11.0	, r1:	11.0	, r2:	5.5	, r3:	3.0	},
        {n:	"120"	, h:	120	, b:	120	, s:	13.0	, r1:	13.0	, r2:	6.5	, r3:	3.0	},
        {n:	"140"	, h:	140	, b:	140	, s:	15.0	, r1:	15.0	, r2:	7.5	, r3:	4.0	}
    ],
    
    Z_dimensions_table:
    [
        {n:	"30"	, h:	30	, b:	38	, s:	4.0	, t:	4.5	, r2:	2.5	},
        {n:	"40"	, h:	40	, b:	40	, s:	4.5	, t:	5.0	, r2:	2.5	},
        {n:	"50"	, h:	50	, b:	43	, s:	5.0	, t:	5.5	, r2:	3.0	},
        {n:	"60"	, h:	60	, b:	45	, s:	5.0	, t:	6.0	, r2:	3.0	},
        {n:	"80"	, h:	80	, b:	50	, s:	6.0	, t:	7.0	, r2:	3.5	},
        {n:	"100"	, h:	100	, b:	55	, s:	6.5	, t:	8.0	, r2:	4.0	},
        {n:	"120"	, h:	120	, b:	60	, s:	7.0	, t:	9.0	, r2:	4.5	},
        {n:	"140"	, h:	140	, b:	65	, s:	8.0	, t:	10.0	, r2:	5.0	},
        {n:	"160"	, h:	160	, b:	70	, s:	8.5	, t:	11.0	, r2:	5.5	}
    ]
};
