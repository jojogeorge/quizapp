import React, { Fragment } from 'react';
import M from 'materialize-css';
import classnames from 'classnames';

import LifePreserverIcon from 'mdi-react/LifePreserverIcon';
import BulbOutlineIcon from 'mdi-react/BulbOutlineIcon';
import ClockAlertIcon from 'mdi-react/ClockAlertIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import CloseIcon from 'mdi-react/CloseIcon';

import questions from '../../questions.json';
import { isEmpty } from '../../utils';


import correctNotification from '../../assets/sound/success.wav';
import errorNotification from '../../assets/sound/error.wav';
import buttonClick from '../../assets/sound/button-click.ogg';


class Play extends React.Component {
    constructor() {
        super();
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 0,
            noOfansweredQuestion: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            previousRandomNumbers:[],
            fifty50: 2,
            usedFifty50: false,
            time: {}

        };
        this.interval = null;
        this.correctSound = React.createRef();
        this.wrongSound = React.createRef();
        this.buttonSound = React.createRef();
    }

    startTimer = () => {
        let countDownTime = 60*1;
        this.interval = setInterval(() =>{

           let minutes = parseInt(countDownTime/60,10);
           let seconds = parseInt(countDownTime%60,10);

           minutes = minutes < 10 ? '0'+ minutes:minutes;
           seconds = seconds <10 ? '0'+ seconds: seconds; 
            if(--countDownTime < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes:0,
                        seconds:0
                    }
                },() =>{
                    this.endGame();
                })
            }else {
                this.setState({
                    time: {
                        minutes:minutes,
                        seconds:seconds
                    }
                })
            }

        },1000);
    }
    displayQuestions = (questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;

            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: [],
                usedFifty50: false
            },() =>{
                this.showOptions();
            });
        }

    };

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        //this.startTimer();
    }

    handleOptionClick = (e) => {
        if (e.target.innerHTML.trim().toLowerCase() === this.state.answer.toLowerCase()) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
    }

    handleNextButtonClick = () => {
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1

            }), () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    }


    handlePreviousButtonClick = () => {
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1

            }), () => {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    }


    handleQuitButtonClick = () => {
        if (window.confirm('Are you sure to quit the quiz?')) {
            this.props.history.push('/');
        }
    } 
    showOptions =() =>{
        const options = Array.from(document.querySelectorAll('.option'));
            options.forEach((option, index)=>{
            option.style.visibility = 'visible';
        });
    }

    handleButtonClick = (e) => {
        this.buttonSound.current.play();
        console.log(e.target.id)
        switch (e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default:
                break;
        }


    };

    correctAnswer = () => {
        this.correctSound.current.play();
        M.toast({
            html: 'Correct Answer',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            noOfansweredQuestion: prevState.noOfansweredQuestion + 1
        }), () => {
            if(!this.state.nextQuestion) {
                this.endGame();
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    };

    wrongAnswer = () => {
        navigator.vibrate(1000);
        this.wrongSound.current.play();
        M.toast({
            html: 'Wrong Answer',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState(prevState => ({

            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            noOfansweredQuestion: prevState.noOfansweredQuestion + 1
        }), () => {
            if(!this.state.nextQuestion) {
                this.endGame();
            } else {
                this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    }

    handleFifty50 = () =>{
        if(this.state.fifty50 > 0 && !this.state.usedFifty50) {
            let {indexOfAnswer, options} = this.findIndexOfAnswer();
            let randomNumbers =[];
            let count = 0;
            do {
                let randomNumber = Math.round(Math.random() *3);
                if(randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length<2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)){
                        randomNumbers.push(randomNumber);
                        count++;
                    }
            }
            } while(count<2);

            options.forEach((option, index) => {
                if(randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                } 
            },this.setState(prevState =>({
                fifty50: prevState.fifty50 - 1,
                usedFifty50: true
            })));

        }
    }
    findIndexOfAnswer = () =>{
        const options = Array.from(document.querySelectorAll('.option'));
        let indexOfAnswer;
        options.forEach((option, index)=>{
            if(option.innerHTML.trim().toLowerCase() === this.state.answer.toLowerCase()) {
                indexOfAnswer = index;
            }
        });
        return {indexOfAnswer, options};
    }
    handleHints = () =>{
        if(this.state.hints<1)
            return;
        let {indexOfAnswer, options} = this.findIndexOfAnswer();

        //hiding random wrong option
        while(true) {
            const randomNumber = Math.round(Math.random() *3);
            if(randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                options.forEach((option, index) => {
                    if(index === randomNumber) {
                        option.style.visibility = 'hidden';
                        
                        this.setState(prevState =>({
                            hints: prevState.hints - 1,
                            previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                        }))
                    }
                    
                });
                break;
            }
            if(this.state.previousRandomNumbers.length >= 3) {
                break;
            }
        }

    }

    endGame = () =>{
        alert("Quiz has been ended");
        const {state} = this;
        const playerStats ={
            score: state.score,
            noOfQuestions: state.numberOfQuestions,
            noOfansweredQuestion: state.noOfansweredQuestion,
            noOfWrongAnswers: state.wrongAnswers,
            noOfCorrectAnswers: state.correctAnswers,
            fifty50Used: 2- state.fifty50,
            hintsUsed: 5 - state.hints
        }

        setTimeout(() =>{
            this.props.history.push('/play/summary',playerStats);
        },1000);
    }

    render() {
        const { currentQuestion, currentQuestionIndex,
             numberOfQuestions, hints, fifty50,time,
            previousQuestion } = this.state;

        return (
            <Fragment>
                <Fragment>
                    <audio ref={this.correctSound} src={correctNotification}></audio>
                    <audio ref={this.wrongSound} src={errorNotification}></audio>
                    <audio ref={this.buttonSound} src={buttonClick}></audio>

                </Fragment>
                <div className="questions">
                    <h2>Quiz Mode</h2>
                    <div className="lifeline-container">
        <p><LifePreserverIcon  size={18} onClick={this.handleFifty50} className="lifeline-icon"></LifePreserverIcon><span className="lifeline">{fifty50}</span></p>
                        <p><BulbOutlineIcon  size={18} onClick={this.handleHints} className="lifeline-icon"></BulbOutlineIcon><span className="lifeline">{hints}</span></p>
                    </div>
                    <div>
                        <p>
                            <span className="left lifeline">{currentQuestionIndex + 1} of {numberOfQuestions}</span>
                            <span className="right lifeline">{time.minutes}:{time.seconds}<ClockAlertIcon color="green" size={18}></ClockAlertIcon></span>
                        </p>

                    </div>
                    <h5>{currentQuestion.question} </h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option"> {currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option"> {currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option"> {currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option"> {currentQuestion.optionD}</p>

                    </div>                   
                     
                </div>
                <section>
                    <div className="button-container">
                            <button
                                id="previous-button"
                                className={classnames('', { 'disable': !previousQuestion })}
                                onClick={this.handleButtonClick}
                            >  <ChevronLeftIcon className="button-icon" size="18"></ChevronLeftIcon>
                                 Previous
                            </button>
                            <button
                                id="next-button"
                                className={classnames('', { 'disable': currentQuestionIndex+1 === questions.length })}
                                onClick={this.handleButtonClick}
                            > Next <ChevronRightIcon className="button-icon" size="18"></ChevronRightIcon>
                            </button>
                            <button id="quit-button" onClick={this.handleButtonClick}> Quit
                            <CloseIcon className="button-icon" size="18"></CloseIcon></button>
                        </div>
                </section>
                
            </Fragment>

        );
    }
};
export default Play;