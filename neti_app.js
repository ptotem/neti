Games = new Meteor.Collection('games');
GameConfigs = new Meteor.Collection('gameConfigs');
questionBanks = new Meteor.Collection('questionBanks');


if (Meteor.isClient) {
    var dynamicFieldCount = 0;
    Meteor.startup(function () {
        Router.map(function(){
            this.route('welcome', {path: '/'});

            this.route('new_game',{
                path: "/games/new",
                template: "createNewGame"
            });

            this.route('games_list',{
                path: "/games_list",
                template: "games_list"
            });

            this.route('gameShow', {
                // matches: '/posts/1'
                path: '/game/:_id',
                template: "game",
                data: function() { return Games.findOne(this.params._id); }
            });

            this.route('gameConfigForm', {
                // matches: '/posts/1'
                path: '/game_config/game/:_id',
                template: "gameConfigForm",
                data: function() {
                    //console.log(this.params._id);
                    return Games.findOne(this.params._id);
                }
            });

            this.route('showGameConfig', {
                // matches: '/posts/1'
                path: '/show_game_config/:_id',
                template: "showGameConfig",
                data: function() {
                    //console.log("show_game_config :- " + this.params._id);
                    return Games.findOne(this.params._id);
                }
            });

            this.route('upload_questions',{
                path: "/upload_questions",
                template: "uploadQuestions"
            });

            this.route('question_banks_list',{
                path: "/question_banks_list",
                template: "question_banks_list"
            });

            this.route('questionBankShow', {
                // matches: '/posts/1'
                path: '/question_bank/:_id',
                template: "questionBank",
                data: function() { return questionBanks.findOne(this.params._id); }
            });

        });
    });

    Template.welcome.greeting = function () {
    return "Welcome to neti app.";
  };

    Template.createNewGame.events({
        'submit form': function (event, template) {
            //alert(Meteor.Router.page());
            event.preventDefault();
            game_name = template.find("input[name=game_name]");
            no_of_rounds = template.find("input[name=no_of_rounds]");
            var data = {
                name: game_name.value
            };
            Games.insert(data, function(err) { /* handle error */ });

//            var data2 = {
//                name: game_name.value,
//                gameConfig: {
//                    fixedParameter: {
//                        round: no_of_rounds.value
//                    }
//                }
//            };
            //Games.insert(data2, function(err) { /* handle error */ });
            //db.games.insert( { name: "Game 05", gameConfig: { fixedParameter:{ round: 2} } } );
            //Router.go('games_list');
            Router.go('welcome');
        },

        'click #get_game_data_btn': function(event, template){
             //alert(template.find("input[name=no_of_rounds]").value);
            //alert("No. of Games :- " + Games.find().count());
            //alert("Last Game :- " + ((Games.find()).skip(Games.find().count() - 1)));
        }

    });

    Template.games_list.games = function () {
        return Games.find().fetch();
    };

    Template.gameConfigForm.events({
        'click #add_config_btn': function(event, template){
            //console.log(dynamicFieldCount);
            dynamicFields = UI.renderWithData(Template.dynamicParameterFields,{id:dynamicFieldCount});
            UI.insert(dynamicFields, $("#dynamic_config_block")[0]);
            return dynamicFieldCount = dynamicFieldCount + 1;
        },

        'submit form': function (event, template) {
            event.preventDefault();
            game_id = template.find("input[name=game_id]").value;
            console.log("game_id :- " + game_id);
            no_of_rounds = template.find("input[name=no_of_rounds]");
            //console.log(template.find("input[type=text]").length);

            Games.update( { _id: game_id },
                { $set: {
                    fixedParameter: {
                        rounds: no_of_rounds.value
                    }
                }
                }
            );

            var dynamicFieldArray = [];
            var key_field, val_field, key, val;
            $('.dynamic_fields').each(function(df_index, df) {
                //console.log($(df).find("input[type=text]").length);
                key_field = $(df).find("input[type=text]")[0];
                val_field = $(df).find("input[type=text]")[1];
                key = $(key_field).val();
                val = $(val_field).val();

                //console.log("key :- " + key + ", val :- " + val);
                dynamicFieldArray.push({
                    key : key,
                    value : val
                });
            });

            console.log("------ dynamicFieldArray ------");
            $.each(dynamicFieldArray, function( index, value ) {
                console.log("key :- " + dynamicFieldArray[index].key + ", val :- " + dynamicFieldArray[index].value);
            });

            Games.update( { _id: game_id },
                { $set: {
                    dynamicParameter: {
                        dynamicFieldArray: dynamicFieldArray
                    }
                }
                }
            );

            //var game = Games.findOne(game_id);

            Router.go('/show_game_config/'+game_id);
        }
    });

    Template.uploadQuestions.events({
        'submit form': function (event, template) {
            event.preventDefault();
            question_bank_name = $(event.currentTarget).find("#question_bank_name").val();
            listOfQuestions =  $(event.currentTarget).find("#list_of_questions").val();
            console.log("textarea val (listOfQuestions) :- " + listOfQuestions);
            questionlist = JSON.parse(listOfQuestions);

            //console.log("questionlist len :- " + questionlist.length);
            //$.each(questionlist, function( index, value ) {
                //console.log("name :- " + questionlist[index].name + ", opta :- " + questionlist[index].opta);
            //});
            questionBanks.insert({name:question_bank_name,questions:questionlist})

        }
    });

    Template.question_banks_list.questionBanks = function () {
        return questionBanks.find().fetch();
    };

    Template.questionBank.helpers({
        rsvpButtonTemplate: function(rsvp) {
            switch(rsvp){
                case 'yes':   return Template.buttonYes;
                case 'maybe': return Template.buttonMaybe;
                case 'no':    return Template.buttonNo;
                case 'none':  return Template.buttonNone;
            }
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
