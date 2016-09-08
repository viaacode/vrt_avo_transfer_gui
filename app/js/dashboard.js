(function() {
  var charts = [];
  var runningAjaxCalls = [];

  new Vue({
    el: '#dashboard',
    data: {
      counter_media_ids: 0,
      errors: [],
      newBriefing: '',
      briefings: [],
      briefingIds: []
    },
    created: function() { 
      refreshView(this);
    },
    methods: {
      addBriefing: function () {
        var text = this.newBriefing.trim();
        if (text) {
          this.briefings.push({ text: text });
          this.newBriefing = '';
        }
      },
      removeBriefing: function (index) {
        this.briefings.splice(index, 1);
      },
      addInput: function(divName) {
          var newdiv = document.createElement('div');
          newdiv.innerHTML = "<li>Entry " + (this.counter_media_ids + 1) + " <br><input type='text' name='myInputs[]'></li>";
          document.getElementById(divName).appendChild(newdiv);
      }
    }
  });

    // Refresh the whole view
    function refreshView(vueinstance){
      // Read briefings
      runningAjaxCalls.push(ajaxcall("/api/briefings", function(err, result) {
        if(err) { vueinstance.errors.push(err); }
        else {     
          errors = [];
          vueinstance.briefings = result; // For loader (?)
          vueinstance.briefingIds = Object.keys(result);
        }
      }));
    }

})();
