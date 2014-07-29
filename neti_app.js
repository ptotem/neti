
Games = new Meteor.Collection('games');
GameConfigs = new Meteor.Collection('gameConfigs');
questionBanks = new Meteor.Collection('questionBanks');
dynamicQuestionBanks = new Meteor.Collection('dynamicQuestionBanks');
userAnswers = new Meteor.Collection('userAnswers');


if (Meteor.isClient) {

//small js function to covert any form to a json objects with keys as 'name' of input field and 'value' as what users enter!
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.fn.swapClass = function (a, b) {
        $(this).removeClass(a).addClass(b)
    }

    trimInput = function(value) {
        return value.replace(/^\s*|\s*$/g, '');
    };

    isNotEmpty = function(value) {
        if (value && value !== ''){
            return true;
        }
        Session.set('alert', 'Please fill in all required fields.');
        return false;
    };

    isEmail = function(value) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(value)) {
            return true;
        }
        Session.set('alert', 'Please enter a valid email address.');
        return false;
    };

    isValidPassword = function(password) {
        if (password.length < 6) {
            Session.set('alert', 'Your password should be 6 characters or longer.');
            return false;
        }
        return true;
    };

    areValidPasswords = function(password, confirm) {
        if (!isValidPassword(password)) {
            return false;
        }
        if (password !== confirm) {
            Session.set('alert', 'Your two passwords are not equivalent.');
            return false;
        }
        return true;
    };

    var dynamicFieldCount = 0;
    var dynamicOptionCount = 0;
    var dynamicQuestionCount = 0;
    var dynamicOptionCountNew = 0;
    var correct_option1, correct_option2;
    var key, keys = [];
    var my_computed_opt;
    var optionsKeysArray = [];
    var questionKeysArray = [];
    var totalQuestArray = [];
    var totalOptsArray = [];
    var totalQuestOptsArray = [];
    var keysArray = [];

    Meteor.startup(function () {
        Router.map(function(){
            this.route('welcome', {path: '/'});
            + this.route('signUpForm', {path: '/'});
// Routes for Create New Game:
            this.route('new_game',{
                path: "/games/new",
                template: "createNewGame"
            });

// Routes for Show Game List:
            this.route('games_list',{
                path: "/games_list",
                template: "games_list"
            });

//  Routes for Start Game Page:
            this.route('gameShow', {
                // matches: '/posts/1'
                path: '/game/:_id',
                template: "game",
                data: function() { return Games.findOne(this.params._id); }
            });

// Routes for Game Config Form:
            this.route('gameConfigForm', {
                // matches: '/posts/1'
                path: '/game_config/game/:_id',
                template: "gameConfigForm",
                data: function() {
                    //console.log(this.params._id);
                    return Games.findOne(this.params._id);
                }
            });

// Routes for Show Game Config Form:
            this.route('showGameConfig', {
                // matches: '/posts/1'
                path: '/show_game_config/:_id',
                template: "showGameConfig",
                data: function() {
                    //console.log("show_game_config :- " + this.params._id);
                    return Games.findOne(this.params._id);
                }
            });

// Routes for Upload Questions Form:
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

    Template.overlayBody.rendered = function(){
        if (!this.rendered){
        }
        var count = document.getElementById('timedata1').text;
        alert(count);
        var t=document.getElementById("showtime").innerHtml;
        alert(t);
    };

// For New GameData Entry

    Template.createNewGame.events({
        'submit form': function (event, template) {
            //alert(Meteor.Router.page());
            event.preventDefault();
            game_name = template.find("input[name=game_name]");
            no_of_rounds = template.find("input[name=no_of_rounds]");
//            time=template.find("input[name=time]");
            var data = {
                name: game_name.value

            };
            Games.insert(data, function(err) { /* handle error */ });

//            var data2 = {
//                name: game_name.value,
////                rrp:no_of_rounds.value,
//                gameConfig: {
//                    fixedParameter: {
//                        round: no_of_rounds.value,
//                        time_each_round: time.value
//
//                    }
//                }
//            };
//            Games.insert(data2, function(err) { /* handle error */ });
//            db.games.insert( { name: "Game 05", gameConfig: { fixedParameter:{ round: 2} } } );
            Router.go('games_list');
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

    Template.gameConfigForm.qbs = function(){
        return questionBanks.find().fetch();
    };

    Template.showGameConfig.qb = function(){
        var this_game_id = this._id;
        if (this_game_id!=undefined){
            var this_game = Games.findOne({_id:this_game_id});
            var this_game_qb = Games.findOne({_id:this_game_id}).qb_id;
            console.log("this_game_qb :- " + this_game_qb);
            return questionBanks.findOne({_id:this_game_qb});
        }
    };

// Set Session in game
    Template.game.rendered = function(){
        console.log(this.data._id);
        Session.set("game_id",this.data._id)
        if (!this.rendered){
            console.log("set session");
            this.rendered = true;
        }

    };

    Template.showGameConfig.rendered = function(){
        console.log(Session.get("game_id"));
        if (!this.rendered){
            $("#start_timer").trigger('click');
            this.rendered = true;
        }
    };


    Template.showGameConfig.events({
        'submit form': function (event, template) {
            //alert(Meteor.Router.page());
            event.preventDefault();
            var each_question = $(event.currentTarget).find('.question-block').find('.question');
            var count = document.getElementById('timedata1').value;
            console.log(count);
            var this_game_id = $(event.currentTarget).find('#this_game_id').val();
            var this_game_qb_id = $(event.currentTarget).find('#this_game_qb_id').val();
//            var qw= $(event.currentTarget).find('#this_game_qb_id').val();
            var question, selected_ans;
            var quest_ans_array = [];
            var user_id = Meteor.userId();
            $(each_question).each(function(q_index, qf) {
                //selected_qb_id = $("#game_config_form").find("#game_qb_select option:selected").val();
                question = $(qf).attr('id').toString().split("_")[1];
                //console.log("question :- " + question);
                selected_ans = $(qf).find('.options-list').find(".option-class:checked").val();
                if (selected_ans===undefined){
                    quest_ans_array.push({question:question, answer:""});
                }
                else{
                    quest_ans_array.push({question:question, answer:selected_ans});
                }

            });


//            console.log("------ quest_ans_array ------");
//            $.each(quest_ans_array, function( index, value ) {
//                console.log("question :- " + quest_ans_array[index].question + ", answer :- " + quest_ans_array[index].answer);
//            });
            var answered = userAnswers.findOne({user_id:user_id, game_id:this_game_id, qb_id:this_game_qb_id});
            if (answered==undefined){
                console.log("create");
                userAnswers.insert({user_id:user_id, game_id:this_game_id, qb_id:this_game_qb_id, quest_ans:quest_ans_array});
            }
            else{
                console.log("update");
                console.log(answered._id);
//                userAnswers.update( { _id:answered._id, user_id: user_id, game_id:this_game_id, qb_id:this_game_qb_id },
//                                    { $set: {
//                                                quest_ans:quest_ans_array
//                                            }
//                                    }
//                                  );
                userAnswers.update( { _id:answered._id },
                    { $set: {
                        quest_ans:quest_ans_array
                    }
                    }
                );
            }




            //Router.go("/games_list");
        },

        'click #start_timer': function(event, template){
            console.log("on click start tmer");
            console.log(Session.get("game_id"));
            var Data=Games.findOne({_id :Session.get("game_id")});
//            console.log(Data);
            var time=Data.fixedParameter.time;
            var count = time;
//            console.log(count);
            var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
            function timer()
            {
                //console.log("count in timer() :- " + count);
                count=count-1;
                if (count <= 0)
                {
                    clearInterval(counter);
                    //counter ended, do something here
                    alert("Game Over");
                    return;
                }
            }

        }
    });


    Template.signUpForm.events({
        'submit #register': function(e) {
            e.preventDefault()
            var newUser;
            newUser = $("#register").serializeObject();
            console.log(newUser)
            Accounts.createUser(newUser, function(err) {
                if (err) {
                    console.log(err);
                }
//                return Router.go("/games_list");
                return Router.go("/");
            });
            return false;

        }
    });

    Template.signInForm.events({
        'submit #login': function(e, t) {
            e.preventDefault();

            var signInForm = $(e.currentTarget),
            //email = trimInput(signInForm.find('.email').val().toLowerCase()),
                email = signInForm.find("input[name=email]").val(),
            //password = signInForm.find('.password').val();
                password = signInForm.find("input[name=password]").val();

            //console.log("email :- " + email + ", password :- " + password);
            //if (isNotEmpty(email) && isEmail(email) && isNotEmpty(password) && isValidPassword(password)) {
            Meteor.loginWithPassword(email, password, function(err) {
                if (err) {
                    Session.set('alert', 'We\'re sorry but these credentials are not valid.');
                } else {
                    console.log("correct");
                    Router.go("/games_list");
                    Session.set('alert', 'Welcome back New Meteorite!');
                }
            });
            //}

            return false;
        }
    });

// Enter data into Game Config

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
            selected_qb_id = $("#game_config_form").find("#game_qb_select option:selected").val();
//            console.log("game_id :- " + game_id);
//            console.log("selected_qb_id :- " + selected_qb_id);
            no_of_rounds = template.find("input[name=no_of_rounds]");
            time = template.find("input[name=time]");
//            Games.update( { _id: game_id },
//                { $set: {
////
//                    qb_id: selected_qb_id,
////
//                    fixedParameter: {
//                        rounds: no_of_rounds.value,
//                        time: time.value
//                    }
//                }
//                }
//            );
            var keyArray=[];
            var valueArray=[];
            var dynamicFieldArray = [];
            var key_field, val_field, key, val;
            $('.dynamic_fields').each(function(df_index, df) {
                //console.log($(df).find("input[type=text]").length);
                key_field = $(df).find("input[type=text]")[0];
                val_field = $(df).find("input[type=text]")[1];
                key = $(key_field).val();
                val = $(val_field).val();
                keyArray.push(

                    key
                )
                valueArray.push(
                    val
                )
            });
// Validate Key Value

            var j=1;
            for(var i=0;i<keyArray.length;i++)
            {
                if(keyArray[i]==keyArray[j])
                {
                    alert("Enter Different key");
//                    Router.go('/game_config/game/'+game_id);
                    break;
                }

               else
                {
                    Games.update( { _id: game_id },
                        { $set: {
//
                            qb_id: selected_qb_id,
//
                            fixedParameter: {
                                rounds: no_of_rounds.value,
                                time: time.value
                            }
                        }
                        }
                    );
                    for(var i=0 ;i<=keyArray.length;i++)
                    {
                        var fieldname = keyArray[i]
                        var name = valueArray[i]
                        var $set = {};
                        $set[fieldname] = name;
                        Games.update({ _id: game_id }, { $set: $set });
                    }



                    Router.go('/show_game_config/'+game_id);
                }
                }
                j++;
            }

//     }
// Dynamic Field Name in Games Collections


    });

    Template.uploadQuestions.events({
        'submit form': function (event, template) {
            event.preventDefault();
            question_bank_name = $(event.currentTarget).find("#question_bank_name").val();
            listOfQuestions =  $(event.currentTarget).find("#list_of_questions").val();
            //console.log("textarea val (listOfQuestions) :- " + listOfQuestions);
            questionlist = JSON.parse(listOfQuestions);
            //console.log("----------------- parsed JSON -----------------");
            //console.log("questionlist :- " + questionlist);
            //NEW STARTING FROM HERE
//            console.log("questionlist len :- " + questionlist.length);
//            //questionlist = JSON.stringify(questionlist);
//            //console.log("after stringify");
//
//            var getKeys = function(arr) {
//
//                for (i=0; i<arr.length; i++) {
//                    for (key in arr[i]) {
//                        keys.push(key);
//                    }
//                }
//                return keys;
//            };
//
//            getKeys(questionlist); // => ["A", "B", "C", "D", "E", "F"]
//            //console.log(getKeys(questionlist));
//
//
//
//            var unique_keys = jQuery.unique(keys);
//            console.log("unique_keys :- " + unique_keys);
//
//            $.each(unique_keys, function( index, value ) {
//                //console.log("value :- " + value);
//                if (value=="name"){
//                    questionKeysArray.push(value)
//                }
//                else{
//                    optionsKeysArray.push(value)
//                }
//            });
//
//            var opt_name, isCorrectVal;
//            $.each(questionlist, function( index, value ) {
//                for(var h=0; h<questionKeysArray.length; h++){
//                    console.log("name :- "+ questionlist[index][questionKeysArray[h]]);
//                    totalQuestArray.push({name:questionlist[index][questionKeysArray[h]]})
//                }
//                for(var v=0; v<optionsKeysArray.length; v++){
//                    //console.log("opt"+(v+1)+ " :- " + questionlist[index][optionsKeysArray[v]]);
//                    opt_name = questionlist[index][optionsKeysArray[v]].split(',')[0];
//                    isCorrectVal = questionlist[index][optionsKeysArray[v]].split(', ')[1];
//                    console.log("opt_name :- " + opt_name + ", isCorrectVal :- " + isCorrectVal);
//                    totalOptsArray.push({options:[{val:opt_name, isCorrect:isCorrectVal}]})
//                }
//            });
//
//            console.log("----totalQuestArray-----");
//            $.each(totalQuestArray, function( index, value ) {
//                console.log("totalQuestArray :- " + value.name);
//            });
//
//            console.log("----totalOptsArray-----");
//            //console.log("totalOptsArray :- " + totalOptsArray[0].options[0].val);
//
//
//            $.each(totalOptsArray, function( index, value ) {
//                console.log(totalOptsArray[index].options);
//            });
//            totalQuestOptsArray.push({name:"quest 01", options:[{val:"opt1", isCorrect:"false"}]});
//            console.log("totalQuestOptsArray.name :- " + totalQuestOptsArray[0].name);
//            console.log("totalQuestOptsArray.options :- " + totalQuestOptsArray[0].options[0].val);
//            console.log("totalQuestOptsArray.options :- " + totalQuestOptsArray[0].options[0].isCorrect);
//            $.each(questionlist, function( index, value ) {
//                //console.log(getKeys(questionlist));
//                //console.log("keys :- " + keys);
//                $.each(keys, function( index, value ) {
//                    if (value[index]!=value[index-1]){
//                        //console.log("value :- " + value);
//                        my_computed_opt = "opt"+index;
//                        if (value==my_computed_opt){
//                            console.log("opt value :- " + value);
//                            for (var i=0; i<questionlist.length; i++){
//                                console.log("questionlist[index] :- " + questionlist[i][my_computed_opt])
//                            }
//
//                            //questionsArr.push({options:questionlist[index][my_computed_opt].value})
//                        }
////                        else{
////                            questionsArr.push({name:questionlist[index].name})
////                        }
//                    }
//                });
//                console.log("questionsArr :- " + questionsArr);
//                //questionsArr.push({name: questionlist[index].name, options:[{val:questionlist[index].opta}]})
//            });
            //NEW ENDING FROM HERE

            questionBanks.insert({name:question_bank_name,questions:questionlist});

            //dynamicOptsCombined.push({val:dynamicOptsVal[k].val, isCorrect:dynamicOptsisCorrect[k].isCorrect})
//            dynamicQuestionBanks.update( { _id: qb_id_new},
//                { $push:
//                {
//                    question: {
//                        name: question_name_new,
//                        options: dynamicOptsCombined
//                    }
//                }
//                }
//            );

        }
    });

    Template.question_banks_list.questionBanks = function () {
        return questionBanks.find().fetch();
    };

    Template.questionBank.correctOptionIs = function (correctOptionIs) {
        //console.log("in correctOptionIs");
        //console.log(this.correct);
        return this.correct === correctOptionIs;
    };

    Template.showGameConfig.correctOptionIs = function (correctOptionIs) {
        //console.log("in correctOptionIs");
        //console.log(this.correct);
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




            questionBanks.insert({name:question_bank_name_dynamic, questions:[dynamicOptionArray]})

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
            var counter=0;
            dynamicQuestion = UI.renderWithData(Template.dynamicQuestionNew,{id:dynamicQuestionCount});
//            for(var i=0; i<counter;i++)
//            {
            UI.insert(dynamicQuestion, $("#dynamic_question_block_new")[0]);
//            }
//            counter++;
            return dynamicQuestionCount = dynamicQuestionCount + 1;
//            console.log(counter);
//            return counter;
        },

        'submit form': function (event, template) {
            event.preventDefault();
            qb_id_new = template.find("input[name=qb_id_new]").value;
            console.log("qb_id_new "  + qb_id_new);

            question_name_new = $(event.currentTarget).find("#dynamic_question_name_new").val();
            console.log("question_name_new :- " + question_name_new);

            var dynamicOptsVal = [];
            var dynamicOptsisCorrect = [];
            var dynamicOptsCombined = [];
            var this_opt_val, this_opt_isCorrect;
//            $('#dynamic_options_block_new').find("input:text").each(function(df_text_index, df_text){
            $('#dynamic_options_block_new').find("input:text").each(function(df_text_index, df_text){
//                console.log(df_text_index);
                this_opt_val = $(df_text).val();
                dynamicOptsVal.push({val:this_opt_val});
            });

            $('#dynamic_options_block_new').find("input:radio").each(function(df_radio_index, df_radio){
                console.log(df_radio_index);
                this_opt_isCorrect = $(df_radio).val();
                dynamicOptsisCorrect.push({isCorrect:this_opt_isCorrect});
                //console.log(dynamicOptsisCorrect[df_radio_index]);
            });

//            $('#dynamic_options_block_new').find("input:text, input:radio").each(function(df_radio_index, df_radio){
//                //console.log($(df).attr('type'));
//                //console.log("this id :- " + $(df).attr('id') + ", val :- " + $(df).val());
////                if ( $(df).attr('type') == "text" ) {
////                    this_opt_val = $(df).val();
////                    dynamicOpts.push({val:this_opt_val});
////                }
////                else if ( $(df).attr('type') == "radio" ) {
////                    this_opt_isCorrect = $(df).val();
////                    dynamicOpts.push({isCorrect:this_opt_isCorrect});
////                }
//
//            });

            console.log("dynamicOptsVal.length :- " + dynamicOptsVal.length + ", dynamicOptsisCorrect.length :- " + dynamicOptsisCorrect.length);

            for (var k=0; k<dynamicOptsVal.length; k++){
                console.log("dynamicOptsVal :- " + dynamicOptsVal[k].val);
                console.log("dynamicOptsisCorrect :- " + dynamicOptsisCorrect[k].isCorrect);

                dynamicOptsCombined.push({val:dynamicOptsVal[k].val, isCorrect:dynamicOptsisCorrect[k].isCorrect})
            }

            console.log("dynamicOptsCombined.length :- " + dynamicOptsCombined.length);
//
            $.each(dynamicOptsCombined, function( index, value ) {
                console.log("val :- " + value.val + ", isCorrect :- " + value.isCorrect);
            });


            dynamicQuestionBanks.update( { _id: qb_id_new},
                { $push:
                {
                    question: {
                        name: question_name_new,
                        options: dynamicOptsCombined
                    }
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

        },

        'change .option-class': function(event, template){
            if ( $(event.currentTarget).is(':checked') ){

                $('#dynamic_options_block_new').find("input[type=radio]").each(function(df_index, df){
                    $(df).removeAttr('checked');
                    $(df).val('false');
                });
                $(event.currentTarget).prop('checked', true);
                $(event.currentTarget).val('true');
            }

        }
    });

    Template.dynamicQuestionNew.events({
        'click .remove-opt-btn': function(event, template){
            $(event.currentTarget).parent().remove();
        }
    });


    Template.questionBank_new.events = {
        'click input.delete': function (event, template) { // <-- here it is
            var opt_to_remove = $(event.currentTarget).prev().text();
            show_qb_id = template.find("input[name=show_game_id]").value;
            console.log(show_qb_id);
            var quest_name = $(event.currentTarget).parent().parent().parent().prev().text();
            console.log(quest_name);
            console.log(opt_to_remove);


            dynamicQuestionBanks.update({ _id: show_qb_id },
                {"$pull":{ question:
                {
                    name: quest_name,
                    options: [
                        { $val : opt_to_remove }
                    ] } }},
                { $unset: {
                    val: "",
                    isCorrect: ""
                }
                },
                { multi: true }

            );

            //dynamicQuestionBanks.update({_id: show_qb_id},{question:{name:quest_name},options:[ {$pull:{"val":opt_to_remove}}]});






            //dynamicQuestionBanks.remove(this._id);
        }
    };




}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}


// Back up old Data

//Games = new Meteor.Collection('games');
//GameConfigs = new Meteor.Collection('gameConfigs');
//questionBanks = new Meteor.Collection('questionBanks');
//dynamicQuestionBanks = new Meteor.Collection('dynamicQuestionBanks');
//userAnswers = new Meteor.Collection('userAnswers');
//
//
//if (Meteor.isClient) {
//
////small js function to covert any form to a json objects with keys as 'name' of input field and 'value' as what users enter!
//    $.fn.serializeObject = function () {
//        var o = {};
//        var a = this.serializeArray();
//        $.each(a, function () {
//            if (o[this.name] !== undefined) {
//                if (!o[this.name].push) {
//                    o[this.name] = [o[this.name]];
//                }
//                o[this.name].push(this.value || '');
//            } else {
//                o[this.name] = this.value || '';
//            }
//        });
//        return o;
//    };
//    $.fn.swapClass = function (a, b) {
//        $(this).removeClass(a).addClass(b)
//    }
//
//    trimInput = function(value) {
//        return value.replace(/^\s*|\s*$/g, '');
//    };
//
//    isNotEmpty = function(value) {
//        if (value && value !== ''){
//            return true;
//        }
//        Session.set('alert', 'Please fill in all required fields.');
//        return false;
//    };
//
//    isEmail = function(value) {
//        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//        if (filter.test(value)) {
//            return true;
//        }
//        Session.set('alert', 'Please enter a valid email address.');
//        return false;
//    };
//
//    isValidPassword = function(password) {
//        if (password.length < 6) {
//            Session.set('alert', 'Your password should be 6 characters or longer.');
//            return false;
//        }
//        return true;
//    };
//
//    areValidPasswords = function(password, confirm) {
//        if (!isValidPassword(password)) {
//            return false;
//        }
//        if (password !== confirm) {
//            Session.set('alert', 'Your two passwords are not equivalent.');
//            return false;
//        }
//        return true;
//    };
//
//    var dynamicFieldCount = 0;
//    var dynamicOptionCount = 0;
//    var dynamicQuestionCount = 0;
//    var dynamicOptionCountNew = 0;
//    var correct_option1, correct_option2;
//    var key, keys = [];
//    var my_computed_opt;
//    var optionsKeysArray = [];
//    var questionKeysArray = [];
//    var totalQuestArray = [];
//    var totalOptsArray = [];
//    var totalQuestOptsArray = [];
//    var keysArray = [];
//
//    Meteor.startup(function () {
//        Router.map(function(){
//// Routes for Create New Game:
//            this.route('new_game',{
//                path: "/games/new",
//                template: "createNewGame"
//            });
//
//// Routes for Show Game List:
//            this.route('games_list',{
//                path: "/games_list",
//                template: "games_list"
//            });
//
////  Routes for Start Game Page:
//            this.route('gameShow', {
//                // matches: '/posts/1'
//                path: '/game/:_id',
//                template: "game",
//                data: function() { return Games.findOne(this.params._id); }
//            });
//
//// Routes for Game Config Form:
//            this.route('gameConfigForm', {
//                // matches: '/posts/1'
//                path: '/game_config/game/:_id',
//                template: "gameConfigForm",
//                data: function() {
//                    //console.log(this.params._id);
//                    return Games.findOne(this.params._id);
//                }
//            });
//
//// Routes for Show Game Config Form:
//            this.route('showGameConfig', {
//                // matches: '/posts/1'
//                path: '/show_game_config/:_id',
//                template: "showGameConfig",
//                data: function() {
//                    //console.log("show_game_config :- " + this.params._id);
//                    return Games.findOne(this.params._id);
//                }
//            });
//
//// Routes for Upload Questions Form:
//            this.route('upload_questions',{
//                path: "/upload_questions",
//                template: "uploadQuestions"
//            });
//
//            this.route('question_banks_list',{
//                path: "/question_banks_list",
//                template: "question_banks_list"
//            });
//
//            this.route('questionBankShow', {
//                // matches: '/posts/1'
//                path: '/question_bank/:_id',
//                template: "questionBank",
//                data: function() { return questionBanks.findOne(this.params._id); }
//            });
//
//            this.route('upload_questions_dynamic',{
//                path: "/upload_questions_dynamic",
//                template: "uploadQuestionsDynamic"
//            });
//
//
////            New Starts
//            this.route('upload_questions_dynamic_new',{
//                path: "/upload_questions_dynamic_new",
//                template: "uploadQuestionsDynamicNew"
//            });
//
//            this.route('showQBNew', {
//                // matches: '/posts/1'
//                path: '/show_qb_new/:_id',
//                template: "showQBNew",
//                data: function() {
//                    //console.log("show_game_config :- " + this.params._id);
//                    return dynamicQuestionBanks.findOne(this.params._id);
//                }
//            });
//
//            this.route('questionBankShowNew', {
//                // matches: '/posts/1'
//                path: '/question_bank_show_new/:_id',
//                template: "questionBank_new",
//                data: function() { return dynamicQuestionBanks.findOne(this.params._id); }
//            });
//
////            New Ends
//
//        });
//    });
//
//    Template.welcome.greeting = function () {
//    return "Welcome to neti app.";
//  };
////    Template.overlayBody.greeting1 = function () {
////        var t=document.getElementById("showtime").innerHtml;
////        alert(t);
//////        return "Welcome to neti app.";
////    };
////    var tim;
////    var min = 1;
////    var sec = 60;
////    var f = new Date();
////    function f1() {
////        f2();
////        document.getElementById("starttime").innerHTML = "Start Time" + f.getHours() + ":" + f.getMinutes();
////    }
////    function f2() {
////        if (parseInt(sec) > 0) {
////            sec = parseInt(sec) - 1;
////            document.getElementById("showtime").innerHTML = "Your Left Time  is :"+min+" Minutes ," + sec+" Seconds";
////            tim = setTimeout("f2()", 1000);
////        }
////        else {
////            if (parseInt(sec) == 0) {
////                min = parseInt(min) - 1;
////                if (parseInt(min) == 0) {
////                    clearTimeout(tim);
////                    alert('hiii')
//////
////                }
////                else {
////                    sec = 60;
////                    document.getElementById("showtime").innerHTML = "Your Left Time  is :" + min + " Minutes ," + sec + " Seconds";
////                    tim = setTimeout("f2()", 1000);
////                }
////            }
////
////        }
////    }
//
//    Template.overlayBody.rendered = function(){
//        if (!this.rendered){
//}
//        var count = document.getElementById('timedata1').text;
//        alert(count);
//       var t=document.getElementById("showtime").innerHtml;
//        alert(t);
//    };
//
//// For New GameData Entry
//
//    Template.createNewGame.events({
//        'submit form': function (event, template) {
//            //alert(Meteor.Router.page());
//            event.preventDefault();
//            game_name = template.find("input[name=game_name]");
////            no_of_rounds = template.find("input[name=dyna_name]");
////            time=template.find("input[name=time]");
//            var data = {
//                name: game_name.value
////
//            };
//            Games.insert(data, function(err) { /* handle error */ });
//
//            var data2 = {
//                name: game_name.value,
////                rrp:no_of_rounds.value,
//                gameConfig: {
//                    fixedParameter: {
//                        round: no_of_rounds.value,
//                        time_each_round: time.value
//
//                    }
//                }
//            };
//            Games.insert(data2, function(err) { /* handle error */ });
////            db.games.insert( { name: "Game 05", gameConfig: { fixedParameter:{ round: 2} } } );
//            Router.go('games_list');
//            Router.go('welcome');
//        },
//
//        'click #get_game_data_btn': function(event, template){
//             //alert(template.find("input[name=no_of_rounds]").value);
//            //alert("No. of Games :- " + Games.find().count());
//            //alert("Last Game :- " + ((Games.find()).skip(Games.find().count() - 1)));
//        }
//
//    });
//
//    Template.games_list.games = function () {
//        return Games.find().fetch();
//    };
//
//    Template.gameConfigForm.qbs = function(){
//        return questionBanks.find().fetch();
//    };
//
//    Template.showGameConfig.qb = function(){
//        var this_game_id = this._id;
//        if (this_game_id!=undefined){
//
//            //console.log("this_game_id :- " + this_game_id);
//            var this_game = Games.findOne({_id:this_game_id});
//            var this_game_qb = Games.findOne({_id:this_game_id}).qb_id;
//            console.log("this_game_qb :- " + this_game_qb);
//
////            var this_qb_questions = questionBanks.findOne({_id:this_game_qb}).questions;
////            //console.log("this_qb_questions :- " + this_qb_questions[0].name)
////
////            var items = this_qb_questions.map(function(doc, index, cursor) {
////                var i = _.extend(doc, {index: index});
////                //console.log(i);
////                return i;
////            });
////            console.log("items :- " + items)
////            return items;
//
//            return questionBanks.findOne({_id:this_game_qb});
//        }
//    };
//
//
//    Template.game.rendered = function(){
//        console.log(this.data._id);
//        Session.set("game_id",this.data._id)
//        if (!this.rendered){
//
//            console.log("set session");
//
//            this.rendered = true;
//        }
//
//    };
//
//    Template.showGameConfig.rendered = function(){
////        console.log(Session.get("game_id"));
////        console.log ("this")
//            if (!this.rendered){
//            $("#start_timer").trigger('click');
//            this.rendered = true;
//        }
//     };
//
//
//    Template.showGameConfig.events({
//        'submit form': function (event, template) {
//            //alert(Meteor.Router.page());
//            event.preventDefault();
//            var each_question = $(event.currentTarget).find('.question-block').find('.question');
//            var count = document.getElementById('timedata1').value;
//            console.log(count);
//            var this_game_id = $(event.currentTarget).find('#this_game_id').val();
//            var this_game_qb_id = $(event.currentTarget).find('#this_game_qb_id').val();
////            var qw= $(event.currentTarget).find('#this_game_qb_id').val();
//            var question, selected_ans;
//            var quest_ans_array = [];
//            var user_id = Meteor.userId();
//
//            $(each_question).each(function(q_index, qf) {
//                //selected_qb_id = $("#game_config_form").find("#game_qb_select option:selected").val();
//                question = $(qf).attr('id').toString().split("_")[1];
//                //console.log("question :- " + question);
//                selected_ans = $(qf).find('.options-list').find(".option-class:checked").val();
//                if (selected_ans===undefined){
//                    quest_ans_array.push({question:question, answer:""});
//                }
//                else{
//                    quest_ans_array.push({question:question, answer:selected_ans});
//                }
//
//            });
//
//
////            console.log("------ quest_ans_array ------");
////            $.each(quest_ans_array, function( index, value ) {
////                console.log("question :- " + quest_ans_array[index].question + ", answer :- " + quest_ans_array[index].answer);
////            });
//            var answered = userAnswers.findOne({user_id:user_id, game_id:this_game_id, qb_id:this_game_qb_id});
//            if (answered==undefined){
//                console.log("create");
//                userAnswers.insert({user_id:user_id, game_id:this_game_id, qb_id:this_game_qb_id, quest_ans:quest_ans_array});
//            }
//            else{
//                console.log("update");
//                console.log(answered._id);
////                userAnswers.update( { _id:answered._id, user_id: user_id, game_id:this_game_id, qb_id:this_game_qb_id },
////                                    { $set: {
////                                                quest_ans:quest_ans_array
////                                            }
////                                    }
////                                  );
//                  userAnswers.update( { _id:answered._id },
//                                    { $set: {
//                                                quest_ans:quest_ans_array
//                                            }
//                                    }
//                                  );
//            }
//
//
//
//
//            //Router.go("/games_list");
//        },
//
//        'click #start_timer': function(event, template){
//            console.log("on click start tmer");
//            console.log(Session.get("game_id"));
//            var Data=Games.findOne({_id :Session.get("game_id")});
////            console.log(Data);
//            var time=Data.fixedParameter.time;
////          var count = time;
//            console.log(count);
//            var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
//            function timer()
//            {
//                //console.log("count in timer() :- " + count);
//                count=count-1;
//                if (count <= 0)
//                {
//                    clearInterval(counter);
//                    //counter ended, do something here
//                    alert("Game Over");
//                    return;
//                }
//            }
//
//        }
//    });
//
//
//    Template.signUpForm.events({
//        'submit #register': function(e) {
//            e.preventDefault()
//            var newUser;
//            newUser = $("#register").serializeObject();
//            console.log(newUser)
//            Accounts.createUser(newUser, function(err) {
//                if (err) {
//                    console.log(err);
//                }
////                return Router.go("/games_list");
//                return Router.go("/");
//            });
//            return false;
//
//        }
//    });
//
//    Template.signInForm.events({
//        'submit #login': function(e, t) {
//            e.preventDefault();
//
//            var signInForm = $(e.currentTarget),
//                //email = trimInput(signInForm.find('.email').val().toLowerCase()),
//                email = signInForm.find("input[name=email]").val(),
//                //password = signInForm.find('.password').val();
//                password = signInForm.find("input[name=password]").val();
//
//                //console.log("email :- " + email + ", password :- " + password);
//            //if (isNotEmpty(email) && isEmail(email) && isNotEmpty(password) && isValidPassword(password)) {
//                Meteor.loginWithPassword(email, password, function(err) {
//                    if (err) {
//                        Session.set('alert', 'We\'re sorry but these credentials are not valid.');
//                    } else {
//                        console.log("correct");
//                        Router.go("/games_list");
//                        Session.set('alert', 'Welcome back New Meteorite!');
//                    }
//                });
//            //}
//
//            return false;
//        }
//    });
//
//    Template.gameConfigForm.events({
//        'click #add_config_btn': function(event, template){
//            //console.log(dynamicFieldCount);
//            dynamicFields = UI.renderWithData(Template.dynamicParameterFields,{id:dynamicFieldCount});
//            UI.insert(dynamicFields, $("#dynamic_config_block")[0]);
//            return dynamicFieldCount = dynamicFieldCount + 1;
//        },
//
//        'submit form': function (event, template) {
//            event.preventDefault();
//            game_id = template.find("input[name=game_id]").value;
//            selected_qb_id = $("#game_config_form").find("#game_qb_select option:selected").val();
////            console.log("game_id :- " + game_id);
////            console.log("selected_qb_id :- " + selected_qb_id);
//             no_of_rounds = template.find("input[name=no_of_rounds]");
//            time = template.find("input[name=time]");
////            console.log("time :- " + time);
//            //console.log(template.find("input[type=text]").length);
////            var dynamicFieldArray = [];
////            var key_field, val_field, key, val;
////            $('.dynamic_fields').each(function(df_index, df) {
////                //console.log($(df).find("input[type=text]").length);
////                key_field = $(df).find("input[type=text]")[0];
////                val_field = $(df).find("input[type=text]")[1];
////                key = $(key_field).val();
////                val = $(val_field).val();
////               var field = key
////                var variable = 'some_string';
//////                action[variable] = 1
//
//              Games.update( { _id: game_id },
//                { $set: {
////
//                    qb_id: selected_qb_id,
////
//                    fixedParameter: {
//                        rounds: no_of_rounds.value,
//                        time: time.value
//                    }
//                }
//                }
//            );
////
//            var keyArray=[];
//            var valueArray=[];
//            var dynamicFieldArray = [];
//            var key_field, val_field, key, val;
//            $('.dynamic_fields').each(function(df_index, df) {
//                //console.log($(df).find("input[type=text]").length);
//                key_field = $(df).find("input[type=text]")[0];
//                val_field = $(df).find("input[type=text]")[1];
//                key = $(key_field).val();
//                val = $(val_field).val();
//                 keyArray.push(
//
//                     key
//                 )
//                valueArray.push(
//                    val
//                )
////                var j=1
////                for(var i=0;i<keyArray.length;i++)
////                {
////                    console.log(keyArray[0])
////                   if(keyArray[i]==keyArray[j])
////                    {
////                        alert("please Enter Different Key");
////                        break;
////                    }
////                    j++;
//////
////                }
////
//                for(var i=0 ;i<=keyArray.length;i++)
//                {
//                    var fieldname = keyArray[i]
//                    var name = valueArray[i]
//                    var $set = {};
//                    $set[fieldname] = name;
//                    Games.update({ _id: game_id }, { $set: $set });
//                }
//
//            });
//
////            console.log("------ dynamicFieldArray ------");
//////            keyArray.key=key;
//////            dynamicFieldArray.value=val;
////            $.each(keyArray, function( index, value ) {
////                console.log("key :- " + keyArray[index].key );
//////                console.log("val :- " + dynamicFieldArray[index].value );
//////                ", val :- " + dynamicFieldArray[index].value);
////            });
////            $.each(valueArray, function( index, value ) {
////                console.log("value :- " + valueArray[index].val );
//////                console.log("val :- " + dynamicFieldArray[index].value );
//////                ", val :- " + dynamicFieldArray[index].value);
////            });
//
//
////            $set['profile.' + keyArray] = valueArray;
////            var $set = {};
////            $set['profile.' + key] = val;
////            Meteor.Games.update( { _id: game_id }, { $set: $set });
//
////            Games.update( { _id: game_id },
////
////                { $set: {
////                        key:keyArray,
////                        value:valueArray
//////                    dynamicParameter: {
//////
////////                        dynamicFieldArray: dynamicFieldArray
//////                    }
////                }
////                }
////            );
//
//            //var game = Games.findOne(game_id);
////
//            Router.go('/show_game_config/'+game_id);
//        }
//    });
//
//    Template.uploadQuestions.events({
//        'submit form': function (event, template) {
//            event.preventDefault();
//            question_bank_name = $(event.currentTarget).find("#question_bank_name").val();
//            listOfQuestions =  $(event.currentTarget).find("#list_of_questions").val();
//            //console.log("textarea val (listOfQuestions) :- " + listOfQuestions);
//            questionlist = JSON.parse(listOfQuestions);
//            //console.log("----------------- parsed JSON -----------------");
//            //console.log("questionlist :- " + questionlist);
//
//            //NEW STARTING FROM HERE
////            console.log("questionlist len :- " + questionlist.length);
////            //questionlist = JSON.stringify(questionlist);
////            //console.log("after stringify");
////
////            var getKeys = function(arr) {
////
////                for (i=0; i<arr.length; i++) {
////                    for (key in arr[i]) {
////                        keys.push(key);
////                    }
////                }
////                return keys;
////            };
////
////            getKeys(questionlist); // => ["A", "B", "C", "D", "E", "F"]
////            //console.log(getKeys(questionlist));
////
////
////
////            var unique_keys = jQuery.unique(keys);
////            console.log("unique_keys :- " + unique_keys);
////
////            $.each(unique_keys, function( index, value ) {
////                //console.log("value :- " + value);
////                if (value=="name"){
////                    questionKeysArray.push(value)
////                }
////                else{
////                    optionsKeysArray.push(value)
////                }
////            });
////
////            var opt_name, isCorrectVal;
////            $.each(questionlist, function( index, value ) {
////                for(var h=0; h<questionKeysArray.length; h++){
////                    console.log("name :- "+ questionlist[index][questionKeysArray[h]]);
////                    totalQuestArray.push({name:questionlist[index][questionKeysArray[h]]})
////                }
////                for(var v=0; v<optionsKeysArray.length; v++){
////                    //console.log("opt"+(v+1)+ " :- " + questionlist[index][optionsKeysArray[v]]);
////                    opt_name = questionlist[index][optionsKeysArray[v]].split(',')[0];
////                    isCorrectVal = questionlist[index][optionsKeysArray[v]].split(', ')[1];
////                    console.log("opt_name :- " + opt_name + ", isCorrectVal :- " + isCorrectVal);
////                    totalOptsArray.push({options:[{val:opt_name, isCorrect:isCorrectVal}]})
////                }
////            });
////
////            console.log("----totalQuestArray-----");
////            $.each(totalQuestArray, function( index, value ) {
////                console.log("totalQuestArray :- " + value.name);
////            });
////
////            console.log("----totalOptsArray-----");
////            //console.log("totalOptsArray :- " + totalOptsArray[0].options[0].val);
////
////
////            $.each(totalOptsArray, function( index, value ) {
////                console.log(totalOptsArray[index].options);
////            });
//
//
////            totalQuestOptsArray.push({name:"quest 01", options:[{val:"opt1", isCorrect:"false"}]});
////            console.log("totalQuestOptsArray.name :- " + totalQuestOptsArray[0].name);
////            console.log("totalQuestOptsArray.options :- " + totalQuestOptsArray[0].options[0].val);
////            console.log("totalQuestOptsArray.options :- " + totalQuestOptsArray[0].options[0].isCorrect);
//
////            $.each(questionlist, function( index, value ) {
////                //console.log(getKeys(questionlist));
////                //console.log("keys :- " + keys);
////                $.each(keys, function( index, value ) {
////                    if (value[index]!=value[index-1]){
////                        //console.log("value :- " + value);
////                        my_computed_opt = "opt"+index;
////                        if (value==my_computed_opt){
////                            console.log("opt value :- " + value);
////                            for (var i=0; i<questionlist.length; i++){
////                                console.log("questionlist[index] :- " + questionlist[i][my_computed_opt])
////                            }
////
////                            //questionsArr.push({options:questionlist[index][my_computed_opt].value})
////                        }
//////                        else{
//////                            questionsArr.push({name:questionlist[index].name})
//////                        }
////                    }
////                });
////                console.log("questionsArr :- " + questionsArr);
////                //questionsArr.push({name: questionlist[index].name, options:[{val:questionlist[index].opta}]})
////            });
//            //NEW ENDING FROM HERE
//
//            questionBanks.insert({name:question_bank_name,questions:questionlist});
//
//            //dynamicOptsCombined.push({val:dynamicOptsVal[k].val, isCorrect:dynamicOptsisCorrect[k].isCorrect})
////            dynamicQuestionBanks.update( { _id: qb_id_new},
////                { $push:
////                {
////                    question: {
////                        name: question_name_new,
////                        options: dynamicOptsCombined
////                    }
////                }
////                }
////            );
//
//        }
//    });
//
//    Template.question_banks_list.questionBanks = function () {
//        return questionBanks.find().fetch();
//    };
//
//    Template.questionBank.correctOptionIs = function (correctOptionIs) {
//        //console.log("in correctOptionIs");
//        //console.log(this.correct);
//        return this.correct === correctOptionIs;
//    };
//
//    Template.showGameConfig.correctOptionIs = function (correctOptionIs) {
//        //console.log("in correctOptionIs");
//        //console.log(this.correct);
//        return this.correct === correctOptionIs;
//    };
//
//
//
//    Template.uploadQuestionsDynamic.events({
//        'click #add_options_btn': function(event, template){
//            //console.log(dynamicFieldCount);
//            dynamicOptions = UI.renderWithData(Template.dynamicOptions,{id:dynamicOptionCount});
//            UI.insert(dynamicOptions, $("#dynamic_option_block")[0]);
//            return dynamicOptionCount = dynamicOptionCount + 1;
//        },
//
//        'submit form': function (event, template) {
//            event.preventDefault();
//            question_bank_name_dynamic = $(event.currentTarget).find("#question_bank_name_dynamic").val();
//            dynamic_question_name = $(event.currentTarget).find("#dynamic_question_name").val();
//            dynamic_correct_option_key = $(event.currentTarget).find("#dynamic_correct_option_key").val();
//            console.log(question_bank_name_dynamic);
//            console.log(dynamic_question_name);
//            console.log(dynamic_correct_option_key);
//
//            var dynamicOptionArray = [];
//            var key_field, val_field, key, val;
//            var questionArray = [];
//
//            var questionHash =
//            {
//                "name" : dynamic_question_name,
//                "correct" : dynamic_correct_option_key
//            };
//
//            var jsonVariable = {};
//
//            $('.dynamic_options').each(function(df_index, df) {
//                //console.log($(df).find("input[type=text]").length);
//                key_field = $(df).find("input[type=text]")[0];
//                val_field = $(df).find("input[type=text]")[1];
//                key = $(key_field).val();
//                val = $(val_field).val();
//
//                console.log("key :- " + key + ", val :- " + val);
//                //questionHash.push({key: "opt"+key,value : val});
//
//                jsonVariable['opt'+ key] = val;
//
//
//            });
//            console.log("jsonVariable :- " + jsonVariable)
//            console.log("jsonVariable :- " + jsonVariable[0].opta);
////            console.log("------ dynamicFieldArray ------");
////            $.each(dynamicOptionArray, function( index, value ) {
////                console.log("key :- " + dynamicOptionArray[index].key + ", val :- " + dynamicOptionArray[index].value);
////            });
//
//
//
//
//            questionBanks.insert({name:question_bank_name_dynamic, questions:[dynamicOptionArray]})
//
//        }
//
//    });
//
//    Template.uploadQuestionsDynamicNew.events({
//        'submit form': function (event, template) {
//            event.preventDefault();
//            question_bank_name_new = $(event.currentTarget).find("#question_bank_name_new").val();
//            dynamicQuestionBanks.insert({name:question_bank_name_new});
//        }
//    });
//
//    Template.showQBNew.events({
//        'click #add_question_new': function(event, template){
//            //console.log(dynamicFieldCount);
//            var counter=0;
//            dynamicQuestion = UI.renderWithData(Template.dynamicQuestionNew,{id:dynamicQuestionCount});
////            for(var i=0; i<counter;i++)
////            {
//            UI.insert(dynamicQuestion, $("#dynamic_question_block_new")[0]);
////            }
////            counter++;
//            return dynamicQuestionCount = dynamicQuestionCount + 1;
////            console.log(counter);
////            return counter;
//        },
//
//        'submit form': function (event, template) {
//            event.preventDefault();
//            qb_id_new = template.find("input[name=qb_id_new]").value;
//            console.log("qb_id_new "  + qb_id_new);
//
//            question_name_new = $(event.currentTarget).find("#dynamic_question_name_new").val();
//            console.log("question_name_new :- " + question_name_new);
//
//            var dynamicOptsVal = [];
//            var dynamicOptsisCorrect = [];
//            var dynamicOptsCombined = [];
//            var this_opt_val, this_opt_isCorrect;
////            $('#dynamic_options_block_new').find("input:text").each(function(df_text_index, df_text){
//            $('#dynamic_options_block_new').find("input:text").each(function(df_text_index, df_text){
////                console.log(df_text_index);
//                this_opt_val = $(df_text).val();
//                dynamicOptsVal.push({val:this_opt_val});
//            });
//
//            $('#dynamic_options_block_new').find("input:radio").each(function(df_radio_index, df_radio){
//                console.log(df_radio_index);
//                this_opt_isCorrect = $(df_radio).val();
//                dynamicOptsisCorrect.push({isCorrect:this_opt_isCorrect});
//                //console.log(dynamicOptsisCorrect[df_radio_index]);
//            });
//
////            $('#dynamic_options_block_new').find("input:text, input:radio").each(function(df_radio_index, df_radio){
////                //console.log($(df).attr('type'));
////                //console.log("this id :- " + $(df).attr('id') + ", val :- " + $(df).val());
//////                if ( $(df).attr('type') == "text" ) {
//////                    this_opt_val = $(df).val();
//////                    dynamicOpts.push({val:this_opt_val});
//////                }
//////                else if ( $(df).attr('type') == "radio" ) {
//////                    this_opt_isCorrect = $(df).val();
//////                    dynamicOpts.push({isCorrect:this_opt_isCorrect});
//////                }
////
////            });
//
//            console.log("dynamicOptsVal.length :- " + dynamicOptsVal.length + ", dynamicOptsisCorrect.length :- " + dynamicOptsisCorrect.length);
//
//            for (var k=0; k<dynamicOptsVal.length; k++){
//                console.log("dynamicOptsVal :- " + dynamicOptsVal[k].val);
//                console.log("dynamicOptsisCorrect :- " + dynamicOptsisCorrect[k].isCorrect);
//
//                dynamicOptsCombined.push({val:dynamicOptsVal[k].val, isCorrect:dynamicOptsisCorrect[k].isCorrect})
//            }
//
//            console.log("dynamicOptsCombined.length :- " + dynamicOptsCombined.length);
////
//            $.each(dynamicOptsCombined, function( index, value ) {
//                console.log("val :- " + value.val + ", isCorrect :- " + value.isCorrect);
//            });
//
//
//            dynamicQuestionBanks.update( { _id: qb_id_new},
//                { $push:
//                {
//                    question: {
//                        name: question_name_new,
//                        options: dynamicOptsCombined
//                    }
//                }
//                }
//            );
//        }
//    });
//
//    Template.dynamicQuestionNew.events({
//        'click #add_options_new': function(event, template){
//            //console.log(dynamicFieldCount);
//            dynamicOptionNew = UI.renderWithData(Template.dynamicOptionNew,{id:dynamicOptionCountNew});
//            UI.insert(dynamicOptionNew, $("#dynamic_options_block_new")[0]);
//            return dynamicOptionCountNew = dynamicOptionCountNew + 1;
//
//        },
//
//        'change .option-class': function(event, template){
//            if ( $(event.currentTarget).is(':checked') ){
//
//                $('#dynamic_options_block_new').find("input[type=radio]").each(function(df_index, df){
//                    $(df).removeAttr('checked');
//                    $(df).val('false');
//                });
//                $(event.currentTarget).prop('checked', true);
//                $(event.currentTarget).val('true');
//            }
//
//        }
//    });
//
//    Template.dynamicQuestionNew.events({
//        'click .remove-opt-btn': function(event, template){
//            $(event.currentTarget).parent().remove();
//        }
//    });
//
//
//    Template.questionBank_new.events = {
//        'click input.delete': function (event, template) { // <-- here it is
//            var opt_to_remove = $(event.currentTarget).prev().text();
//            show_qb_id = template.find("input[name=show_game_id]").value;
//            console.log(show_qb_id);
//            var quest_name = $(event.currentTarget).parent().parent().parent().prev().text();
//            console.log(quest_name);
//            console.log(opt_to_remove);
//
//
//            dynamicQuestionBanks.update({ _id: show_qb_id },
//                {"$pull":{ question:
//                {
//                    name: quest_name,
//                    options: [
//                        { $val : opt_to_remove }
//                    ] } }},
//                { $unset: {
//                    val: "",
//                    isCorrect: ""
//                }
//                },
//                { multi: true }
//
//            );
//
//            //dynamicQuestionBanks.update({_id: show_qb_id},{question:{name:quest_name},options:[ {$pull:{"val":opt_to_remove}}]});
//
//
//
//
//
//
//            //dynamicQuestionBanks.remove(this._id);
//        }
//    };
//
//
//
//
//}
//
//if (Meteor.isServer) {
//  Meteor.startup(function () {
//    // code to run on server at startup
//  });
//}
