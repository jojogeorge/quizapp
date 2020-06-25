import React,{ Fragment } from 'react';
import CubeOutlineIcon from 'mdi-react/CubeOutlineIcon';
import { Helmet } from 'react-helmet';
import  {Link} from 'react-router-dom';


const Home = () => (
    <Fragment>
        {/**<Helmet>
            <title>Quiz</title>
        </Helmet>*/}

        <div id="home">
            <section>
                <div className="cube">
                    <CubeOutlineIcon color="orange" size={65}/>
                </div>
                <h1>Quiz App</h1>
                <div className="play-button-container">
                    <ul>
                        <li >
                            <Link className="play-button" to="/play/instructions">Play</Link>
                        </li>
                    </ul>
                </div>
                <div className="auth-container">
                    <Link className="auth-buttons"  id="login-button" to="/login">Login</Link>
                    <Link className="auth-buttons" id="signup-button" to="/register">Register</Link>

                </div>
            </section>

        </div>
    </Fragment>
        
    
);

export default Home;