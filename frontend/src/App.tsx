import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainApp } from './components/MainApp/MainApp';
import { Header } from './components/Header/Header';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { ProfileSettings } from './components/ProfileSettings/ProfileSettings';

const Home = () => (
    <>
        <h1>Home</h1>
        <p>This is the home page</p>
    </>
);

function App() {
    return (
        <Router>
            <MainApp>
                <Header />
                <main>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/account/profile" component={ProfileSettings} />
                </main>
            </MainApp>
        </Router>
    );
}

export default App;
