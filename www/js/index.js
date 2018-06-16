/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var dbVersion = "1.7"; 

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

function insertDB(){
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
	var email = $('#email').val();
	var mobilephone = $('#mobilephone').val();
	
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
	
	console.log(goodform);
	
	if(goodform){
		checkStoredRecords();
		var d = new Date();
		
		localStorage.setItem("contact-"+numrows+"-first_name", first_name);
		localStorage.setItem("contact-"+numrows+"-last_name", last_name);
		localStorage.setItem("contact-"+numrows+"-organisation", organisation);
		localStorage.setItem("contact-"+numrows+"-email", email);
		localStorage.setItem("contact-"+numrows+"-job_title", job_title);
		localStorage.setItem("contact-"+numrows+"-job_title_other", job_title_other);
		localStorage.setItem("contact-"+numrows+"-mobile_phone", mobilephone);
		localStorage.setItem("contact-"+numrows+"-pma_workshops", pma_workshops);
		localStorage.setItem("contact-"+numrows+"-pma_education", pma_education);
		localStorage.setItem("contact-"+numrows+"-notes", notes);
		localStorage.setItem("contact-"+numrows+"-status", 0);
		localStorage.setItem("contact-"+numrows+"-date_added", d.toUTCString());
		
		numrows++;
		localStorage.setItem("numrows", numrows);
		
		window.location = 'store.html';
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
			console.log(localStorage.getItem("contact-"+i+"-status"));
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
	output += "<thead><th>Sent to CRM?</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile Phone</th><th>Organisation</th><th>Job Title</th><th>PMA Education</th><th>PMA Workshops</th><th>Notes</th><th>Date Added</th></thead>";
	output += "<tbody>";
	
	if(numrows>0){
		for(var i = 0;i<numrows;i++){
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
			output += "</tr>";
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
		localStorage.removeItem("contact-"+i+"-date_added");
	}
	
	numrows = 0;
	localStorage.setItem("numrows", 0);
	
	$('#response').slideUp();
	$('#localrecords').slideUp();
	
}

function sendToCRM(){
	if(apikeyset){
		actuallySendToCRM();
	}else{
		window.location = "login.html";
	}
}

function actuallySendToCRM(){
	
	checkStoredRecords();
	var uploadedsomething = false;
	if(numrows>=0){
		for(var i = 0;i<numrows;i++){
			
			if(localStorage.getItem("contact-"+i+"-status")==0){
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
				
				$.ajax({
					type: "POST",
					url: "https://crm.practicemanagersuk.org/api/addprospect-app.php",
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
		$('#sendtocrmparam').html("<input type='button' value='Upload Pending records to CRM' class='btn btn-primary' id='uploadtocrm' />");
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
		url: "https://crm.practicemanagersuk.org/api/app-login.php",
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
	var url = "https://crm.practicemanagersuk.org/api/checkconnection.php"
	var success = false;
	
	$.ajax({
			url: url,
			error: function(){
					// will fire when timeout is reached
					enableDisableWeb(false);
			},
			success: function(response){
				console.log(response);
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
	console.log(enable);
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
	 
	$(document).on('click', '#submitcontactform', function(e){
		e.preventDefault();
		insertDB();
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
	
	$(document).on('submit', '#login', function(e){
		e.preventDefault();
		login();
	});
	
	checkAPIKey();
	
	setInterval(function(){
		checkConnection();
	}, 5000);

}
