import React , {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import LifePreserverIcon from 'mdi-react/LifePreserverIcon';



import answer from '../../assets/img/hints.png';


const QuizInstructions = () => (
    <Fragment>
        {/***
         * <Helmet></Helmet>
         */}

         <div className="instructions container">
             <h1>
                 How to Play Game
             </h1>
             <p> Ensure reading carefully</p>
             <ul className="browser-default" id="main-list">
                 <li>game rule1 </li>
                 <li>game rule1 
                     <LifePreserverIcon  className= "lifeline" color="green" size={20}></LifePreserverIcon>
                 </li>
                 <li>
                     game rule1

                    <img src={answer} alt="answer hint"/>
                 </li>
             </ul>
             <div>
                 <span className="left"> <Link to="/">Back</Link></span>
                 <span className="right"> <Link to="/play/quiz">Lets Go</Link></span>
             </div>
         </div>
    </Fragment>
);

export default QuizInstructions;