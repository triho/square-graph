var CANVAS_HEIGHT = 600;
var CANVAS_WIDTH = 600;

var STROKE_OFFSET = 1.5;
var GRAPH_HEIGHT = 400 + STROKE_OFFSET;
var GRAPH_WIDTH = 400 + STROKE_OFFSET;
var CELL = 10;
var canvasArea = GRAPH_HEIGHT * GRAPH_WIDTH;

var canvas = new Object();
var context;

$(document).ready(function(){
    canvas = document.getElementById("graph");
    // Set up the template
    $.template("share-input",$("#share").html());
    var shareTitleArray = [];
    var shareValueArray = [];
    canvasSetUp();

    var apple=0.5, microsoft=0.3, google=0.2;
//                var topLeft = [0, 0];
//                var bottomRight = [GRAPH_WIDTH, GRAPH_HEIGHT];
//                var shares = [apple, microsoft, google];
//                var shares = [apple];
//                var shares = [0.3, 0.4, 0.1, 0.05, 0.15];
//                var shares = [0.2, 0.4, 0.1, 0.15, 0.15];
//                drawShare(shares, topLeft,"vertical");

    /**
     * Handle button create inputs for share
     * */
    $("#generate-inputs").click(function(){
        var numberOfInputs = $("#number-of-shares").val();
        if (!isNaN(numberOfInputs)){
            var averageValueForEachInput = 1/numberOfInputs;
            averageValueForEachInput = Math.round(averageValueForEachInput*100)/100;
            
            for (var index=0; index<numberOfInputs; index++){
                $("#shares").append($.tmpl("share-input", {"value":averageValueForEachInput}));
            }
            
            $("#shares").append($("#controller-tmpl").html())
            
        }
    });
    
    
    $("#draw").live("click", function(){
        $("#shares .share-title").each(function(){
            var shareTitle = $(this).val();
            if (shareTitle == ""){
                shareTitleArray = [];
                alert("Share title is empty");
                $(this).focus();
                return;
            }
            else{
                shareTitleArray = shareTitleArray.concat([shareTitle]);
            }
        });
        
        $("#shares .share-value").each(function(){
           var shareValue = $(this).val();
           if (shareValue == 0){
               shareValueArray = [];
               shareTitleArray = [];
               alert("Share value array is empty");
               $(this).focus();
               return;
           }
           else{
               shareValueArray = shareValueArray.concat([shareValue]);
           }
        });
        
        
        var topLeft = [0, 0];
        drawShare(shareValueArray, topLeft, "vertical");
        
    })
    
    
    
});

function canvasSetUp()
{
    // Set the default width and height of the canvas
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    context = canvas.getContext("2d");

    // context.fillRect(50, 25, 150, 100);
    // Draw a grid
    context.beginPath();
    for (var x=0.5; x<=GRAPH_WIDTH; x+=CELL){
        context.moveTo(x, 0);
        context.lineTo(x, GRAPH_HEIGHT);
    }

    for (var y=0.5; y<=GRAPH_HEIGHT; y+=CELL){
        context.moveTo(0, y);
        context.lineTo(GRAPH_WIDTH, y);
    }

    context.strokeStyle = "#eee";
    context.stroke();

    // Draw the arrows
    context.beginPath();
    context.moveTo(0, GRAPH_HEIGHT-0.5);
    context.lineTo(GRAPH_WIDTH, GRAPH_HEIGHT-0.5);

    context.moveTo(0.5, 0);
    context.lineTo(0.5, GRAPH_HEIGHT);
    context.strokeStyle = "#000";
    context.stroke();
}

/**
 * Draw the rectangle which represents the share on the canvase
 * @params array of shares of company, the top left coordinate and bottom right coordinate
 * @return the rectangles are drawn on the canvas
 */
function drawShare(arrayOfShares, topLeft, drawStyle){
    if (arrayOfShares.length == 0 || arrayOfShares == undefined){
        return;
    }
    else{
        // Initialize the variables
        var share = 0, height = 0, width = 0, color = "#000";
        // Get the drawing area
        var widthRemainder = GRAPH_WIDTH-topLeft[0];
        var heightRemainder = GRAPH_HEIGHT-topLeft[1];

        console.log("Drawing rectangle: "+arrayOfShares[0]);

        share = arrayOfShares[0];

        var areaOfRectangleInRemainder = share * canvasArea;
//                    console.log("Inside remainder: "+areaOfRectangleInRemainder);

        if (drawStyle == "vertical"){
            height = heightRemainder;
            width = areaOfRectangleInRemainder / height;
        }
        else if (drawStyle == "horizontal"){
            width = widthRemainder;
            height = areaOfRectangleInRemainder / width;
        }

        color = random_color("hex");

        // Rounding up the width and height of the canvas
        var width = Math.round(width)+0.5;
        var height = Math.round(height)+0.5;
        console.log("Width: "+width+" height: "+height);

        // Start drawing
        context.beginPath();
        context.fillStyle = color;
        console.log("left: "+topLeft[0]+" top: "+topLeft[1]);
        context.fillRect(topLeft[0], topLeft[1], width, height);

        if (drawStyle == "vertical"){
            topLeft[0] += width - 0.5;
            drawStyle = "horizontal";
        }
        else if (drawStyle == "horizontal"){
            topLeft[1] += height-0.5;
            drawStyle = "vertical";
        }                   

        arrayOfShares.splice(0, 1);
        // Recursive call
        drawShare(arrayOfShares, topLeft, drawStyle);
    }
}

// @format (hex|rgb|null) : Format to return, default is integer
// Author: http://www.develobert.info/2008/06/random-color-generation-with-javascript.html
function random_color(format)
{
    var rint = Math.round(0xffffff * Math.random()).toString(16);
    switch(format)
    {
        case 'hex':
            return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
            break;

        case 'rgb':
            return 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')';
            break;

        default:
            return rint;
            break;
    }
}


