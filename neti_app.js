Games = new Meteor.Collection('games');
GameConfigs = new Meteor.Collection('gameConfigs');
questionBanks = new Meteor.Collection('questionBanks');
dynamicQuestionBanks = new Meteor.Collection('dynamicQuestionBanks');


if (Meteor.isClient) {
    var dynamicFieldCount = 0;
    var dynamicOptionCount = 0;
    var dynamicQuestionCount = 0;
    var dynamicOptionCountNew = 0;
    var correct_option1, correct_option2;
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

            this.route('upload_questions_dynamic',{
                path: "/upload_questions_dynamic",
                template: "uploadQuestionsDynamic"
            });


//            New Starts
            this.route('upload_questions_dynamic_new',{
                path: "/upload_questions_dynamic_new",
                template: "uploadQuestionsDynamicNew"
            });

            this.route('showQBNew', {
                // matches: '/posts/1'
                path: '/show_qb_new/:_id',
                template: "showQBNew",
                data: function() {
                    //console.log("show_game_config :- " + this.params._id);
                    return dynamicQuestionBanks.findOne(this.params._id);
                }
            });

            this.route('questionBankShowNew', {
                // matches: '/posts/1'
                path: '/question_bank_show_new/:_id',
                template: "questionBank_new",
                data: function() { return dynamicQuestionBanks.findOne(this.params._id); }
            });

//            New Ends

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

    Template.questionBank.correctOptionIs = function (correctOptionIs) {
        console.log(this.correct);
        return this.correct === correctOptionIs;
    };

    Template.uploadQuestionsDynamic.events({
        'click #add_options_btn': function(event, template){
            //console.log(dynamicFieldCount);
            dynamicOptions = UI.renderWithData(Template.dynamicOptions,{id:dynamicOptionCount});
            UI.insert(dynamicOptions, $("#dynamic_option_block")[0]);
            return dynamicOptionCount = dynamicOptionCount + 1;
        },

        'submit form': function (event, template) {
            event.preventDefault();
            question_bank_name_dynamic = $(event.currentTarget).find("#question_bank_name_dynamic").val();
            dynamic_question_name = $(event.currentTarget).find("#dynamic_question_name").val();
            dynamic_correct_option_key = $(event.currentTarget).find("#dynamic_correct_option_key").val();
            console.log(question_bank_name_dynamic);
            console.log(dynamic_question_name);
            console.log(dynamic_correct_option_key);

            var dynamicOptionArray = [];
            var key_field, val_field, key, val;
            var questionArray = [];

            var questionHash =
            {
                "name" : dynamic_question_name,
                "correct" : dynamic_correct_option_key
            };

            var jsonVariable = {};

            $('.dynamic_options').each(function(df_index, df) {
                //console.log($(df).find("input[type=text]").length);
                key_field = $(df).find("input[type=text]")[0];
                val_field = $(df).find("input[type=text]")[1];
                key = $(key_field).val();
                val = $(val_field).val();

                console.log("key :- " + key + ", val :- " + val);
                //questionHash.push({key: "opt"+key,value : val});

                jsonVariable['opt'+ key] = val;


            });
            console.log("jsonVariable :- " + jsonVariable)
            console.log("jsonVariable :- " + jsonVariable[0].opta);
//            console.log("------ dynamicFieldArray ------");
//            $.each(dynamicOptionArray, function( index, value ) {
//                console.log("key :- " + dynamicOptionArray[index].key + ", val :- " + dynamicOptionArray[index].value);
//            });




            //questionBanks.insert({name:question_bank_name_dynamic, questions:[dynamicOptionArray]})

        }

    });

    Template.uploadQuestionsDynamicNew.events({
        'submit form': function (event, template) {
            event.preventDefault();
            question_bank_name_new = $(event.currentTarget).find("#question_bank_name_new").val();
            dynamicQuestionBanks.insert({name:question_bank_name_new});
        }
    });

    Template.showQBNew.events({
        'click #add_question_new': function(event, template){
            //console.log(dynamicFieldCount);
            dynamicQuestion = UI.renderWithData(Template.dynamicQuestionNew,{id:dynamicQuestionCount});
            UI.insert(dynamicQuestion, $("#dynamic_question_block_new")[0]);
            return dynamicQuestionCount = dynamicQuestionCount + 1;
        },

        'submit form': function (event, template) {
            event.preventDefault();
            qb_id_new = template.find("input[name=qb_id_new]").value;
            console.log("s "  + qb_id_new);

            question_name_new = $(event.currentTarget).find("#dynamic_question_name_new").val();
            dynamic_correct_option_new = $(event.currentTarget).find("#dynamic_correct_option_new").val();
            console.log("question_name_new :- " + question_name_new);

            var optionsnewArray = [];
            $('#dynamic_options_block_new').find("input[type=text]").each(function(df_index, df) {
                //optionsnewArray.push($(df).val())
                optionsnewArray.push({
                    name : $(df).val()
                });
            });
            console.log(optionsnewArray);

            console.log("------ optionsnewArray ------");
            $.each(optionsnewArray, function( index, value ) {
                console.log("key :- " + optionsnewArray[index]);
            });

            dynamicQuestionBanks.update( { _id: qb_id_new},
                { $set: {
                    question:[ {
                        name: question_name_new,
                        correct_option: dynamic_correct_option_new,
                        options: optionsnewArray
                    }]
                }
                }
            );
        }
    });

    Template.dynamicQuestionNew.events({
        'click #add_options_new': function(event, template){
            //console.log(dynamicFieldCount);
            dynamicOptionNew = UI.renderWithData(Template.dynamicOptionNew,{id:dynamicOptionCountNew});
            UI.insert(dynamicOptionNew, $("#dynamic_options_block_new")[0]);
            return dynamicOptionCountNew = dynamicOptionCountNew + 1;
        }
    });

    Template.questionBank_new.correctOptionNewIs = function (correctOptionNewIs) {
        //console.log("correct option " + this.correct_option + ", options :- " + this.options.length);

        for(var i=0; i<this.options.length; i++){
            //console.log("this.correct_option :- " + this.correct_option);
            //console.log("this.options[i] :- " + this.options[i].name);

            if (this.correct_option==this.options[i].name){
                correct_option1 = this.options[i].name
            }
        }
        console.log("correct_option1 :- " + correct_option1);
        return correct_option1;
        //return this.name === correctOptionNewIs;
    };

    Template.questionBank_new.checkcorrectOptionNewIs = function (checkcorrectOptionNewIs) {
        //console.log("option " + this.name);
        //console.log("correct_option " + correct_option1);

        if (this.name == correct_option1){
            correct_option2 = this.name;
        }
        console.log("correct_option2 :- " + correct_option2);
        return correct_option2;
    };




}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
