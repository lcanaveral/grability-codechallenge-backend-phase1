jQuery(function($) {
    $('body').terminal({
        
        help:function(){
            this.echo("\tavailable commands are:");

        },
        unit_test:function(){
           $('#qunit').toggle();
        },

    }, {
        greetings: 'grability backend developer test, phase 1',
        name: 'grability-codechallenge',
        prompt: 'enter command: ',
        onInit:function(term){
            term.exec('help');
        }
    });
});



/*******************************
************UNIT TEST************
*******************************/
