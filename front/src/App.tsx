
import * as React from 'react';
import { BodyWidget } from './components/BodyWidget';
import { Application } from './components/Application';

export default () => {
  var app = new Application();
	return (
    <div className="content">
      <BodyWidget app={app} />
    </div>
	);
};