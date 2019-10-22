var	spriteSpeedScale = 60,
	keyState = 0,
	mul = 1,
	leftPos,
	virtualLeft = 0,
	step = 0,
	busterHeight,
	busterLeft,
	jumpStart,
	jumpTrans,
	forwards,
	isJump = false,
	stopped,
	accel = mul,
	floorHeight = 10,
	groundHeight = '10px',
	val = 0,
	jumpTransInit;

window.onload = function init()
{
	var busterSprite = document.querySelector("#buster");
	busterSprite.style.bottom = '10px';
	busterSprite.style.backgroundPosition = '-60px 0px';
	stop();
}

document.onkeydown = function keydown()
{
	var repeat = event.repeat,
		e;
	if (!repeat)
	{
		if (keyState == 0 || keyState == 1 )
		{
			e = e || window.event;
			if (e.keyCode == '38') {
			   keyState = 1;
			   jump();
			}
			else if (e.keyCode == '40') {
			   keyState = 1;
		   }
			else if (e.keyCode == '37') {
				keyState = 1;
				if (stopped)
				{
					runLeft();
					stopped = false;
				}
			}
			else if (e.keyCode == '39') {
				keyState = 1;
				if (stopped)
				{
					runRight();
					stopped = false;
				}	
			}
		}
	}
}

document.onkeyup = function()
{
	keyState = 0;
	if (forwards)
	{
		runRight();
	}
	stop();
}

function stop()
{
	var busterSprite = document.querySelector("#buster");	
	leftPos = Number(busterSprite.style.left.split('px')[0]);
	if (mul > 1)
	{
		if (isJump)
		{
			if (forwards)
			{
				busterSprite.style.backgroundPosition = '-60px 0px';
				busterSprite.style.left = leftPos + (2 * mul);
			}
			else
			{
				busterSprite.style.backgroundPosition = '-60px 0px';
				busterSprite.style.left = leftPos - (2 * mul);
			}
		}
		else if (forwards)
		{
			switch (step)
			{
				case 0:
					busterSprite.style.backgroundPosition = '-00px 0px';
					step = 1;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 1:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 2;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 2:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 3;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 3:
					busterSprite.style.backgroundPosition = '-60px 0px';
					step = 4;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 4:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 5;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 5:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 0;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
			}
		}
		else
		{
			switch (step)
			{
				case 0:
					busterSprite.style.backgroundPosition = '-00px 0px';
					step = 1;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 1:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 2;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 2:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 3;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 3:
					busterSprite.style.backgroundPosition = '-60px 0px';
					step = 4;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 4:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 5;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 5:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 0;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
			}
		}
		setTimeout(stop, spriteSpeedScale);
	}
	else
	{
		mul = 1;
		stopped = true;
		if (!isJump)
		{
			busterSprite.style.backgroundPosition = '-60px 0px';
		}
	}
	
	checkLeft();
	if (leftPos > 360)
	{
		busterSprite.style.left = leftPos;
	}
	if (leftPos < 40)
	{
		busterSprite.style.left = leftPos;
	}
	if (forwards)
	{
		virtualLeft = virtualLeft + (2*mul)
	}
	else
	{
		virtualLeft = virtualLeft - (2*mul)
	}	
	busterLeft = busterSprite.style.left;
	mul = mul - (mul/5);
	
	var cFunc = document.querySelector('#cFunc');
		cBottom = document.querySelector('#cBottom');
	cBottom.innerHTML = busterHeight;
	cFunc.innerHTML = 'stop';
}
	
function runRight()
{
	var cFunc = document.querySelector('#cFunc'),
		cLeft = document.querySelector('#cLeft');
		
	forwards = true;
	
	if (keyState == 0)
	{
		var busterSprite = document.querySelector("#buster");
		busterSprite.style.backgroundPosition = '-60px 0px';
		return;
	}
	
	var busterSprite = document.querySelector("#buster");
	
	leftPos = Number(busterSprite.style.left.split('px')[0]);
	busterSprite.style.transform = 'scale(1,1)';
	
	if (mul < 2)
	{
		switch (step)
		{
				case 0:
					busterSprite.style.backgroundPosition = '-00px 0px';
					step = 1;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 1:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 2;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 2:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 3;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 3:
					busterSprite.style.backgroundPosition = '-60px 0px';
					step = 4;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 4:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 5;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
				case 5:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 0;
					busterSprite.style.left = leftPos + (2 * mul);
					break;
			}
	}
	else
	{
		switch (step)
		{
			case 0:
				busterSprite.style.backgroundPosition = '-80px 0px';
				step = 1;
				busterSprite.style.left = leftPos + (2 * mul);
				break;
			case 1:
				busterSprite.style.backgroundPosition = '-120px 0px';
				step = 2;
				busterSprite.style.left = leftPos + (2 * mul);
				break;
			case 2:
				busterSprite.style.backgroundPosition = '-140px 0px';
				step = 3;
				busterSprite.style.left = leftPos + (2 * mul);
				break;
			case 3:
				busterSprite.style.backgroundPosition = '-120px 0px';
				step = 0;
				busterSprite.style.left = leftPos + (2 * mul);
				break;
		}
	}
	checkLeft();
	if (leftPos > 360)
	{
		busterSprite.style.left = leftPos;
	}
	virtualLeft = virtualLeft + (2*mul)
	busterLeft = busterSprite.style.left;
	mul = mul + (mul/20);
	if (mul > 8)
	{
		mul = 8;
	}
	setTimeout(runRight, spriteSpeedScale);
	cFunc.innerHTML = 'runRight';
	cLeft.innerHTML = leftPos + 'px';
}

function runLeft()
{
	forwards = false;
	
	if (keyState == 0)
	{
		var busterSprite = document.querySelector("#buster");
		busterSprite.style.backgroundPosition = '-60px 0px';
		return;
	}
	var busterSprite = document.querySelector("#buster");
	leftPos = Number(busterSprite.style.left.split('px')[0]);
	busterSprite.style.transform = 'scale(-1,1)';
	
	if (mul < 2)
	{
		switch (step)
			{
				case 0:
					busterSprite.style.backgroundPosition = '-00px 0px';
					step = 1;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 1:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 2;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 2:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 3;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 3:
					busterSprite.style.backgroundPosition = '-60px 0px';
					step = 4;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 4:
					busterSprite.style.backgroundPosition = '-40px 0px';
					step = 5;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
				case 5:
					busterSprite.style.backgroundPosition = '-20px 0px';
					step = 0;
					busterSprite.style.left = leftPos - (2 * mul);
					break;
			}
	}
	else
	{
		switch (step)
		{
			case 0:
				busterSprite.style.backgroundPosition = '-80px 0px';
				step = 1;
				busterSprite.style.left = leftPos - (2 * mul);
				break;
			case 1:
				busterSprite.style.backgroundPosition = '-120px 0px';
				step = 2;
				busterSprite.style.left = leftPos - (2 * mul);
				break;
			case 2:
				busterSprite.style.backgroundPosition = '-140px 0px';
				step = 3;
				busterSprite.style.left = leftPos - (2 * mul);
				break;
			case 3:
				busterSprite.style.backgroundPosition = '-120px 0px';
				step = 0;
				busterSprite.style.left = leftPos - (2 * mul);
				break;
		}
	}
	if (leftPos > 360)
	{
		leftPos = 360;
	}
	
	checkLeft();
	
	if (leftPos < 40)
	{
		busterSprite.style.left = leftPos;
	}
	virtualLeft = virtualLeft - (2*mul)
	busterLeft = busterSprite.style.left;
	mul = mul + (mul/20);
	if (mul > 8)
	{
		mul = 8;
	}
	setTimeout(runLeft, spriteSpeedScale);
		
	var cFunc = document.querySelector('#cFunc'),
		cLeft = document.querySelector('#cLeft');
		
	cFunc.innerHTML = 'runLeft';
	cLeft.innerHTML = leftPos + 'px';
}

function jump()
{	
	isJump = true;
	var busterSprite = document.querySelector("#buster");
		busterSprite.style.backgroundPosition = '-80px 0px',
		jumpStart = busterSprite.style.bottom,
		jumpTrans = Number(jumpStart.split('px')[0]),
		accel = 1.1,
		jumpTransInit = jumpTrans;
	
	var cFunc = document.querySelector('#cBottom');
	cFunc.innerHTML = busterHeight;
		
	// if (keyState == 0)
	// {
		// 
		// stop();
		// return;
	// }
		
	var cFunc = document.querySelector('#cFunc');
	cFunc.innerHTML = 'jump';
		
	jumpUp();
	function jumpUp()
	{
		if (jumpTrans < jumpTransInit + 40)
		{
			busterSprite.style.bottom = jumpTrans + 'px';
			busterSprite.style.backgroundPosition = '-80px 0px';
			jumpTrans = jumpTrans + (2);
			accel = (accel*1.2);
			busterHeight = busterSprite.style.bottom;
			cBottom.innerHTML = busterHeight;
		}			
		else
		{
			jumpDown();
			busterHeight = busterSprite.style.bottom;
			return;
		}
		setTimeout(jumpUp, accel);
		cFunc.innerHTML = 'jumpUp';
	}
	
	busterSprite.style.backgroundPosition = '-100px 0px';
	accel = 1.1;
	function jumpDown()
	{
		if (jumpTrans > floorHeight)
		{
			busterSprite.style.bottom = jumpTrans + 'px';
			busterSprite.style.backgroundPosition = '-100px 0px';
			jumpTrans = jumpTrans - (1);
			accel = (accel/1.15);
			busterHeight = busterSprite.style.bottom;
			cBottom.innerHTML = busterHeight;
			
		}
		else
		{
			busterSprite.style.backgroundPosition = '-60px 0px';
			busterSprite.style.bottom = jumpTrans + 'px';
			busterHeight = busterSprite.style.bottom;			
			stop();
			isJump = false;
			return;
		}
	setTimeout(jumpDown, accel);
	cFunc.innerHTML = 'jumpDown';
	}
	return;
}

function checkLeft()
{
	var bgScroll_1 = document.querySelector('#background-image1'),
		bgScroll_2 = document.querySelector('#background-image2');
	
	if (virtualLeft > (2000 - 360))
	{
		bgScroll_2.style.left = -(virtualLeft - 360);
		
		if (virtualLeft > (2000 + 360))
		{
			virtualLeft = 360;
		}
	}
	
	if (leftPos > 360)
	{
		bgScroll_1.style.left = -(virtualLeft - 360);
	}
	if (virtualLeft > 40)
	{
		if (leftPos < 40)
		{
			bgScroll_1.style.left = -(virtualLeft - 40);
		}
	}
	
	if (virtualLeft <= 0)
	{
		bgScroll_1.style.left = 0;
		virtualLeft = 0;		
	}
}