import React,{Component, Fragment} from 'react';
import CheckCircleOutlineIcon from 'mdi-react/CheckCircleOutlineIcon';
import  {Link} from 'react-router-dom';
class QuizSummary extends Component {
    constructor(props) {
        super();
        this.state = {
            score:0,
            noOfQuestions:0,
            noOfAnswers:0,
            correctAnswers:0,
            wrongAnswers:0,
            usedHints:0,
            usedFifty50:0
        };
    }

    componentDidMount() {
         const {state} = this.props.location;
        if(state ){
            this.setState({
                score:Math.floor((state.noOfCorrectAnswers/state.noOfansweredQuestion)*100),
                noOfQuestions:state.noOfQuestions,
                noOfAnswers:(state.noOfCorrectAnswers + state.noOfWrongAnswers),
                correctAnswers:state.noOfCorrectAnswers,
                wrongAnswers:state.noOfWrongAnswers,
                usedHints:state.hintsUsed,
                usedFifty50:state.fifty50Used
            })
        }        
    }
    render() {
        const {score, noOfQuestions,noOfAnswers,correctAnswers,usedFifty50,wrongAnswers,usedHints} = this.state;

        let stats, remark;
        remark = score<=30?"Need Practice":(score>30 && score<=60)?'Better Luck next time':'Congratulations';
        console.log(this.state)
        if(this.props.location.state) {
            stats =(
            <Fragment>
                
                <div className="container">
                    <h4>{remark}</h4>
                    <h2>Your Score: {score+'%'} </h2>
                    <div className="scorecard">
                        <span className="stat left">No of Questions:</span>
                        <span className="stat right">{noOfQuestions}</span><br/>
                        <span className="stat left">No of attended Questions:</span>
                        <span className="stat right">{noOfAnswers}</span><br/>
                        <span className="stat left">Correct Answers:</span>
                        <span className="stat right">{correctAnswers}</span><br/>
                        <span className="stat left">Wrong Answers:</span>
                        <span className="stat right">{wrongAnswers}</span><br/>
                        <span className="stat left">No of Hints used:</span>
                        <span className="stat right">{usedHints}</span><br/>
                        <span className="stat left">No of Fitfy50 used:</span>
                        <span className="stat right">{usedFifty50}</span><br/>
                    </div>
                    

                    
                </div>
            </Fragment>
            
            );
        }else {
            stats =(<h1>No Stats Available!</h1>);
        }
        
        return (
            <Fragment>
                <div className="quiz-end-div">
                    <CheckCircleOutlineIcon color="green" size="50"></CheckCircleOutlineIcon>
                
                    <h4>Quiz has ended</h4>
                </div>

                <div className="stats">
                    {stats}
                </div>
                
                <section className="summary-button-container">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/play/quiz">Play Again</Link>
                        </li>
                    </ul>
                </section>
            </Fragment>
        );
    }
} 
export default QuizSummary;