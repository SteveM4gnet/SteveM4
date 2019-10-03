var pageStyle = document.querySelector('#pageStyle'),
	pageOrient = 0;

window.onresize =
window.onload =
function()
{
	getSize();
	closeLoader();
}

function closeLoader()
{
	var loader = document.querySelector('#profilePic')
		overlay = document.querySelector('#loaderOverlay');
	
	loader.classList = 'loaderIcon';
	overlay.style.height = '0%';
	overlay.style.top = '-20%';
	setTimeout(function()
	{
		loader.classList = '';
	},200);
	
}

function getSize()
{
	var winWidth = window.innerWidth,
		winHeigh = window.innerHeight,
		winRatio = (winWidth/winHeigh),
		steamWorkshop = document.querySelector('.steam-workshop-item-iframe');
	
	if (winRatio < 1.2)
	{
		pageStyle.setAttribute("href", "res/css/styles_mobile.css");
		pageOrient = 0;
	}
	else
	{
		pageStyle.setAttribute("href", "res/css/styles_desktop.css");
		pageOrient = 1;
		steamWorkshop.style.top = '50%';
	}
}
function expand()
{
	var active = document.activeElement,
		parentDiv = active.parentNode.id,
		latestHeight = document.querySelector('#' + parentDiv),
		expandButton = document.querySelector('#' + parentDiv + ' .expand'),
		expandIFrame = document.querySelector('#' + parentDiv + ' iframe'),
		steamWorkshop = document.querySelector('.steam-workshop-item-iframe');

	if (pageOrient == 0)
	{
		if (latestHeight.classList.contains('latest-steam'))
		{
			latestHeight.style.minHeight = '500px';
			steamWorkshop.style.top = '0vh';
		}
		
		
		if (latestHeight.classList.contains('latest-tweet'))
		{
			latestHeight.style.maxHeight = '75vh';
		}
		else
		{
			latestHeight.style.maxHeight = '50vh';
		}		
		
		expandButton.style.transform = 'scale(1,-1)';
		expandButton.style.height = '10vh';
		expandButton.setAttribute('onclick','minimise()');
	}
	if (pageOrient == 1)
	{
		if (latestHeight.classList.contains('latest-steam'))
		{
			//latestHeight.classList.toggle('expanded-view');
			steamWorkshop.style.top = '0vh';
		}
		
		latestHeight.classList.toggle('expanded-view');
		expandIFrame.style.width = '90%';
		expandIFrame.style.height = '78vh';
		expandButton.style.transform = 'scale(1,-1)';
		expandButton.style.height = '10vh';
		expandButton.style.width = '10%';
		expandButton.style.left = '90%';
		expandButton.setAttribute('onclick','minimise()');
	}
}

function minimise()
{
	var active = document.activeElement,
		parentDiv = active.parentNode.id,
		latestHeight = document.querySelector('#' + parentDiv),
		expandButton = document.querySelector('#' + parentDiv + ' .expand'),
		expandIFrame = document.querySelector('#' + parentDiv + ' iframe'),
		steamWorkshop = document.querySelector('.steam-workshop-item-iframe');
	
	if (pageOrient == 0)
	{
		if (latestHeight.classList.contains('latest-steam'))
		{
			latestHeight.style.minHeight = '10vh';
			steamWorkshop.style.top = '10vh';
		}
		
		latestHeight.style.maxHeight = '10vh';
		expandButton.style.transform = 'scale(1,1)';
		expandButton.style.height = '100%';
		expandButton.setAttribute('onclick','expand()');
	}	
	if (pageOrient == 1)
	{
		if (latestHeight.classList.contains('latest-steam'))
		{
			steamWorkshop.style.top = '50%';
		}
		
		latestHeight.classList.toggle('expanded-view');
		expandButton.style.transform = 'scale(1,1)';
		expandIFrame.style.width = '80%';
		expandButton.style.height = '100%';
		expandButton.style.width = '20%';
		expandButton.style.left = '80%';
		expandButton.setAttribute('onclick','expand()');
	}	
}