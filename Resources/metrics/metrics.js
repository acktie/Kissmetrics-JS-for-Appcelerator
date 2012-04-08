Ti.include("/metrics/kissmetrics.js");
Ti.include("/includes/inheritance.js");

// Uncomment to run unit tests
// Ti.include("/metrics/kissmetricsTests.js");

var Metrics = Class.extend({
	_uuid: Ti.Platform.createUUID(),
	_kmc: null,
	_myKMApiKey: "myKMApiKey",
	
    init: function()
    {
		Ti.API.info("Init: Metrics");
		this._kmc = new KissMetricsClient(this._myKMApiKey, this._uuid, false);
		this._kmc._enableUnitTest = true;
    },
    
    sendMetrics: function(obj)
    {
    	var type = this._type(obj);
    	switch (type)
    	{
    		case 'TiUIButton':
    			this._button(obj);
    			break;
    		case 'TiUITabGroup':
    			this._tabGroup(obj);
    			break;
    		case 'TiUILabel':
    			this._label(obj);
    			break;
    		default:
    		Ti.API.log("info", "Metrics: fallout");
    	}
    },
    
    _button: function(obj)
    {
    	var metricName = '';
    	var metricData = {};
    	
    	if(obj.metricName != undefined)
    		metricName = obj.metricName;
    	else
    		metricName = obj.title;
    	
    	if(obj.metricData != undefined)
    		metricData = obj.metricData;
    		
    	this._kmc.record("clicked_" + metricName, metricData);
    },
    
    _label: function(obj)
    {
    	var labelObj = obj.source;
    	var metricName = '';
    	var metricData = {};
    	
    	if(labelObj.metricName != undefined)
    		metricName = labelObj.metricName;
    	else
    		metricName = labelObj.text;
    	
    	if(labelObj.metricData != undefined)
    		metricData = labelObj.metricData;
    	
    	this._kmc.record("clicked_" + metricName, metricData);
    },
    
    _tabGroup: function(obj)
    {
    	var activeTab = obj.activeTab;
    	var metricName = '';
    	var metricData = {};
    	
    	if(activeTab.metricName != undefined)
    		metricName = activeTab.metricName;
    	else
    		metricName = activeTab.title;
    	
    	if(activeTab.metricData != undefined)
    		metricData = activeTab.metricData;
    	
    	this._kmc.record("clicked_" + metricName, metricData);
    },
    
    _type: function(obj)
    {
    	var object = '';
    	if(obj.toString() != '[object Object]')
    		object = obj;
    	else if(obj.source != undefined)
    		object = obj.source;
    		
    	return object.toString().match(/\s\w+/)[0].trim();
    }
});

/*
 * Extends the Array prototype to create the contains function.
 * This function is used to search through the array and determine
 * if the Array contains the object.
 */
Array.prototype.contains = function(obj) 
{
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}