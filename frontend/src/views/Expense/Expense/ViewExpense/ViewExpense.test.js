import React from 'react';
import ReactDOM from 'react-dom';
import ViewExpense from './ViewExpense';
import { shallow } from 'enzyme'


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewExpense />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing', () => {
    shallow(<ViewExpense />);
});
