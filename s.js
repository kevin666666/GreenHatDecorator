"use strict"
var choice;
var days = [];
var original_contributions = {};
var new_contributions = {};
var year = 0;
var color_table = {};
var color_list = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];

function generate_color_table() {
	var heighest_num = 0;
	$("rect").each(function(index) {
		if(parseInt($(this).attr("data-count")) > heighest_num){
			heighest_num = parseInt($(this).attr("data-count"));
		}
	});	

	var zero = 0
    var one = Math.floor(heighest_num * 0.25 * 1)
    var two = Math.floor(heighest_num * 0.25  * 2)
    var three = Math.floor(heighest_num * 0.25  * 3)
    var four = Math.floor(heighest_num * 0.25  * 4)
	
	color_table[0] = [-1, zero]
	color_table[1] = [zero, one]
	color_table[2] = [one, two]
	color_table[3] = [two, three]
	color_table[4] = [three, four]
}


function cal_contributions() {
	var contributions = 0;
	$("#contribution_num").empty();
	$("rect").each(function(index) {
		contributions += parseInt($(this).attr("data-count"));
	});
	
	$("#contribution_num").html(contributions);
}


function fill_rect() {
	$("rect").each(function(index) {
		var count = parseInt($(this).attr("data-count"));
		var i = 0;
		for(i; i < 5; i++) {
			var small = color_table[i][0];
			var big = color_table[i][1];
			
			if (count >= small && count <= big) {
				$(this).attr("fill",color_list[i]);
				break;
			}
		}
	});
}


function refresh_contribution_table() {
	generate_color_table();
	cal_contributions();
	fill_rect();
}


function click_rect(e) {
	var current_count = parseInt($(this).attr("data-count"));
	var date_string = $(this).attr("data-date");
	var original_count = original_contributions[date_string];
	$("#alert").empty();
	if(1 == e.which){
    //left
		current_count += 1;
		new_contributions[date_string] += 1; 
	}else if(3 == e.which){
		//right
		if (current_count - 1 < original_contributions[date_string]) {
			$("#alert").html("Can't lower than the initial value");
		}else {
			current_count -= 1
			new_contributions[date_string] -= 1; 
		}
    }
	$(this).attr("data-count", current_count);
	refresh_contribution_table();
}

function change_rect_background(){
	console.log("c");
	$("rect").each(function(index) {
		if($(this).attr("fill") == "#ebedf0"){
			$(this).attr("fill","#c6e48b");	
		}
	});	
}

function create_date_document() {
	var filename = "date.txt"
	var txt = "";
	
	$.each(new_contributions, function (k, v) {
       txt += k + ":" + v + "\n";
    })
	
	createTxt(filename, txt);
}

function createTxt(filename, txt) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}


function init_contributions() {
	$("rect").each(function(index) {
		original_contributions[$(this).attr("data-date")] = parseInt($(this).attr("data-count"));
		new_contributions[$(this).attr("data-date")] = 0;
	});
}


function show_contribution_grid() {
	if (choice == 0) {
		year = $("#selected_year").val();
		if(year=="") return 0;
	}else {
		if($("#input_code").val()=="") return 0;
	}
	days = [];
	original_contributions = {};
	new_contributions = {};
	//year = parseInt(find("rect").eq(0).attr("data-date"));
	//console.log(year);
	$("#year").html(year);
	
	generate_contribution_table();
	init_contributions();
	refresh_contribution_table();
	
	//阻止浏览器默认右键点击事件
	$("svg").bind("contextmenu", function(){
		return false;
	})
	$("rect").hover(show_tooltip, hide_tooltip);
	$("rect").bind("mousedown", click_rect);
	$("#change").bind("click",change_rect_background);
	$("#print").bind("click",create_date_document);

	$("#svg").show(200);
	$(".input_area").hide(200);
}

function get_date_num(year, month){
    var d = new Date(year, month, 0);
	//console.log(d);
    return d.getDate();
}


function get_day(year, month, day) {
	var d = new Date(year, month, day);
	//console.log(d);
    return d.getDay();	
}


function generate_contribution_table() {
	$("#svg_code").empty();
	if(choice == 1) {
		$("#svg_code").html($("#input_code").val());
	}else {
		//get the weekday of janurary 1st
		var first_weekday = get_day(year,0,1);
		var padding_days = first_weekday;
		//padding days for last year in order to fill the date grid
		for(var i = 0; i < padding_days; i++) {
			var day = 31 - (padding_days-1) + i;
			var padding_date = String(year-1) + "-" + String("12") + "-" + String(day);
			days.push(padding_date);
		}
		//selected year for date grid
		for (var i = 1; i < 13; i++) {
			for (var k = 1; k < get_date_num(year,i)+1; k++) {
				var padding_date = String(year) + "-" + String(i) + "-" + String(k);
				days.push(padding_date);	
			}
		}
		
		var html_content = [];
		html_content.push("<svg width=\"722\" height=\"112\" class=\"js-calendar-graph-svg\">");
		html_content.push("<g transform=\"translate(10, 20)\">");
		
		for(var i=0;i<days.length;i++){
			var weekday = new Date(days[i]).getDay();
			
			if(weekday == 0) {
				html_content.push("<g transform=\"translate("+ String(14*Math.floor(i/7)) + ", 0)\">")
			}
			
			html_content.push("<rect class=\"day\" width=\"10\" height=\"10\" x=\""+ String(14-Math.floor(i/7)) + "\" y=\"" + String(13*weekday) + "\" fill=\"#ebedf0\" data-count=\"0\" data-date=\"" + days[i] + "\"></rect>")

			if(weekday == 6) {
				html_content.push("</g>");
			}
		}
		
		html_content.push("</g>");
		
		html_content.push("<text x=\"27\" y=\"-7\" class=\"month\">Jan</text>");
		html_content.push("<text x=\"79\" y=\"-7\" class=\"month\">Feb</text>");
		html_content.push("<text x=\"131\" y=\"-7\" class=\"month\">Mar</text>");
		html_content.push("<text x=\"196\" y=\"-7\" class=\"month\">Apr</text>");
		html_content.push("<text x=\"248\" y=\"-7\" class=\"month\">May</text>");
		html_content.push("<text x=\"300\" y=\"-7\" class=\"month\">Jun</text>");
		html_content.push("<text x=\"365\" y=\"-7\" class=\"month\">Jul</text>");
		html_content.push("<text x=\"417\" y=\"-7\" class=\"month\">Aug</text>");
		html_content.push("<text x=\"469\" y=\"-7\" class=\"month\">Sep</text>");
		html_content.push("<text x=\"534\" y=\"-7\" class=\"month\">Oct</text>");
		html_content.push("<text x=\"586\" y=\"-7\" class=\"month\">Nov</text>");
		html_content.push("<text x=\"638\" y=\"-7\" class=\"month\">Dec</text>");
		
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"8\" style=\"display: none;\">Sun</text>");
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"22\">Mon</text>");
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"32\" style=\"display: none;\">Tue</text>");
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"48\">Wed</text>");
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"57\" style=\"display: none;\">Thu</text>");
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"73\">Fri</text>");
		html_content.push("<text text-anchor=\"start\" class=\"wday\" dx=\"-10\" dy=\"81\" style=\"display: none;\">Sat</text>");
		
		html_content.push("</svg>");
		//console.log(html_content)
		var f_s = "";
		for(var i=0;i<html_content.length;i++){
			f_s += html_content[i];
		}
		
		$("#svg_code").html(f_s);
	}
}

function show_tooltip(e) {
	$("#tooltip").empty();
	$("#tooltip").css({"background-color":"black"});
	$("#tooltip").html($(this).attr("data-count") + " contributions on " + $(this).attr("data-date"));
}

function hide_tooltip(e) {
	$("#tooltip").css({"background-color":"white"});
	$("#tooltip").empty();
}

$(function() {
	$("#c_1").bind("click", function() {choice=0;$("#choice_area").hide(200);$("#blank_area").show(200);});
	$("#c_2").bind("click", function() {choice=1;$("#choice_area").hide(200);$("#paste_area").show(200);});
	$(".display").bind("click",show_contribution_grid);
});
