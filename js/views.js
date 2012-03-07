var spinnerOptions = {
    lines: 12, // The number of lines to draw
    length: 1, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false // Whether to use hardware acceleration
};

var CalendarListSelectOptionItem = Backbone.View.extend({
    tagName: 'option',
    initialize: function() {
    },
    render: function() {
        $(this.el).html(this.model.getTitle());
		$(this.el).attr("value", this.model.cid);
        return this;
    }
});

var RangeChangeBtns = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {
        this.model.bind('change:range', this.update, this);
    },
	update: function(model, value) {
		$(this.el).css("display", "block");
		switch (value) {
			case "day":
				$(this.el).html($.tmpl("rangeChangeBtns", {to:"to today"}));
				break;
			case "week":
				$(this.el).html($.tmpl("rangeChangeBtns", {to:"to this week"}));
				break;
			case "month":
				$(this.el).html($.tmpl("rangeChangeBtns", {to:"to this month"}));
				break;
			case "year":
				$(this.el).html($.tmpl("rangeChangeBtns", {to:"to this year"}));
				break;
			case "total":
				$(this.el).html('');
				break;
		}
	},
    render: function() {
    	$(this.el).css("display", "none");
    	$(this.el).css("text-align", "center");
    	$(this.el).addClass("btn-group");
        $(this.el).html($.tmpl("rangeChangeBtns", {to:""}));
        return this;
    }
});



var CalendarSelectList = Backbone.View.extend({
    tagName: 'select',

    events: {
        'change': 'removePleaseSelect'
    },

	removePleaseSelect: function(evt) {
		$(this.el).find("#pleaseSelect").remove();
	},

    initialize: function() {
    },

	updateView: function(model, value) {
		$(this.el).val(value.cid);	
	},

    render: function() {
    	$(this.el).css("display", "none");
    	$(this.el).css("width", "100%");
		$(this.el).attr("id", "calList");
		$(this.el).append("<option value='' selected='selected' id='pleaseSelect'>Please select calendar</option>");
        return this;
    },

	calendarsReceived: function(collection) {
		$(this.el).css("display", "block");
		_(collection.models).each(function(item) {
		    var optionItem = new CalendarListSelectOptionItem({
		        model: item
		    });

		    $(this.el).append(optionItem.render().el);
		},
		this);
	}
});

var Output = Backbone.View.extend({
    tagName: 'div',
	
    initialize: function() {
        console.dir(this.model);
    },

	updateView: function(data) {
		//console.log(data);
        var hours = data.hours;
		var rangeObj = data.range;
        var html = "<div class='hours'>" + hours + "h</div><div class='hoursrange'>";

        if (rangeObj.type === "day") {
            html += rangeObj.start.toString('dddd, MMMM d, yyyy');
        } else if (rangeObj.type === "week") {
            //html += rangeObj.start.toString('dddd, MMMM d, yyyy') + " - " + rangeObj.end.toString('dddd, MMMM d, yyyy');
            html += rangeObj.start.toString('dd.MM.yyyy') + " - " + rangeObj.end.toString('dd.MM.yyyy');
        } else if (rangeObj.type === "month") {
            html += rangeObj.start.toString('MMMM, yyyy');
        } else if (rangeObj.type === "year") {
            html += rangeObj.start.toString('dddd, MMMM d, yyyy') + " - " + rangeObj.end.toString('dddd, MMMM d, yyyy');
        }

        html += "</div>"

        $(this.el).html(html);
	},

    render: function() {
        return this;
    },

    showSpinner: function() {
        var spinnerContainer = $("<div id='spinnerContainer' style='position:relative; left:150px; top:40px;'></div>");
        var spinner = spinnerContainer.spin(spinnerOptions);
        $(this.el).html(spinnerContainer);    	
    }
});

var RangeSelectList = Backbone.View.extend({
    tagName: 'div',
	
    initialize: function() {
        this.model.bind('change:range', this.update, this);
    },

	update: function(model, value) {
		if(!value) return;
		$(this.el).css("display", "block");
		$(this.el).find("#rangeList").val(value);

		/*
		if(value === "week") {
			$(this.el).append("<div id='weekType'>Week start on <input type='radio' name='weektype' value='sunday'>Sunday</input><input type='radio' name='weektype' value='monday' checked>Monday</input></div>");
		}
		*/
	},

    render: function() {
    	$(this.el).css("display", "none");
    	$(this.el).append("<select id='rangeList' style='width:100%'><option value='day'>Day</option><option value='week'>Week</option><option value='month'>Month</option></select>")
        return this;
    }
});

var CalendarPrevNextBtn = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {
    },
	updateView: function(model, value) {
		if(value) {
			$(this.el).css("color", "black");
		} else {
			$(this.el).css("color", "grey");
		}
	},
    render: function() {
        $(this.el).html(this.options.label);
		$(this.el).attr("id", this.options.label);
		$(this.el).attr("class", "btn small");
		$(this.el).attr("href", "");
        return this;
    }
});