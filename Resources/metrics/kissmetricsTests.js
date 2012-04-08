//  Kissmetrics Javascript for Appcelerator (kissmetric.js) 1.0
//  (c) 2012 Acktie, LLC
//  Kissmetrics Javascript for Appcelerator is freely distributable under the MIT license.
//  Inspired by Jefaff's Java implemenation
//  https://github.com/acktie/Kissmetrics-JS-for-Appcelerator
//  Kissmetrics API Suppert - http://support.kissmetrics.com/apis/specifications

(function()
{
	var expectedApiKey = "myKey";
	var expectedId = "myId";
	var expectedInSecure = false;
	var expectedTestEvent = "TestEvent";
	var testProps = {};
	
	var failureCount = 0;
	
	function testPositiveConstructor()
	{
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, expectedInSecure);
		kmc._enableUnitTest = true;
		
		assertEquals(kmc._apiKey, expectedApiKey);
		assertEquals(kmc._id, expectedId);
		assertEquals(kmc._secure, expectedInSecure);
	}
	
	function testPositiveInSecureCall()
	{
		var expecteUrl = "http://trk.kissmetrics.com/e?_n=TestEvent&_k=myKey&_p=myId";
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, expectedInSecure);
		kmc._enableUnitTest = true;
		
		kmc.record(expectedTestEvent, testProps);
		
		assertEquals(kmc._urlResult, expecteUrl);
	}
	
	function testPositiveSecureCall()
	{
		var expecteUrl = "https://trk.kissmetrics.com/e?_n=TestEvent&_k=myKey&_p=myId";
		var secure = true
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, secure);
		kmc._enableUnitTest = true;
		
		kmc.record(expectedTestEvent, testProps);
		
		assertEquals(kmc._urlResult, expecteUrl);
	}
	
	function testPositiveSetCall()
	{
		var expecteUrl = "http://trk.kissmetrics.com/s?key=value&anotherKey=anotherValue&%26*%23)*%40=(*%26%23HDJ(*(S)))&_k=myKey&_p=myId";
		var setData = {'key': 'value', 'anotherKey': 'anotherValue', '&*#)*@':'(*&#HDJ(*(S)))'};
		
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, expectedInSecure);
		kmc._enableUnitTest = true;
		
		kmc.set(setData);
		
		assertEquals(kmc._urlResult, expecteUrl);
	}
	
	function testPositiveAliasCall()
	{
		var expecteUrl = "http://trk.kissmetrics.com/a?_n=bob%40bob.com&_k=myKey&_p=bob";
		var alias = "bob@bob.com";
		
		var kmc = new KissMetricsClient(expectedApiKey, "bob", expectedInSecure);
		kmc._enableUnitTest = true;
		
		kmc.alias(alias);
		
		assertEquals(kmc._urlResult, expecteUrl);
	}
	
	function testPositiveUseClientTimestampCall()
	{
		var expecteUrl = "http://trk.kissmetrics.com/e?_n=TestEvent&_k=myKey&_p=myId&_d=1&_t=";
		
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, expectedInSecure);
		kmc.setUseClientTimestamp(true);
		kmc._enableUnitTest = true;
		
		kmc.record(expectedTestEvent, testProps);
		
		assertEquals(kmc._urlResult, expecteUrl + kmc._timestamp);
	}
	
	function testNegativeSetCall()
	{
		var expecteUrl = "";
		var setData = "";
		
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, expectedInSecure);
		kmc._enableUnitTest = true;
		
		kmc.set(setData);
		
		assertEquals(kmc._urlResult, expecteUrl);
	}
	
	function testNegativeAliasCall()
	{
		var expecteUrl = "";
		var alias = [];
		
		var kmc = new KissMetricsClient(expectedApiKey, expectedId, expectedInSecure);
		kmc._enableUnitTest = true;
		
		kmc.alias(alias);
		
		assertEquals(kmc._urlResult, expecteUrl);
	}
	
	function testNegativeBadApiKeyCall()
	{
		var expectedUrl = "";
		var kmc = new KissMetricsClient(undefined, expectedId, expectedInSecure);
		kmc._enableUnitTest = true;
		
		assertEquals(kmc._urlResult, expectedUrl);
	}
	
	function testNegativeBadIdCall()
	{
		var expectedUrl = "";
		var kmc = new KissMetricsClient(expectedApiKey, undefined, expectedInSecure);
		kmc._enableUnitTest = true;
		
		assertEquals(kmc._urlResult, expectedUrl);
	}
	
	
	// Assert Helper
	function assertEquals(actual, expected)
	{
		var testName = assertEquals.caller.name;
		if(actual === expected)
		{
			Ti.API.info("[Pass " + testName + " ]");
		}
		else
		{
			Ti.API.error("[Failed " + testName + "]:" + "Expected " + expected + " but got " + actual);
			failureCount++;
		}
	}
	
	Ti.API.info("Running KissMetrics JS Unit Tests ...");
	testPositiveConstructor();
	testPositiveInSecureCall();
	testNegativeBadApiKeyCall();
	testNegativeBadIdCall();
	testPositiveSecureCall();
	testPositiveSetCall();
	testNegativeSetCall();
	testPositiveAliasCall();
	testNegativeAliasCall();
	testPositiveUseClientTimestampCall();
	Ti.API.info("Finished KissMetrics JS Unit Tests: " + failureCount + " Failures");
})();
