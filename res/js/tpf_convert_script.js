var inputFile = document.querySelector('#mdl_file'),
	fileType,
	stats = document.querySelector('#display_stats'),
	metaData = document.querySelector('#metadata'),
	metaDataArr,
	model = new Object(),
	msgAlert = false,
	fullscreenDisplay = false,
	fileParse,
	mdlFileParse,
	grpFileParse,
	mtlFileParse,
	mdlMesh,
	fileAsString,
	targetFileArr = [],
	mshTransf = [[],[]],
	mshAnimations = [[],[]],
	mshMaterials = [[],[]],
	grpChildArr = [[],[],[]],
	newMdlChild = 
	{
		animations: [[],[]],
		materials: [[],[]],
		mesh: [],
		transf: [],
		groupToChild: [],
		boundingInfo:
		{
			bbMax:'',
			bbMin:'',
		},
		mdlMetaData: 
		{
			modelStats: model,
			modelParticles: '',
		},			
	},
	mshAnimations;

function readFile()
{
	fileType = inputFile.files[0].name.split('.');
	fileType = !fileType[2] ? fileType[1] : fileType[1] + '.' + fileType[2];
	if (inputFile.files.length > 1)
	{
		console.log('multiFile');
		
		
		if (fileType == 'msh.blob')
		{
			tpfAlert
				('Cannot upload msh.blob files. Please select only .msh files.' + '\n\n' +
				'A quick way to do this is to sort by \'type\' in your Windows Explorer', false)
			return;
		}
		
		if (fileType == 'mdl')
		{
			tpfAlert('Please upload one mdl file to convert', false);
			return;
		}
		
		for (var i = 0; i != inputFile.files.length; i++)
		{
			if (fileType != inputFile.files[i].name.split('.')[1])
			{
				tpfAlert('Please upload one file type at a time', false);
				return;
			}
		}
		// file iteration to find .msh files
		if (fileType == "grp") findMshInGrp(inputFile.files);
		if (fileType == "msh") findAnimationInMsh(inputFile.files);
		if (fileType == "grp") findChildInGrp(inputFile.files);
	}
	else
	{	
		var txtOut,
			fileContent = inputFile.files[0];
		
		if (fileType == "msh") findAnimationInMsh(inputFile.files);	
		
		var reader = new FileReader();
		reader.onload = function(e)
		{
			fileContent = reader.result;
			parseFile(fileContent);
		}
		reader.readAsText(fileContent);		
	}	
}

function findAnimationInMsh(mshFiles)
{
	var int1 = 0,
		int2 = 0,
		fileName = [],
		targetFile = '',
		mshString = '';
	
	while (mshFiles.length > int1)
	{
		var fileContent = inputFile.files[int1];
		fileName.push(inputFile.files[int1].name);
		let reader = new FileReader();		
		reader.readAsText(fileContent);
		reader.onload = function()
		{
			int2++;
			fileContent = reader.result;
			mshString += fileContent;			
			if (int2 == int1)
			{
				parseFile(mshString, fileName);
			}
		}	
		int1++;
	}
}

function findMshInGrp(grpFiles)
{
	var int1 = 0,
		int2 = 0,
		targetFile = '',
		grpString = '';
	
	while (grpFiles.length > int1)
	{
		var fileContent = inputFile.files[int1];
		let reader = new FileReader();		
		reader.readAsText(fileContent);
		reader.onload = function()
		{
			int2++;
			fileContent = reader.result;
			grpString += fileContent;
			if (int2 == int1)
			{
				parseFile(grpString);
			}
		}	
		int1++;
	}
}

function findChildInGrp(grpFiles)
{
	var int1 = 0,
		int2 = 0,
		fileName = [],
		targetFile = '',
		grpString = '';
	
	while (grpFiles.length > int1)
	{
		var fileContent = inputFile.files[int1];
		fileName.push(inputFile.files[int1].name);
		let reader = new FileReader();		
		reader.readAsText(fileContent);
		reader.onload = function()
		{
			int2++;
			fileContent = reader.result;
			grpString += fileContent;			
			if (int2 == int1)
			{
				parseFile(grpString, fileName);
			}
		}	
		int1++;
	}
}

function parseFile(txt,fileName)
{
	
	var file =
		{
			content: txt,
			name: inputFile.files[0].name
		},
		int1 = 0,
		tabIndex = 0;

	fileParse = file.content.replace(/[\t+]|[\r+]/g, '');
	fileParse = fileParse.split('\n');
	
	if (fileType == 'mdl') getParticleSystem(fileParse, fileType, fileName);
	if (fileType == 'mdl') getBoundingInfo(fileParse);
	if (fileType == 'mdl') mdlFileParse = fileParse;
	if (fileType == 'mdl') displayFile(fileParse, fileType);
	if (fileType == 'grp') displayFile(fileParse, fileType);
	if (fileType == 'mtl') displayFile(fileParse, fileType);
	if (fileType == 'mdl' || fileType == 'grp') getMshData(fileParse);
	if (fileType == 'msh') getAnimationData(fileParse, fileType, fileName);
	if (fileType == 'msh') getMaterialData(fileParse, fileType, fileName);
	if (fileType == 'grp') grpToChild(fileParse, fileType, fileName);
	if (fileType == 'mdl') getMetaData(fileParse);
}

function displayFile(file, type)
{	
	var int1 = 0,
		tabIndex = 0;
	
	while (file.length > int1)
	{
		if (file[int1].includes('{')) tabIndex++;
		if (file[int1].includes('}')) tabIndex--;
		
		for (var i = 0; i != tabIndex; i++)
		{
			cd('\t', type) 
		}
		cd(file[int1], type)
		cd('\n', type);
		int1++;
	}
	
}

function getBoundingInfo(file)
{
	var int1 = 0,
		particleEmitters = '',
		tabIndex = 0,
		childOpen = false;	
	
	while (file.length > int1+1)
	{
		if (file[int1].includes('boundingInfo')) childOpen = true;
		
		if (childOpen)
		{
			if (fileParse[int1].includes('{')) tabIndex++;
			if (fileParse[int1].includes('}')) tabIndex--;
				
			if (file[int1].includes('bbMax'))
			{
				newMdlChild.boundingInfo.bbMax = file[int1];
			}
			if (file[int1].includes('bbMin'))
			{
				newMdlChild.boundingInfo.bbMin = file[int1];
			}
			
			if (tabIndex == 0)
			{
				childOpen = false;
			}	
		}
		int1++;
	}
}

function getParticleSystem(file, type, name)
{
	var int1 = 0,
		particleEmitters = '',
		tabIndex = 0,
		childOpen = false;	
	
	while (file.length > int1+1)
	{
		if (file[int1].includes('particleSystem')) childOpen = true;
		
		if (childOpen)
		{
			if (file[int1] == '') file.splice(int1,1);			
			
			for (var i = 0; i != tabIndex; i++)
			{
				cd('\t','emitters') 
			}
			cd(file[int1] + '\n','emitters');
			
			if (file[int1].includes('{')) tabIndex++;
			if (file[int1].includes('}')) tabIndex--;
			
			particleEmitters += file[int1];
			
			if (tabIndex == 0)
			{
				childOpen = false;
			}	
		}
		int1++;		
	}
	particleEmitters = particleEmitters.split('particleSystem = {')[1];
	newMdlChild.mdlMetaData.modelParticles = particleEmitters;
}

function grpToChild(file, type, name)
{
	if (!name) return;
	var int1 = 0,
		int2 = 0,
		tabIndex = 0,
		tabIndex2 = 0,
		fileInt = 0,
		targetFile,
		childOpen = false;
		returnOpen = false;
	
	while (fileParse.length > int1+1)
	{
		if (fileParse[int1].includes('return')) returnOpen = true;
		if (fileParse[int1].includes('children')) childOpen = true;
		
		if (returnOpen)
		{
			if (fileParse[int1].includes('{')) tabIndex2++;
			if (fileParse[int1].includes('}')) tabIndex2--;	
		
			if (childOpen)
			{
				if (fileParse[int1] == '') fileParse.splice(int1,1);
				if (fileParse[int1].includes('{')) tabIndex++;
				if (fileParse[int1].includes('}')) tabIndex--;

			
				if (tabIndex > 1)
				{
					if (fileParse[int1].includes('grp'))
					{
						targetFile = fileParse[int1].split('"')[1];
						targetFileArr.push(targetFile);
						msgAlert = true;
					}
					
					if (fileParse[int1].includes('msh'))
					{
						grpChildArr[0].push(fileParse[int1+0].split('"')[1]);
						var transfMatrix = fileParse[int1+2];
						if (transfMatrix.includes('transf'))
						{
							transfMatrix = transfMatrix.split('= ')[1];
						}
						grpChildArr[1].push(transfMatrix);
						grpChildArr[2].push(name[fileInt])
					}
				}
				if (tabIndex == 0)
				{
					childOpen = false;
				}
			}
			
			if (tabIndex2 == 0)
			{
				returnOpen = false;
				//grpChildArr[2].push(name[fileInt])
				fileInt++;
			}			
		}
		int1++;		
	}
	
	//-- display
	for (var i = 0; i != grpChildArr[0].length; i++)
		{
			cd
			(
				'.grp | file = ' + grpChildArr[2][i] + '\n'+
				'.msh | id = ' + grpChildArr[0][i] + '\n' +
				'.msh | transf = ' + grpChildArr[1][i] + '\n\n','children'
			)
			newMdlChild.mesh.push(grpChildArr[0][i]);
			newMdlChild.groupToChild.push(grpChildArr[2][i]);			
			newMdlChild.transf.push(grpChildArr[1][i]);
		}
}

function getMaterialData(fileParse, fileType, fileName)
{
	var int1 = 0,
		int2 = 0,
		tabIndex = 0,
		tabIndex2 = 0,
		fileInt = 0,
		materialData = '',
		childOpen = false,
		returnOpen = false;
	
	while (fileParse.length > int1+1)
	{
		if (fileParse[int1].includes('return')) returnOpen = true;
		if (fileParse[int1].includes('materials')) childOpen = true;
		
		if (returnOpen)
		{
			if (fileParse[int1].includes('{')) tabIndex2++;
			if (fileParse[int1].includes('}')) tabIndex2--;			
		
			if (childOpen)
			{
				if (fileParse[int1] == '') fileParse.splice(int1,1);
				if (fileParse[int1].includes('{')) tabIndex++;
				if (fileParse[int1].includes('}')) tabIndex--;

				if (tabIndex > 0)
				{
					int2++;
					materialData += fileParse[int1];
				}
				
				if (tabIndex == 0)
				{				
					childOpen = false;
					mshMaterials[0].push(fileName[fileInt])
					mshMaterials[1].push(materialData);
					materialData = '';
				}		
			}
			if (tabIndex2 == 0)
			{
				returnOpen = false;
				fileInt++;
			}
			
		}
		int1++;		
	}
	materialData = '';
	//-- display
	for (var i = 0; i != mshMaterials[0].length; i++)
	{
		cd
		(
			'msh file = ' + mshMaterials[0][i] + '\n' +
			'mtl target = ' + mshMaterials[1][i] + '\n\n','mtl'
		)
		newMdlChild.materials[0].push(mshMaterials[0][i]);
		newMdlChild.materials[1].push(mshMaterials[1][i].split('materials = {"')[1]);
	}	
}

function getAnimationData(fileParse, fileType, fileName)
{
	var int1 = 0,
		int2 = 0,
		tabIndex = 0,
		fileInt = 0,
		animationData = '',
		childOpen = false;
	
	while (fileParse.length > int1+1)
	{
		if (fileParse[int1].includes('animations')) childOpen = true;
		
		if (childOpen)
		{
			if (fileParse[int1] == '') fileParse.splice(int1,1);
			if (fileParse[int1].includes('{')) tabIndex++;
			if (fileParse[int1].includes('}')) tabIndex--;

			if (tabIndex > 0)
			{
				int2++;
				animationData += fileParse[int1];
			}
			
			if (tabIndex == 0)
			{				
				childOpen = false;
				mshAnimations[0].push(fileName[fileInt])
				mshAnimations[1].push(animationData);
				animationData = '';
				fileInt++;
			}
			
		}
		int1++;		
	}
	animationData = '';
	//-- display
	for (var i = 0; i != mshAnimations[0].length; i++)
	{
		cd
		(
			'.msh file = ' + mshAnimations[0][i] + '\n' +
			'animation data = ' + '\n' +
			mshAnimations[1][i] + '\n\n','animation'
		)
		newMdlChild.animations[0].push(mshAnimations[0][i]);
		newMdlChild.animations[1].push(mshAnimations[1][i].split('animations = {')[1]);
	}	
}

function getMshData(fileParse)
{
	var int1 = 0,
		int2 = 0,
		tabIndex = 0,
		targetFile,
		childOpen = false;
	
	while (fileParse.length > int1+1)
	{
		if (fileParse[int1].includes('children')) childOpen = true;
		
		if (childOpen)
		{
			if (fileParse[int1] == '') fileParse.splice(int1,1);
			if (fileParse[int1].includes('{')) tabIndex++;
			if (fileParse[int1].includes('}')) tabIndex--;

		
			if (tabIndex > 1)
			{
				if (fileParse[int1].includes('grp'))
				{
					targetFile = fileParse[int1].split('"')[1];
					targetFileArr.push(targetFile);
					msgAlert = true;
				}
				
				if (fileParse[int1].includes('msh'))
				{
					mshTransf[0].push(fileParse[int1+0].split('"')[1]);
					var transfMatrix = fileParse[int1+2];
					if (transfMatrix.includes('transf'))
					{
						transfMatrix = transfMatrix.split('= ')[1];
					}
					mshTransf[1].push(transfMatrix);
				}
			}
			if (tabIndex == 0)
			{
				childOpen = false;
			}
			
		}
		int1++;		
	}
	
	//-- display
	for (var i = 0; i != mshTransf[0].length; i++)
	{
		cd
		(
			'id = ' + mshTransf[0][i] + '\n' +
			'transf = ' + mshTransf[1][i] + '\n\n','msh'
		)
	}
	
	if (msgAlert)
	{
		tpfAlert('Your .mdl or .grp file referenced other .grp files.' + '\n' +
			'These are now non-standard in TpF2.' + '\n\n' + 
			'Please upload the following: ' + '\n' +
			grpFilesToUpload(targetFileArr),false);
		msgAlert = false;
		
		function grpFilesToUpload(targetFileArr)
		{
			var txt = '';
			
			for (var i = 0; i != targetFileArr.length; i++)
			{
				txt += targetFileArr[i] + '\n';
			}
			
			return txt;
		}
	}
}

function getMetaData(fileParse)
{
	var int1 = 0,
		int2 = 0,
		tabIndex = 0,
		targetFile,
		childOpen = false;
		
	while (fileParse.length > int1)
	{
		if (fileParse[int1].includes('metadata')) childOpen = true;
		
		if (childOpen)
		{
			if (fileParse[int1].includes('{')) tabIndex++;
			if (fileParse[int1].includes('}')) tabIndex--;
				
			if (fileParse[int1].includes('name = _')) 			model.descName 		= getParam();
			if (fileParse[int1].includes('description = _'))	model.descAbout 	= getParam();
			if (fileParse[int1].includes('topSpeed = ')) 		model.topSpeed 		= getParam();
			if (fileParse[int1].includes('weight = ')) 			model.weight 		= getParam();
			if (fileParse[int1].includes('type = '))			model.engineType 	= getParam('type');
			if (fileParse[int1].includes('power = ')) 			model.enginePower 	= getParam('power');
			if (fileParse[int1].includes('Effort = '))			model.engineTE		= getParam('Effort');
			if (fileParse[int1].includes('soundSet = ')) 		model.soundSet 		= getParam('name');
			if (fileParse[int1].includes('carrier =')) 			model.carrier 		= getParam();
			if (fileParse[int1].includes('yearFrom =')) 		model.availFrom 	= getParam();
			if (fileParse[int1].includes('yearTo =')) 			model.availTo 		= getParam();
			if (fileParse[int1].includes('price = ')) 			model.costPrice 	= getParam();
			if (fileParse[int1].includes('runningCosts ='))		model.costRunning 	= getParam();
			if (fileParse[int1].includes('lifespan =')) 		model.lifespan 		= getParam();
			
			function getParam(searchLine)
			{
				var param;
				
				param = fileParse[int1];
				
				 if (searchLine)
				 {
					var pos;
					pos = param.search(searchLine);
					param = param.slice(pos);
					param = param.split(',')[0];
					param = param.replace(/\}\s*$/,"");
				}
				param = param.replace(/(^.*\(|\).*$)|[\"]/g,'');
				if (param.includes('=')) param = param.split('=')[1];
				param = param.replace(/,\s*$/,"");
				param = param.trim();
				return String(param);
			}
			
			if (tabIndex == 0)
			{
				childOpen = false;
			}
		}	
		int1++;		
	}
	cd(showStats(model),'stats');
}

function cd(t,f)
{
	if (!f) f = fileType;
	var display = document.querySelector('#display_' + f);
	display.innerHTML += t;
	contentDisplay();
}

function tpfAlert(alertTxt,nice)
{
	var alertBox = document.getElementById('alertBox');
	
	if (alertTxt == 'guide')
	{
		alertTxt = getGuide();
	}
	
	if (alertTxt == 'none')
	{
		alertBox.className = ('');	
		alertBox.innerHTML = alertTxt;
		return;
	}
	
	alertBox.innerHTML = alertTxt;
	setTimeout(showText,10);
			function showText()
			{
				alertBox.classList.toggle('show');
				if (nice)
				{
					alertBox.classList.toggle('nice');
				}
				else
				{
					alertBox.className = ('show');					
				}
			}	
}

function showMetaData(t)
{
	//metaData.innerHTML += t;
}

function getImperial(val,unit)
{
	val = 
	unit == 'mph' ? 	val / 1.609 :
	unit == 'tons' ? 	val * 1.102 :
	unit == 'hp' ? 		val * 1.341 :
	unit == 'lbf' ? 	val * 4.448 : null;
	
	val = Math.round(val);
	
	return val;
}

function showStats(model)
{
	var statistics = 
	'Name: ' + model.descName + '\n' +
	'Description: ' + model.descAbout + '\n' +
	'Top Speed: ' + model.topSpeed + ' km/h / ' + getImperial(model.topSpeed,'mph') + ' mph' + '\n' +
	'Weight: ' + model.weight + '  metric tons / ' + getImperial(model.weight,'tons') + ' tons' + '\n' +
	'Engine Type: ' + model.engineType + '\n' +
	'Power: ' + model.enginePower + ' kw / ' + getImperial(model.enginePower,'hp') + ' hp' + '\n' +
	'Tractive Effort: ' + model.engineTE + ' kN / ' + getImperial(model.engineTE,'lbf') + ' lb/f' + '\n' +
	'SoundSet: ' + model.soundSet + '\n' +
	'Carrier: ' + model.carrier + '\n' +
	'Avaliable: ' + model.availFrom + ' - ' + model.availTo + '\n' +
	'Price: ' + model.costPrice + '\n' +
	'Running costs: ' + model.costRunning + '\n' +
	'Lifespan: ' + model.lifespan + '\n';
	
	return statistics;
}
var currentOpen;

function expand(box)
{
	var forceCollapse = document.querySelector('.console.embiggen'),
		buttonShow = document.querySelector('#closeTextarea');
		
	currentOpen = box;
	
	if (box === 'close')
	{
		forceCollapse.className = 'console collapse';
		buttonShow.classList.toggle('show');
		var buttonShow = document.querySelector('#saveTextarea');
		buttonShow.className = 'save';
		return;
	}
	
	var display = document.querySelector('#display_' + box),
		expand = display.parentElement.parentElement;
		
	if (fullscreenDisplay)
	{
		expand.className = 'console embiggen fullscreen';
	}
	else
	{
		expand.className = 'console embiggen';
	}
	
	
	
	if 	(expand != forceCollapse)
	{
		buttonShow.classList.toggle('show');
		try 
		{
			forceCollapse.className = 'console collapse';
			buttonShow.classList.toggle('show');

		}
		catch
		{
			return;
		}
		
	}
}

function contentDisplay()
{
	var consoleMin = document.querySelectorAll('.console');
	
	for (var i = 0; i != consoleMin.length; i++)
	{
		var consoleTextarea = consoleMin[i].getElementsByTagName('textarea')[0];
	
		if (consoleTextarea.innerHTML != '')
		{
			consoleMin[i].style.background = '#C12914';
			setTimeout(stopGlow,1000);
			function stopGlow()
			{
				for (var i = 0; i != consoleMin.length; i++)
				{
					consoleMin[i].style.background = '';
				}
			}
		}
	}
	
}

function saveButton()
{
	var buttonShow = document.querySelector('#saveTextarea');
	buttonShow.className = 'save show';
	buttonShow.innerHTML = 'Save .' + currentOpen;	
}

function fullscreen()
{
	fullscreenDisplay = true;
	var modDetails = document.getElementById('mod_details'),
		buttonText = document.getElementById('fullScreenButton'),
		buttonSave = document.getElementById('saveTextarea'),
		buttonClose = document.getElementById('closeTextarea'),
		console = document.querySelector('.console.embiggen');
	
	if (buttonText.innerHTML == 'Smaller view')
	{
		buttonText.innerHTML = 'Larger view';
		fullscreenDisplay = false;
	}
	else
	{
		buttonText.innerHTML = 'Smaller view';
	}	
	modDetails.classList.toggle('fullscreen');
	buttonClose.classList.toggle('fullscreen');
	buttonSave.classList.toggle('fullscreen');
	try
	{
		console.classList.toggle('fullscreen');
	}
	catch{null}	
}

function getGuide(guide)
{
	guide = 
	'A guide on how to use the .mdl converter. Developed by SteveM4.' + '\n\n' +
	'<b>Upload your .mdl file first</b>' + '\n' +
	'At the moment this can only convert one .mdl at a time. If you have a mod that has multiple' +
	'.mdl files, you may need to either repeat this process, or use this application to assist manual ' + 
	'porting' + '\n\n' + 
	'After uploading your .mdl file, depending on your use of .grp files, you will need to then upload ' + 
	'all .grp files the .mdl refers too. Luckily, this app will tell you the exact files the .mdl is ' + 
	'looking for.' + '\n\n' +
	'<b>Upload your .grp files</b>' + '\n' +
	'Your group files will be combed for ALL .msh files that are referenced. There may be duplicates ' +
	'(like wheels etc), but this is important for constructing the <i>childeren</i> in the new .mdl ' + 
	'format.' + '\n\n' +
	'Please click <a href = "">Here</a> for the latest documentation on the new format.' + '\n\n' +
	'<b>Upload all your mesh files</b>' + '\n' +
	'Uploading the mesh files is one of the more important steps. In the new format, meshes and their ' + 
	'materials are defined at the .mdl level, along with their transforms (supports transf and vec3)' + 
	' formats. The animations are also defined at this level, and will be extracted from the .msh file.' + 
	'\n\n' + 
	'<b>Change your units!</b>' + '\n' +
	'Many units for TpF2 have changed from the original. In the \'Stats\' tab, you have the ability ' +
	'to see the stats that have been extracted from the .mdl file. These will be <i>automatically ' +
	'converted</i> to the new values.' +
	'\n\n\n' + 
	'I have included an example .mdl file I manually converted for my Rocket mod. (the transf are ' +
	'incorrect as there is yet to be a model viewer released for TpF2). That file can be found ' +
	'<a href = "new_example.mdl" target = "_blank">Here</a>.' ;
	
	return guide;
}

function amntOfLods()
{
	var childOpen = false,
		lodNumber = 0;
	
	for (var i = 0; i != mdlFileParse.length; i++)
	{
		if (mdlFileParse[i].includes('lods')) childOpen = true;
		
		if (childOpen)
		{
			if (mdlFileParse[i].includes('children')) lodNumber++;
		}
	}
	return lodNumber;
}

function amntOfGroups()
{
	var childOpen = false,
		groupNumber = 0;
	
	for (var i = 0; i != mdlFileParse.length; i++)
	{
		if (mdlFileParse[i].includes('children')) childOpen = true;
		
		if (childOpen)
		{
			if (mdlFileParse[i].includes('GROUP')) groupNumber++;
		}
	}
	return groupNumber;
}

function linkMshToMtl()
{
	
}

function makeNewMdl()
{
	var mdlHeader =
		'local vec2 = require "vec2"' + '\n' +
		'local vec3 = require "vec3"' + '\n' +
		'local vehicleutil = require "vehicleutil"' + '\n' +
		'function data()' + '\n' +
		'return {' + '\n';
		
	var boundingInfo = 
		'boundingInfo = {' +'\n' +
		newMdlChild.boundingInfo.bbMax +'\n' +
		newMdlChild.boundingInfo.bbMin +'\n' +
		'}' +'\n';
	
	var collider = 
		'collider = {' + '\n' +
		'params = {},' +'\n' +
		'transf = { 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, },' +'\n' +
		'type = "MESH",' +'\n' +
		'},' +'\n';
		
	var lodsHeader =
		'lods = {' +'\n' +
		'{' +'\n';

	var nodes = '';
	for (var i = 0; i != amntOfLods(); i++)
	{
		var children = '';
		
		nodes += 
		'children = {' + '\n' +
		'{' + '\n';
		
		for (var ii = 0; ii != amntOfGroups(); ii++)
		{
			nodes = 
			'children = {' + '\n' +
			'{' + '\n' +
			'materials = { ' + newMdlChild.materials[1][0] + ', },' + '\n' +
			'mesh = ' + newMdlChild.materials[0][0] + ',' + '\n' +
			'transf = ' + '\n';
			
			
		}
	}
		
		
	var newMdlFileFull = mdlHeader + boundingInfo + collider
	return newMdlFileFull;
}

function printNewMdl()
{
	cd(makeNewMdl(),'newMdl');
}