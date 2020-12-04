import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainApp } from './components/MainApp/MainApp';
import { Header } from './components/Header/Header';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { ProfileSettings } from './components/ProfileSettings/ProfileSettings';
import { ActivitySettings } from './components/ActivitySettings/ActivitySettings';
import { DietSettings } from './components/DietSettings/DietSettings';
import { AccountSettings } from './components/AccountSettings/AccountSettings';
import { Metrics } from './components/Metrics/Metrics';
import { Gear } from './components/Gear/Gear';
import { CustomActivities } from './components/CustomActivities/CustomActivities';
import { FoodSettings } from './components/FoodSettings/FoodSettings';

const Home = () => (
    <>
        <h1>Home</h1>
        <p>This is the home page</p>
    </>
);

function App(): JSX.Element {
    return (
        <Router>
            <MainApp>
                <Header />
                <main>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/account/profile" component={ProfileSettings} />
                    <Route path="/account/settings" component={AccountSettings} />
                    <Route path="/account/activity" component={ActivitySettings} />
                    <Route path="/account/diet" component={DietSettings} />
                    <Route path="/account/food" component={FoodSettings} />
                    <Route path="/account/metrics" component={Metrics} />
                    <Route path="/account/gear" component={Gear} />
                    <Route path="/account/custom-activities" component={CustomActivities} />
                </main>
            </MainApp>
        </Router>
    );
}

export default App;
