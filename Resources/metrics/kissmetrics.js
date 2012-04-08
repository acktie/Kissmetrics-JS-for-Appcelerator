//  Kissmetrics Javascript for Appcelerator (kissmetric.js) 1.0
//  (c) 2012 Acktie, LLC
//  Kissmetrics Javascript for Appcelerator is freely distributable under the MIT license.
//  Inspired by Jefaff's Java implemenation
//  https://github.com/acktie/Kissmetrics-JS-for-Appcelerator
//  Kissmetrics API Suppert - http://support.kissmetrics.com/apis/specifications


Ti.include("/includes/inheritance.js");
var $ = require( "/includes/ajax" );

var KissMetricsClient = Class.extend({
	_km_api_host: "trk.kissmetrics.com",

	_km_prop_api_key: "_k",
	_km_prop_event_name: "_n",
	_km_prop_alias_to: "_n",
	_km_prop_identity: "_p",
	_km_prop_timestamp: "_t",
	_km_prop_use_client_time: "_d",

	_apiKey: "",
	_id: "",
	_secure: false,
	_lastResponse: "",
	_useClientTimestamp: "",

	_scheme_https: "https",
	_scheme_http: "http",

 	_url_format: "%s://%s%s?%s",
	
	// ApiEndpoints
	_record_event: "/e",
    _set_properties: "/s",
    _alias_user: "/a",
    
    // Unit test variables
    _enableUnitTest: false,
    _urlResult: "",
    _timestamp: "",
  
    // Constructor
    init: function(apiKey, id, secure)
    {
        this._apiKey = apiKey;
        this._id = id;
        this._secure = secure;
    },
    
    // Record event
    // eventName - Name of the event
    // properties - is a json string (e.g. {key: value})
    record: function(eventName, properties)
    {
    	if(typeof properties!="object")
    	{
    		Ti.API.warn("[KissMetricsClient:record]: Invalid type of properties, expected JSON object");
    		return this;
    	}
    	
    	var props = this._JSONtoArray(properties);
    	props.push(this._propsToUrlEncoding(this._km_prop_event_name, eventName));
    	
    	this._call(this._record_event, props);	
    	
    	return this;
    },
    
    // Set event
    // properties - is a json string (e.g. {key: value})
    set: function(properties)
    {	
    	if(typeof properties!="object")
    	{
    		Ti.API.warn("[KissMetricsClient:set]: Invalid type of properties, expected JSON object");
    		return this;
    	}
    	
    	this._call(this._set_properties, this._JSONtoArray(properties));	
    	return this;
    },
    
    // Alias event
    // aliasTo - alias value (e.g. bob@bob.com)
    alias: function(aliasTo)
    {
    	if(typeof aliasTo!="string")
    	{
    		Ti.API.warn("[KissMetricsClient:alias]: Expect alias to be a String");
    		return this;
    	}
    	
    	var props = [];
    	props.push(this._propsToUrlEncoding(this._km_prop_alias_to, aliasTo));
    	
    	this._call(this._alias_user, props);	
    	return this;
    },
    
    // Make call to KissMetrics
    _call: function(apiEndpoint, properties)
    {
    	if(!this._isReady())
    	{
    		Ti.API.warn("[KissMetricsClient]: API Key and/or ID has not been set.")
    		return;
    	}
    	
    	properties.push(this._propsToUrlEncoding(this._km_prop_api_key, this._apiKey));
    	properties.push(this._propsToUrlEncoding(this._km_prop_identity, this._id));
    	
    	if(this._useClientTimestamp)
    	{
    		var now = Math.round(+new Date()/1000);
    		properties.push(this._propsToUrlEncoding(this._km_prop_use_client_time, +true));
    		properties.push(this._propsToUrlEncoding(this._km_prop_timestamp, now));
    		
    		if(this._enableUnitTest)
    		{
    			this._timestamp = now;
    		}
    	}
    	
    	var url = this._constructUrl(apiEndpoint, properties)
    	
    	$.ajax({
		    url: url,
		    method: 'get',
		    kmc: this, 
		    success: function(xhr)
		    {
		    	if(xhr === null)
		    	{
		    		// According to KissMetrics API Docs there is no way to validate API call through the response
		    		// Always returns an 1x1 pixel gif
		    		// http://support.kissmetrics.com/apis/api-tips
		    		
		    		// Ti.API.warn("[KissMetricsClient:_call:ajax]: No data returned");
		    		return;
		    	}
		    	
		    	this.kmc._lastResponse = xhr;
		    },
		    error: function(xhr) {
		        Ti.API.error("[KissMetricsClient:_call:ajax]: error occured when calling Kiss Metrics");
		    }
		});
    	
    	if(this._enableUnitTest)
    	{
    		Ti.API.info("url: " + url);
    		this._urlResult = url;	
    	}
    },
    
     // Utility functions
    _constructUrl: function(endpoint, properties)
    {
    	var scheme = this._secure ? this._scheme_https : this._scheme_http;
    	
    	var propString = properties.join("&");
    	return String.format(this._url_format, scheme, this._km_api_host, endpoint, propString);
    },
    
    // Make property URL friendly
    _propsToUrlEncoding: function(key, value)
    {
    	return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    },
    
    // Concert JSON to an Array
    _JSONtoArray: function(json)
    {
    	var array = new Array();

		for (key in json) {
		    array.push(this._propsToUrlEncoding(key, json[key]));
		}
		
		return array;
    },
    
    // Checks to see if apikey and id are set correctly
    _isReady: function()
    {
    	if((this._apiKey != 'undefined' && this._apiKey.length !=0) && 
    	   (this._id != 'undefined' && this._id.length != 0))
    	   		return true;
    	   
    	return false;
    },
    
    // Setters
    setUseClientTimestamp: function(useClientTimestamp)
    {
    	this._useClientTimestamp = useClientTimestamp;
    },
});