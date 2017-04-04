
var canvas;
var gl;
var display;

var NumVertices  = 36;

var points = [];
var solidcolors = [];
var shadedcolors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var modelview;  

var axis = 0;
var theta = [ 0, 0, 0 ];
var matriceModelisation; 

var thetaLoc;
var vColorLoc;
var matricemodelisationLoc;
var color=0;
var prevx, prevy;
var dragging = false;
var anglex = 0;
var angley = 0;

function doMouseDown(evt) {
    if (dragging)
        return;
    dragging = true;
    document.addEventListener("mousemove", doMouseDrag, false);
    document.addEventListener("mouseup", doMouseUp, false);
    var box = canvas.getBoundingClientRect();
    prevx = evt.clientX - box.left;
    prevy = canvas.height - (evt.clientY - box.top);
}
function doMouseDrag(evt) {
    if (!dragging)
        return;
    var box = canvas.getBoundingClientRect();
    var x = evt.clientX - box.left;
    var y = canvas.height - (evt.clientY - box.top);

    anglex += x - prevx;
    angley += y - prevy;

    display.innerHTML = "<div> anglex = " + anglex + " ***** angley = " + angley +" </div>";

    prevx = x;
    prevy = y;
    
    render();
    
}
function doMouseUp(evt) {
    if (dragging) {
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
        dragging = false;
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    display = document.getElementById("display");

    canvas.addEventListener("mousedown", doMouseDown, false);


    colorCube(color);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var solidcolorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);

    vColorLoc = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorLoc );


    var shadedcolorsBuffer = gl.createBuffer();


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

	matriceModelisationLoc = gl.getUniformLocation(program, "matriceModelisation");	
    
    //event listeners for buttons
    
    document.getElementById("ShadedButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, shadedcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shadedcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };
    document.getElementById("SolidButton").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };
	    document.getElementById("SphereEmceinte").onclick = function () {
    modelview = initialmodelview;
    normalMatrix = extractNormalMatrix(modelview);  // always extract the normal matrix before scaling
    modelview = mult(modelview, scale(0.2, 0.2, 1.2));
    sphere.render()
        render();
    };
    document.getElementById("squareenceinte").onclick = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, solidcolorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(solidcolors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColorLoc);
        render();
    };
	    document.getElementById("couleur").onclick = function () {
		if(color+1>7)
		{
			color=0;
			colorCube(color);
			
		}
		else
		{
			colorCube(color+1);
			color++;
		
			}
	
        render();
    };

    render();
}

function colorCube( a)
{
	// bon
	 quad(0,2, 6, 4,a);
	quad( 3, 1, 5, 7,a );
    quad( 0, 1, 3, 2,a );
	quad( 5, 4, 6, 7,a );
	quad( 0, 1, 5, 4,a );
    quad( 3, 2, 6, 7,a );
  
    
   
}

function quad(a, b, c, d,e) 
{
    var vertices = [
        vec3( -0.5, 0.75, 0.5 ),
        vec3( -0.5,-0.75, 0.5 ),
        vec3(  0.5, 0.75,  0.5 ),
        vec3(  0.5, -0.75,  0.5 ),
         vec3( -0.5, 0.75, -0.5 ),
        vec3( -0.5,-0.75, -0.5 ),
        vec3(  0.5, 0.75,  -0.5 ),
        vec3(  0.5, -0.75,  -0.5 )      
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.8, 0.8, 0.8, 1.0 ],  // gray
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
            // for solid colored faces use 
            solidcolors.push(vertexColors[e+i]);

            // for shaded colored faces use 
            shadedcolors.push(vertexColors[indices[e+i]]);
    }

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //theta[0] = angley/-2.5;
    //theta[1] = anglex/2.5;

    //gl.uniform3fv(thetaLoc, theta);
	
	operation(0,0,0);
	

	
	

	
	

    

   // requestAnimFrame( render );
}

function operation(tX,tY,tZ)
{
	//ROTATION
	matriceModelisation = mat4();
	
	
	//TRANSLATION

	matriceModelisation = mult(translate( tX, tY, tZ ), matriceModelisation);
	
	//SCALE

	matriceModelisation = mult(rotate( (angley/-2.5), 1,0,0 ), matriceModelisation);
	matriceModelisation = mult(rotate( (anglex/2.5), 0,1,0 ), matriceModelisation);
	matriceModelisation = mult(rotate( (0), 0,0,1 ), matriceModelisation);
	
	
	matriceModelisation = mult(scale( 0.5, 0.5, 0.5 ), matriceModelisation);
	gl.uniformMatrix4fv(matriceModelisationLoc, false, flatten(matriceModelisation));
	gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

	
}



