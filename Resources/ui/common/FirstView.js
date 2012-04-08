//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	var hasMerticData = Ti.UI.createLabel({
		color:'#000000',
		text:'Click Me (Has Metric Data)',
		height:'auto',
		width:'auto',
		metricName: 'click_me_label',
		metricData: {'some': 'data'}
	});
	self.add(hasMerticData);
	
	//Add behavior for UI
	hasMerticData.addEventListener('click', clickMe);
	
	var hasNoMerticData = Ti.UI.createLabel({
		top: 200,
		color:'#000000',
		text:'Click Me (Has No Metric Data)',
		height:'auto',
		width:'auto',
	});
	self.add(hasNoMerticData);
	
	//Add behavior for UI
	hasNoMerticData.addEventListener('click', clickMe);
	
	function clickMe(event)
	{
		metrics.sendMetrics(event);
	}
	return self;
}

module.exports = FirstView;
