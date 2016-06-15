define(['jquery', 'backbone', 'io'], function ($, Backbone, io) {
	return Backbone.View.extend({
		el: 'body',
		events: {
			'click #addlink': 'addLink'
		},
		initialize: function (options) {
			this.socket = io();
			this.socket.on('linkerror', function(msg){
				alert(msg.message);
			});
			this.socket.on('linkdownloaderror', function(msg){
				console.log(msg.message);
			});
			this.socket.on('linkdownloadprogress', function(msg){
				var fsize = $("#"+msg.hash).attr("size");
				$("#"+msg.hash+" #download-progress-label").text(msg.mComplete+" MB/"+fsize+" MB ("+msg.pComplete+"%)");
				$("#"+msg.hash+" .progress-bar").css("width", msg.pComplete+"%");
			});
			this.socket.on('linkadded', function(msg){
				var cHash = msg.hash;
				$("#link-panels").append("<div class='panel panel-default' size='"+msg.filesize+"' id='"+msg.hash+"'><div class='panel-heading'>"+msg.filename+"<button type='button' class='close' data-dismiss='panel'>×</button></div><div class='panel-body'><div class='progress'><div class='progress-bar' style='width: 0%;'></div></div></div><div class='panel-footer'><label for='download-progress-label'>Download:</label><div class='label label-primary' id='download-progress-label'>0 MB/0 MB (0%)</div><label for='upload-progress-label'>Upload:</label><div id='upload-progress-label' class='label label-warning'>0 MB/0 MB (0%)</div><div id='file-links'><span class='label label-success'><a class='share-link'>MEGA Link</a></span><span class='label label-default'><a class='reddit-link'>Post on Reddit</a></span></div></div></div>");
				$("#"+msg.hash+" .close").click(function(){
					socket.emit("deletelink",{hash: $(this).attr("id")});
				});
			});
			this.socket.on('linkdeleted', function(msg){
				$("#"+msg.hash).remove();
			});
			this.socket.on('linkdownloadcomplete', function(msg){
				$("#"+msg.hash+" #download-progress-label").removeClass("label-primary").addClass("label-default");
				$("#"+msg.hash+" .progress-bar").addClass("progress-bar-warning");
			});
			this.socket.on('linkuploaderror', function(msg){
				console.log(msg.message);
			});
			this.socket.on('linkerror', function(msg){
				console.log(msg.message);
			});
			this.socket.on('linkuploadprogress', function(msg){
				var uprogressdata = msg.message.split('#')[1];
				if(typeof uprogressdata !== "undefined")
				{
					var fdetails = uprogressdata.match(/(.*?) \% of (.*?) at /),
					mbc = $("#"+msg.hash+" #download-progress-label").text().match(/(.*?)MB\/(.*?)MB/),
					fcomp = Math.round(fdetails[1])*parseInt(mbc[2])/100;
					$("#"+msg.hash+" #upload-progress-label").text(fcomp+" MB/"+mbc[2]+" MB ("+Math.round(fdetails[1])+"%)");
					$("#"+msg.hash+" .progress-bar").css("width", Math.round(fdetails[1])+"%");
				}
			});
			this.socket.on('linkuploadcomplete', function(msg){
				if(msg.link)
				{
					var link = msg.link.replace(/mega\.nz/, "mega.co.nz"),
					filename = encodeURIComponent(msg.filename);
					$("#"+msg.hash+" #file-links").show();
					$("#"+msg.hash+" .share-link").attr("href",link);
					$("#"+msg.hash+" .reddit-link").attr("href","https://www.reddit.com/r/megalinks/submit?url="+encodeURIComponent(link)+"&title="+filename);
				}
				$("#"+msg.hash+" #upload-progress-label").removeClass("label-warning").addClass("label-default");
				$("#"+msg.hash+" .progress-bar").removeClass("progress-bar-warning").addClass("progress-bar-success");
			});
		},
		addLink: function(){
			this.socket.emit('addlink', { link: $("#link").val() });
			$("#link").val("");
		}
	});
});