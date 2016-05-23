MapCloud.ProcessDialog = MapCloud.Class(MapCloud.Dialog,{
	maxCount : 15,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);

		this.registerPanelEvent();
	},

	showDialog : function(){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.getJob(GeoBeans.Job.Status.RUNNING,this.maxCount,0);
	},

	registerPanelEvent : function(){
		var dialog = this;
		dialog.panel.find("select").change(function(){
			var value = $(this).val();
			var state = null;
			if(value == "running"){
				state = GeoBeans.Job.Status.RUNNING;
			}else if(value == "finished"){
				state = GeoBeans.Job.Status.FINISHED;
			}else if(value == "canceled"){
				state = GeoBeans.Job.Status.CANCELED;
			}
			if(state != null){
				dialog.getJob(state,dialog.maxCount,0);
			}
		});

		// 页码
		this.panel.find(".pagination li a").click(function(){

		});
	},

	cleanup : function(){
		this.panel.find("select option[value='running']").attr("selected",true);
		this.panel.find(".job-list").empty();
	},
	

	// 获取jobs
	getJob : function(state,maxJobs,offset){
		if(state == null || maxJobs == null || offset == null){
			return;
		}
		gpsManager.getJob(state,maxJobs,offset,this.getJob_callback);
	},

	getJob_callback : function(jobs){
		if(!$.isArray(jobs)){
			return;
		}
		var dialog = MapCloud.process_dialog;
		dialog.showJobList(jobs);
	},

	showJobList : function(jobs){
		var job = null;
		var html = "";
		for(var i = 0; i <jobs.length; ++i){
			job = jobs[i];
			if(job == null){
				continue;
			}
			var oper = job.oper;
			var server = job.server;
			var startTime = job.startTime;
			var endTime = job.endTime;
			html +=  "<div class='row'>"
				+	 "<div class='col-md-3 col-xs-3 text-ellip' title='" + oper + "'>" + oper + "</div>"
				+ 	 "<div class='col-md-3 col-xs-3'>" + server + "</div>"
				+ 	 "<div class='col-md-3 col-xs-3'>" + startTime + "</div>"
				+ 	 "<div class='col-md-3 col-xs-3'>" + endTime + "</div>"
				+ "</div>";
		}
		this.panel.find(".job-list").html(html);
	}
});