        //Creating canvas and initial variables
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        var cw = c.width = 500;
        var ch = c.height = 500;
        var spheres = [];
        var minSpeed = 1.15;
        var maxSpeed = 10;
        var friction = .997;
        var PI2 = Math.PI*2;
        var sphereCount = 55;
        //random function
        var rand = function(a, b) {
            return (Math.random())*b+a
        }
        //magnet
        var mX = c.width/2;
        var mY = c.height/2;
        var mRadius = 120;
        var magnetCore = false;
        var attract = true;
        var gravityRange = 1;
        //Variable that affects the strength of the magnet, but its inverse. .1 is strong, 100 is weak. Not sure how to incorporate it yet as it can also cause the bubbles to mess up
        var temp = 10;
        
        var customMeasurements = true;
        //bubbles
        
        //Randomized initial variables
        var Bubble = function() {
            this.velocityX = (rand(0,1000)-500)/200;
            this.velocityY = (rand(0,1000)-500)/200;
            this.x = rand(0, c.width);
            this.y = rand(0, c.height);
            this.radius = rand(4, 20);
            this.magnet = false;
        }
        
        var element = $('body');
        //adding function to bubble
        Bubble.prototype = {
            update: function(i) {
                //Check to see if its in the magnet
                //get the distance between the magnet and the sphere, then check the radiuses. If they intersect, then we have a pull or push
                var dX = mX - this.x;
                var dY = mY - this.y;
                var dist = Math.sqrt(dX * dX + dY * dY);
                var gravityTemp = gravityRange;
                if (dist < mRadius*gravityTemp) {
                    //sets up the temp value to pull or push
                    if (!attract) { 
                        temp = Math.abs(temp)*-1;
                    } else {
                        temp = Math.abs(temp);
                    }
                    //Changes the velocity of the bubbles/spheres to move towards the center of the magnet
                    this.velocityX += (dX)/(temp*this.radius);
                    this.velocityY += (dY)/(temp*this.radius);
                    //This freezes them
                    //this.velocityX *= friction/dist;
                    //this.velocityY *= friction/dist;
                    this.magnet = true;
                }
                else {
                    //Otherwise they arent in the magnet
                    this.magnet = false;
                }
                
                //Making sure the sphere is moving above min speed. If it is being pulled into the magnet core, increase the amount of friction.
                //Since friction is a decimal, we subtract a decimal to make it smaller, which when multiplied will further decrease the velocity.
                if (Math.abs(this.velocityX) > minSpeed) {
                    if (this.magnet) {
                        if (magnetCore) {
                            this.velocityX *= friction-dist/((mRadius+10)*temp); 
                        }
                        else {
                            this.velocityX *= friction;
                        }
                    } else {
                        this.velocityX *= friction;
                    }
                    
                }
                //Same thing for the Y.
                if (Math.abs(this.velocityY) > minSpeed) {
                    if (this.magnet) {
                        if (magnetCore) {
                            this.velocityY *= friction-dist/((mRadius+10)*temp); 
                        }
                        else {
                            this.velocityY *= friction;
                        }
                    } else {
                        this.velocityY *= friction;
                    }
                    
                    
                }
                //If the sphere is moving too fast, slow it down, apply friction, and then make sure that the variable is going in the correct direction (negative or positive).
                if (Math.abs(this.velocityX) > maxSpeed) {
                        this.velocityX = maxSpeed*friction*(Math.abs(this.velocityX)/this.velocityX); 
                }
                if (Math.abs(this.velocityY) > maxSpeed) {
                        this.velocityY = maxSpeed*friction*(Math.abs(this.velocityY)/this.velocityY); 
                }
                
                //Apply the velocity to the X and Y.
                this.x += this.velocityX;
                this.y += this.velocityY;
                
                //check if its off screen
                //Friction calculating against because when it hits the wall, some energy should be losed.
                if (this.x + this.radius > c.width) {
                    this.x = c.width - this.radius;
                    this.velocityX *= -1;
                    this.velocityX *= friction;
                }
                if (this.y + this.radius > c.height) {
                    this.y = c.height - this.radius;
                    this.velocityY *= -1;
                    this.velocityY *= friction; 
                }
                if (this.x - this.radius < 0) {
                    this.x = 0 + this.radius;
                    this.velocityX *= -1;
                    this.velocityX *= friction;
                }
                if (this.y - this.radius < 0) {
                    this.y = 0 + this.radius;
                    this.velocityY *= -1;
                    this.velocityY *= friction; 
                }
            }
        }
        
        //Resizes canvas on resize.
        var resize = function() {
            if (customMeasurements) {
                cw = c.width = $(element).width();
                ch = c.height = $(element).height();
            }
            else {
                cw = c.width = $(document).innerWidth();
                ch = c.height = $(document).innerHeight();
            }
            
        }
        //Renders the magnet on mousemove and load.
        var renderMagnet = function() {
            ctx.beginPath();
            ctx.arc(mX, mY, mRadius, 0, PI2, false);
            ctx.fillStyle = 'rgb(49, 193, 212)';
            ctx.fill(); 
            ctx.stroke();
        }
        //Moving the magnet based on mouse positions
        var mouseMove = function(e) {
            mX = e.pageX;
            mY = e.pageY;
        }
        //Mouse attract or pull
        var mouseClick = function() {
            attract = !attract;
        }
        //Clears the screen, clears the spheres, reset the magnet to attract, and then recreates all the bubbles.
        var clear = function() {
            ctx.clearRect(0, 0, c.width, c.height);
            spheres = [];
            attract = true;
            for(var i = 0; i < sphereCount; i++){
              spheres.push(new Bubble());    
            }
        }
        //Resizes the screen, renders the magnet, then renders the bubbles.
        var regen = function() {
            resize();
            renderMagnet();
            for (var i = 0; i < spheres.length; i++) {
                ctx.beginPath();
                ctx.arc(spheres[i].x, spheres[i].y, spheres[i].radius, 0, PI2, false);
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fill();
                ctx.stroke();
            }
        }
        //When the mouse moves, do mouseMove. Same with click. Then when any of the values in the section are changed, update the application accordingly.
        
        $(window).on('click', mouseClick);

        //60 FPS updating. Checks if the magnet core is checked or not. 
        setInterval(function() {
           if ($('#magnetCore').is(":checked")) {
                magnetCore = true;
               $('#magnetCoreDisplay').text("On");
           }
            else {
                magnetCore = false;
                $('#magnetCoreDisplay').text("Off");
            }
            //Clears the view
           ctx.clearRect(0, 0, c.width, c.height);
            //Update all the sphere's positions
            for(var i = 0; i < sphereCount; i++){
              spheres[i].update(i);       
            }
            //Rebuild the screen.
           regen();
            
        }, 1000/60);
        
        $(window).on('mousemove', function(e) {
                        mX = e.pageX-$(element).offset().left;
                        mY = e.pageY-$(element).offset().top;
            });

        //Clears the screen, regenerates all the information, then applies the canvas on load.
        var startBubbling = function(ele, boxBool) {
            element = ele;
            cw = c.width = $(ele).width()
            ch = c.height =  $(ele).height();
            customMeasurements = true;
            clear();
            regen();
            $(ele).append(c);
            
            //this is the html code for magnet controls. 
            var html = '<section class="magnetControls">Magnet Controls<br />'+
            '<label>Magnet Radius: <span id="magnetRadiusDisplay">120</span></label>'+
            '<br />'+
            '<input type="range" min="30" max="200" id="magnetRadius" value="120" />'+
            '<br />'+
            '<label>Min Speed: <span id="minSpeedDisplay">1.15</span></label>'+
            '<br />'+
            '<input type="range" min=".15" max="5" id="minSpeed" value="1.15" />'+
            '<br />'+
            '<label>'+
            '    Max Speed: <span id="maxSpeedDisplay">15</span></label>'+
            '<br />'+
            '<input type="range" min="5" max="20" id="maxSpeed" value="15" />'+
            '<br />'+
            '<label>'+
            '    Num Spheres: <span id="numSpheresDisplay">75</span></label>'+
            '<br />'+
            '<input type="range" min="5" max="220" id="numSpheres" value="75" />'+
            '<br />'+
            '<label>'+
            'Magnet Core: <span id="magnetCoreDisplay">Off</span></label><input type="checkbox" id="magnetCore" />'+
            '</section>';
            //if the user wants to include them, then the following code goes of.
            if (boxBool) {
                //Append the html
                $('body').append(html);
                //Status changes, these react to the changes of the controls.
                $('#magnetRadius').on('change', function() {
                mRadius = $(this).val();
                $('#magnetRadiusDisplay').text($(this).val());
                });
                $('#minSpeed').on('change', function() {
                    minSpeed = $(this).val();
                    $('#minSpeedDisplay').text($(this).val());
                });
                $('#maxSpeed').on('change', function() {
                    maxSpeed = $(this).val();
                    $('#maxSpeedDisplay').text($(this).val());
                });
                $('#numSpheres').on('change', function() {
                    sphereCount = $(this).val();
                    clear();
                    $('#numSpheresDisplay').text($(this).val());
                });
            }
            else {
                //otherwise, remove the controls if they exist.
                $('.magnetControls').remove();
            }
            //Set the cnavas border radius to the border radius of the element, incase there is one. 
            $('canvas').css('border-radius', $(ele).css('border-radius'));
        }
        
        //document.body.appendChild(c);
        