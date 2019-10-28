
var CRMURL = "https://crm.practicemanagersuk.org";
//var CRMURL = "https://mhrclients.duckdns.org";

var app = {
	// Application Constructor
	initialize: function() {
			this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
			document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
			readyFunction();
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
			var parentElement = document.getElementById(id);
			var listeningElement = parentElement.querySelector('.listening');
			var receivedElement = parentElement.querySelector('.received');

			listeningElement.setAttribute('style', 'display:none;');
			receivedElement.setAttribute('style', 'display:block;');

			console.log('Received Event: ' + id);
	}
};

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

var numrows = 0;

function insertDB(location){
	var goodform = true;
	
	var first_name = $('#first_name').val();
	var last_name = $('#last_name').val();
	var organisation = $('#company').val();
	var job_title = $('#job_title').val();
	var job_title_other = $('#job_title_other').val();
	var pma_education;
	if ($('#pma_education').prop('checked')) {
		pma_education = 1;
	}else{
		pma_education = 0;
	}
	var pma_workshops;
	if ($('#pma_workshops').prop('checked')) {
		pma_workshops = 1;
	}else{
		pma_workshops = 0;
	}
	var attended;
	if ($('#attended').prop('checked')) {
		attended = 1;
	}else{
		attended = 0;
	}
	var email = $('#email').val();
	var mobilephone = $('#mobile_phone').val();
	
	var error = new Array();
	if(first_name==''){
		goodform = false;
		error.push("The first name cannot be blank");
	}
	if(last_name==''){
		goodform = false;
		error.push("The last name cannot be blank");
	}
	if(mobilephone==''){
		goodform = false;
		error.push("The phone number cannot be blank");
	}
	if(email==''){
		goodform = false;
		error.push("The email address cannot be blank");
	}else if(!validateEmail(email)){
		goodform = false;
		error.push("Please enter a valid email address");
	}
	var notes = $('#notes').val();
	
	var rowtouse;
	if(location=='0'){
		rowtouse = numrows;
	}else{
		rowtouse = localStorage.getItem('contactidtoedit');
	}
	
	if(goodform){
		checkStoredRecords();
		var d = new Date();
		
		localStorage.setItem("contact-"+rowtouse+"-first_name", first_name);
		localStorage.setItem("contact-"+rowtouse+"-last_name", last_name);
		localStorage.setItem("contact-"+rowtouse+"-organisation", organisation);
		localStorage.setItem("contact-"+rowtouse+"-email", email);
		localStorage.setItem("contact-"+rowtouse+"-job_title", job_title);
		localStorage.setItem("contact-"+rowtouse+"-job_title_other", job_title_other);
		localStorage.setItem("contact-"+rowtouse+"-mobile_phone", mobilephone);
		localStorage.setItem("contact-"+rowtouse+"-pma_workshops", pma_workshops);
		localStorage.setItem("contact-"+rowtouse+"-pma_education", pma_education);
		localStorage.setItem("contact-"+rowtouse+"-notes", notes);
		localStorage.setItem("contact-"+rowtouse+"-attended", attended);
		localStorage.setItem("contact-"+rowtouse+"-status", 0);
		localStorage.setItem("contact-"+rowtouse+"-date_added", d.toUTCString());
		if(location=='0'){
			numrows++;
			localStorage.setItem("numrows", numrows);
			window.location = 'store.html';
		}else{
			window.location = 'admin.html';
		}
		
	
	}else{
		var output = "";
		for(var i=0;i<error.length;i++){
			output += error[i]+"<br>";
		}
		$('#formerror').show();
		$('#formerror').html(output);
	}
	 
}

function getNumNotUploaded(){
	if(numrows>0){
		var count = 0;
		for(var i = 0;i<numrows;i++){
			if(localStorage.getItem("contact-"+i+"-status")==0){
				count++;
			}
		}
		return count;
	}else{
		return 0;
	}
}

function readClientsLocally(){
	
	checkStoredRecords();
	var output = "<table class='backwhite'>";
	output += "<thead><th>Sent to CRM?</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile Phone</th><th>Organisation</th><th>Job Title</th><th>PMA Education</th><th>PMA Workshops</th><th>Notes</th><th>Date Added</th><th>Attended<th></th><th></th></thead>";
	output += "<tbody>";
	
	if(numrows>0){
		for(var i = 0;i<numrows;i++){
			if(localStorage.getItem("contact-"+i+"-status")!=2){
				output += "<tr>";
				output += "<td>";
				if(localStorage.getItem("contact-"+i+"-status")==0){
					output += "No";
				}else{
					output += "Yes";
				}
				output += "</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-first_name")+"</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-last_name")+"</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-email")+"</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-mobile_phone")+"</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-organisation")+"</td>";
				if(localStorage.getItem("contact-"+i+"-job_title")=='Other'){
					output += "<td>"+localStorage.getItem("contact-"+i+"-job_title_other")+"</td>";
				}else{
					output += "<td>"+localStorage.getItem("contact-"+i+"-job_title")+"</td>";
				}
				output += "<td>";
				if(localStorage.getItem("contact-"+i+"-pma_education")==1){
					output += "Yes";
				}else{
					output += "No";
				}
				output += "</td>";
				output += "<td>";
				if(localStorage.getItem("contact-"+i+"-pma_workshops")==1){
					output += "Yes";
				}else{
					output += "No";
				}
				output += "</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-notes")+"</td>";
				output += "<td>"+localStorage.getItem("contact-"+i+"-date_added")+"</td>";
				output += "<td>";
				if(localStorage.getItem("contact-"+i+"-attended")=='0'){
					output += "No";
				}else{
					output += "Yes";
				}
				output += "</td>";
				output += "<td>";
				if(localStorage.getItem("contact-"+i+"-status")==0){
					output += "<i class='fas fa-edit fa-2x edituser' id='edituser-"+i+"'></i>";
				}
				output += "</td>";
				output += "<td>";
				if(localStorage.getItem("contact-"+i+"-status")==0){
					output += "<i class='fas fa-trash fa-2x deleteuser' id='deleteuser-"+i+"'></i>";
				}
				output += "</td>";
				output += "</tr>";
			}
		}
		
		output += "</tbody></table>";
	}else{
		output = "There are no records stored locally";
	}
	
	$('#localrecords').slideDown();
	$('#localrecords').html(output);
	
}

function clearForm(){
	$('#first_name').val('');
	$('#last_name').val('');
	$('#organisation').val('');
	$('#job_title').val('');
	$('#job_title_other').val('');
	$('#job_title_other_row').hide();
	$('#notes').val('');
	$('#pma_education').prop('checked', false);
	$('#pma_workshops').prop('checked', false);
	$('#attended').prop('checked', true);
}

function populateEditContactForm(){
	var contactidtoedit = localStorage.getItem('contactidtoedit');
	
	if($.isNumeric(contactidtoedit) && contactidtoedit>=0){
		$('#first_name').val(localStorage.getItem("contact-"+contactidtoedit+"-first_name"));
		$('#last_name').val(localStorage.getItem("contact-"+contactidtoedit+"-last_name"));
		$('#organisation').val(localStorage.getItem("contact-"+contactidtoedit+"-organisation"));
		$('#email').val(localStorage.getItem("contact-"+contactidtoedit+"-email"));
		$('#job_title_other').val(localStorage.getItem("contact-"+contactidtoedit+"-job_title_other"));
		$('#job_title').val(localStorage.getItem("contact-"+contactidtoedit+"-job_title"));
		$('#mobile_phone').val(localStorage.getItem("contact-"+contactidtoedit+"-mobile_phone"));
		$('#notes').val(localStorage.getItem("contact-"+contactidtoedit+"-notes"));
		if(localStorage.getItem("contact-"+contactidtoedit+"-pma_workshops")=='1'){
			$('#pma_workshops').prop('checked', true);
		}
		if(localStorage.getItem("contact-"+contactidtoedit+"-pma_education")=='1'){
			$('#pma_education').prop('checked', true);
		}
		if(localStorage.getItem("contact-"+contactidtoedit+"-attended")=='1'){
			$('#attended').prop('checked', true);
		}
	}else{
		window.location = 'admin.html';
	}
}

function deleteLocalRecords(){
	
	checkStoredRecords();
	for(var i = 0;i<numrows;i++){
		localStorage.removeItem("contact-"+i+"-first_name");
		localStorage.removeItem("contact-"+i+"-last_name");
		localStorage.removeItem("contact-"+i+"-organisation");
		localStorage.removeItem("contact-"+i+"-email");
		localStorage.removeItem("contact-"+i+"-job_title");
		localStorage.removeItem("contact-"+i+"-job_title_other");
		localStorage.removeItem("contact-"+i+"-mobile_phone");
		localStorage.removeItem("contact-"+i+"-pma_workshops");
		localStorage.removeItem("contact-"+i+"-pma_education");
		localStorage.removeItem("contact-"+i+"-notes");
		localStorage.removeItem("contact-"+i+"-status");
		localStorage.removeItem("contact-"+i+"-attended");
		localStorage.removeItem("contact-"+i+"-date_added");
	}
	
	numrows = 0;
	localStorage.setItem("numrows", 0);
	
	$('#response').slideUp();
	$('#localrecords').slideUp();
	
}

function deleteSingleRecord(rowtodelete){
	
	checkStoredRecords();

	localStorage.removeItem("contact-"+rowtodelete+"-first_name");
	localStorage.removeItem("contact-"+rowtodelete+"-last_name");
	localStorage.removeItem("contact-"+rowtodelete+"-organisation");
	localStorage.removeItem("contact-"+rowtodelete+"-email");
	localStorage.removeItem("contact-"+rowtodelete+"-job_title");
	localStorage.removeItem("contact-"+rowtodelete+"-job_title_other");
	localStorage.removeItem("contact-"+rowtodelete+"-mobile_phone");
	localStorage.removeItem("contact-"+rowtodelete+"-pma_workshops");
	localStorage.removeItem("contact-"+rowtodelete+"-pma_education");
	localStorage.removeItem("contact-"+rowtodelete+"-notes");
	localStorage.removeItem("contact-"+rowtodelete+"-attended");
	localStorage.removeItem("contact-"+rowtodelete+"-date_added");

	localStorage.setItem("contact-"+rowtodelete+"-status", 2);
	
	
}

function sendToCRM(){
	if(apikeyset){
		checkIfWorkshopNeedsCreating();
	}else{
		window.location = "login.html";
	}
}

function checkIfWorkshopNeedsCreating(){
	var workshopid = $('#workshopid').val();
	var formtype = $('#formtype').val();
	var newworkshopname = $('#newworkshopname').val();
	var newworkshopdate = $('#newworkshopdate').val();
	var newworkshopfacilitator = $('#newworkshopfacilitator').val();
	var newworkshophost = $('#newworkshophostlist').val();
	var newworkshopccg = $('#newworkshopccglist').val();
	var newworkshopnhscontact = $('#newworkshopnhscontact').val();
	
	if(formtype=='1' && workshopid=='-1'){
		
		if(newworkshopname!=''){
			
			var data = "apikey="+apikey;
			data += "&action=createworkshop";
			data += "&newworkshopname="+newworkshopname;
			data += "&newworkshopdate="+newworkshopdate;
			data += "&newworkshopfacilitator="+newworkshopfacilitator;
			data += "&newworkshophost="+newworkshophost;
			data += "&newworkshopccg="+newworkshopccg;
			data += "&newworkshopnhscontact="+newworkshopnhscontact;
			
			$.ajax({
				type: "POST",
				url: CRMURL+"/api/api.php",
				data: data, // serializes the form's elements.
				dataType: 'json',
				success: function(response) {
					if(response.success){
						var newoption = "<option value='"+response.workshopid+"'>"+newworkshopname+"</option>";
						$('#workshopid').append(newoption);
						$('#workshopid').val(response.workshopid);
						
						$('#newworkshopname').val('');
						$('#newworkshopdetails').slideUp();
	
						actuallySendToCRM();
					}else{
						alert("Unable to create workshop on the CRM, it may need to be created via the website before records can be uploaded");
					}
				}
			});
		}else{
			alert("Please give the workshop a name");
		}
	}else{
		actuallySendToCRM();
	}
}

function actuallySendToCRM(){
	var conferencename = $('#conferencename').val();
	var formtype = $('#formtype').val();
	var workshopid = $('#workshopid').val();
	
	$("input").removeClass('failedform');
	$('#workshopiderror').hide();
	$('#conferencenameerror').hide();
	
	if(formtype=='0' && conferencename==''){
		$('#conferencenameerror').show();
		$('#conferencename').addClass('failedform');
	}else if(formtype=='1' && workshopid=='0'){
		$('#workshopiderror').show();
		$('#workshopid').addClass('failedform');
	}else{
		$('#conferencenameerror').hide();
		$('#conferencename').removeClass('failedform');
		checkStoredRecords();
		var uploadedsomething = false;
		if(numrows>=0){
			for(var i = 0;i<numrows;i++){
				
				if(localStorage.getItem("contact-"+i+"-status")==0 && localStorage.getItem("contact-"+i+"-attended")==1){
					uploadedsomething = true;
					
					data = "first_name="+localStorage.getItem("contact-"+i+"-first_name");
					data += "&last_name="+localStorage.getItem("contact-"+i+"-last_name");
					data += "&email="+localStorage.getItem("contact-"+i+"-email");
					data += "&mobile_phone="+localStorage.getItem("contact-"+i+"-mobile_phone");
					data += "&organisation="+localStorage.getItem("contact-"+i+"-organisation");
					data += "&job_title="+localStorage.getItem("contact-"+i+"-job_title");
					data += "&job_title_other="+localStorage.getItem("contact-"+i+"-job_title_other");
					data += "&pma_education="+localStorage.getItem("contact-"+i+"-pma_education");
					data += "&pma_workshops="+localStorage.getItem("contact-"+i+"-pma_workshops");
					data += "&date_added="+localStorage.getItem("contact-"+i+"-date_added");
					data += "&notes="+localStorage.getItem("contact-"+i+"-notes");
					data += "&rownum="+i;
					data += "&apikey="+apikey;
					data += "&formtype="+formtype;  //1 for workshop, 0 for conference
					data += "&conferencename="+conferencename;
					data += "&workshopid="+workshopid;
					
					$.ajax({
						type: "POST",
						url: CRMURL+"/api/addprospect-app.php",
						data: data, // serializes the form's elements.
						success: function(response) {
							if(response=='Failure: That api key cannot be found, please log in again'){
								$('#response').slideDown();
								$('#response').html('Your API key has not been found.  Please log in again below');
							}else{
								$('#response').slideDown();
								var splitresponse = response.split(",");
								$('#response').append(splitresponse[1]+' '+splitresponse[2]+' uploaded to the CRM<br>');
								markRecordAsUploaded(splitresponse[0]);
								checkDeleteStatus();
							}
						}
					});
				}
			}
			
		}else{
			$('#response').slideDown();
			$('#response').text("There are no pending uploads for the CRM");
		}
		
		if(!uploadedsomething){
			$('#response').slideDown();
			$('#response').text("There are no pending uploads for the CRM");		
		}
		
		$('#localrecords').hide();
	}
	
}

function markRecordAsUploaded(id){
	localStorage.setItem('contact-'+id+'-status', 5);
}

function checkStoredRecords(){
	if (localStorage.getItem("numrows") !== null) {
		numrows = localStorage.getItem("numrows");
	}else{
		numrows = 0;
	}
}

function checkAPIKey(){
	if (localStorage.getItem("apikeyset") !== null) {
		if(localStorage.getItem("apikeyset")){
			apikeyset = true;
			apikey = localStorage.getItem("apikey");
			full_name = localStorage.getItem("full_name");
		}
	}
	
	if(apikeyset){
		$('#loggedinout').html("Logged in as "+full_name+"  <input type='button' value='Change Login' class='btn btn-primary' onclick='window.location=\"login.html\"' />");
		$('#sendtocrmpara').html("<input type='button' value='Upload Pending records to CRM' class='btn btn-primary' id='uploadtocrm' />");
	}else{
		$('#sendtocrmpara').html("You must log in before uploading details to the CRM");
		$('#loggedinout').html("<input type='button' value='Login' class='btn btn-primary' onclick='window.location=\"login.html\"' />");
	}
	
	checkDeleteStatus();
}

function login(){
	var username = $('#username').val();
	var password = $('#password').val();
	
	var data = "username="+username+"&password="+password;
	
	$.ajax({
		type: "POST",
		url: CRMURL+"/api/app-login.php",
		data: data, // serializes the form's elements.
		dataType: 'json',
		success: function(response) {
			if(response.success){
				console.log(response.apikey, response.full_name);
				//setAPIKey(response.apikey, response.full_name);
				localStorage.setItem('apikey', response.apikey);
				localStorage.setItem('full_name', response.full_name);
				localStorage.setItem('apikeyset', true);
				apikeyset = true;
				window.location='admin.html'; 
			}else{
				$('#response').slideDown();
				$('#response').html(response.message);
			}
		}
	});
}

function getWorkshopList(){
	var data = "apikey="+apikey+"&action=getworkshops";
	
	$.ajax({
		type: "POST",
		url: CRMURL+"/api/api.php",
		data: data, // serializes the form's elements.
		success: function(response) {
			workshops = JSON.parse(response);
			var html = "<option value='0'>Select a workshop</option>";
			html += "<option value='-1'>New workshop</option>";
			$.each( workshops, function( key, workshop ) {
				html += "<option value='"+workshop.id+"'>"+workshop.name+"</option>";
			});
			$('#workshopid').html(html);
			getUploadFormDetails();
		}
	});
}

function getUploadFormDetails(){
	var data = "apikey="+apikey+"&action=getccgs";
	
	$.ajax({
		type: "POST",
		url: CRMURL+"/api/api.php",
		data: data, // serializes the form's elements.
		success: function(response) {
			ccgs = JSON.parse(response);
			var html = "<option value='0'>Select a CCG</option>";
			$.each( ccgs, function( key, ccg ) {
				html += "<option value='"+ccg.id+"'>"+ccg.ccgname+"</option>";
			});
			$('#newworkshopccglist').html(html);
		}
	});
	
	var data2 = "apikey="+apikey+"&action=getusers";
	
	$.ajax({
		type: "POST",
		url: CRMURL+"/api/api.php",
		data: data2, // serializes the form's elements.
		success: function(response) {
			users = JSON.parse(response);
			var html = "<option value='0'>Select a host</option>";
			$.each( users, function( key, user ) {
				html += "<option value='"+user.name+"'>"+user.name+"</option>";
			});
			$('#newworkshophostlist').html(html);
		}
	});
}

function checkDeleteStatus(){
	
	checkStoredRecords();
	
	//disable or enable delete button
	if(getNumNotUploaded()==0){
		//nothing not uploaded, so allow delete
		$("#deletelocal").show();
		$("#deletebuttontext").html("");
	}else{
		$("#deletelocal").hide();
		$("#deletebuttontext").html("You need to upload the records to the CRM before you can delete the local version");
	}
}

function checkConnection(){
	var url = CRMURL+"/api/checkconnection.php"
	var success = false;
	
	$.ajax({
			url: url,
			error: function(){
					// will fire when timeout is reached
					enableDisableWeb(false);
			},
			success: function(response){
				console.log("Connection check: "+response);
				if(response==1){
					enableDisableWeb(true);
				}else{
					enableDisableWeb(false);
				}
			},
			timeout: 3000 // sets timeout to 3 seconds
	});
}

function enableDisableWeb(enable){

	if(!enable){
		$('#sendtocrmpara').hide();
		$('#loggedinout').hide();
		$('#notconnected').show();
	}else{
		$('#sendtocrmpara').show();
		$('#loggedinout').show();
		$('#notconnected').hide();		
	}
}

var apikey = "";
var apikeyset = false;
var full_name;

$(document).ready(function(){
	readyFunction();
	
});

function readyFunction(){
	
	$('#deletelocal').click(function(e){
		$.confirm({
			title: 'Confirm action!',
			content: 'Are you sure you wish to delete all the local records?',
			buttons: {
					confirm: function () {
							deleteLocalRecords();
					},
					cancel: function () {
							//Do nothing
					}
			}
		});
	});
	 
	$(document).on('change', '#formuploadworkshopradio', function(e){
		e.preventDefault();
		if($(this).is(':checked')){
			getWorkshopList();
			$('#uploadworkshopdiv').show();
			$('#uploadconferencediv').hide();
			$('#formtype').val('1');
		}
	});
	 
	$(document).on('change', '#conferenceuploadradio', function(e){
		e.preventDefault();
		if($(this).is(':checked')){
			$('#uploadworkshopdiv').hide();
			$('#uploadconferencediv').show();
			$('#formtype').val('0');
		}
	});
	 
	$(document).on('click', '#submitcontactform', function(e){
		e.preventDefault();
		insertDB('0');
	});
	
	
	$(document).on('click', '#updatecontactform', function(e){
		e.preventDefault();
		insertDB('1');
	});
	
	$('#showlocally').click(function(e){
		e.preventDefault();
		readClientsLocally();
	});
	
	$(document).on('click', '#uploadtocrm', function(e){
		sendToCRM();
	}); 
	
	$(document).on('change', '#job_title', function (e){
		if($(this).val()=='Other'){
			$('#job_title_other_row').show();
		}else{
			$('#job_title_other_row').hide();
		}
	});
	
	$(document).on('change', '#workshopid', function (e){
		if($(this).val()=='-1'){
			$('#newworkshopdetails').show();
		}else{
			$('#newworkshopdetails').hide();
		}
	});
	
	$(document).on('click', '.edituser', function(e){
		var splitid = $(this).attr('id');
		var id = splitid.split("-")[1];
		localStorage.setItem('contactidtoedit', id);
		window.location = 'edit.html';
	});
	
	$(document).on('click', '.deleteuser', function(e){
		var splitid = $(this).attr('id');
		var id = splitid.split("-")[1];
		if(confirm("Are you sure you wish to permanently remove this contact's details")){
			deleteSingleRecord(id);
			window.location.reload();
		}
		
	});
	
	if($('#newworkshopdate').length){
		document.getElementById('newworkshopdate').valueAsDate = new Date();
	}
	
	if($('#updatecontactform').length){
		populateEditContactForm();
	}else{
		//not on the edit page, so reset edit contact id
		localStorage.setItem('contactidtoedit', '-1');
	}
	
	$(document).on('submit', '#login', function(e){
		e.preventDefault();
		login();
	});
	
	$(".select2").select2({
		ajax: {
			url: CRMURL+"/api/api.php",
			dataType: 'json',
			delay: 250,
			data: function (params) {
				return {
					q: params.term, // search term
					action: "searchcontacts",
					apikey: apikey
				};
			},
			processResults: function (data) {
				var results = [];
				$.each(data, function (index, account) {
						results.push({
								id: account.id,
								text: account.name
						});
				});

				return {
						results: results
				};
		}
		},
		minimumInputLength: 3,
		width: '100%'
	});
	
	checkAPIKey();
	
	setInterval(function(){
		checkConnection();
	}, 5000);

}
