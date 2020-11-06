import React, { useState } from 'react';
import { AuthGateway } from '../AuthGateway/AuthGateway';
import { AccountSidebar } from '../AccountSidebar/AccountSidebar';
import { FoodGroupingsGrid } from '../FoodGroupingsGrid/FoodGroupingsGrid';
import { CustomFoodsGrid } from '../CustomFoodsGrid/CustomFoodsGrid';

import '../../styles/account.css';

const FoodSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('groupings');

    return (
        <AuthGateway redirectUrl="/account/food">
            <div className="account-page">
                <div className="sidebar">
                    <AccountSidebar activePage="food" />
                </div>
                <div className="content">
                    <h1>Food Settings</h1>

                    <ul className="tab-bar">
                        <li id="groupings-tab" className={activeTab === 'groupings' ? 'active' : ''}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('groupings');
                                }}
                            >
                                Groupings
                            </button>
                        </li>
                        <li id="foods-tab" className={activeTab === 'foods' ? 'active' : ''}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('foods');
                                }}
                            >
                                Custom Foods
                            </button>
                        </li>
                        <li id="recipes-tab" className={activeTab === 'recipes' ? 'active' : ''}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('recipes');
                                }}
                            >
                                Recipes
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className={activeTab === 'groupings' ? 'parent-content active' : 'parent-content'}>
                            <FoodGroupingsGrid />
                        </div>
                        <div className={activeTab === 'foods' ? 'parent-content active' : 'parent-content'}>
                            <CustomFoodsGrid />
                        </div>
                        <div className={activeTab === 'recipes' ? 'parent-content active' : 'parent-content'}>
                            <h2>Recipes</h2>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGateway>
    );
};

export { FoodSettings };
