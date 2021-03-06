/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Link,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { CmsPage, RenderCmsComponent } from 'bloomreach-experience-react-sdk';

import Banner from './components/banner';
import Content from './components/content';
import CmsMenu from './components/menu';
import NewsItem from './components/news-item';
import NewsList from './components/news-list';

const BR_ORIGIN = new URL(process.env.REACT_APP_BR_ORIGIN);
const BR_CONTEXT_PATH = process.env.REACT_APP_BR_CONTEXT_PATH;
const BR_CHANNEL_PATH = process.env.REACT_APP_BR_CHANNEL_PATH;

const urlConfig = {
  scheme: BR_ORIGIN.protocol.slice(0, -1),
  hostname: BR_ORIGIN.hostname,
  port: BR_ORIGIN.port,
  contextPath: BR_CONTEXT_PATH,
  channelPath: BR_CHANNEL_PATH
};

const cmsUrls = {
  preview: urlConfig,
  live: urlConfig
};

const componentDefinitions = {
  Banner: { component: Banner, wrapInContentComponent: true },
  Content: { component: Content, wrapInContentComponent: true },
  'News List': { component: NewsList },
  'News Item': { component: NewsItem, wrapInContentComponent: true },
};

const createLink = (href, linkText, className) => <Link className={className} to={href}>{linkText()}</Link>;

class App extends React.Component {
  render() {
    // hostname and URL-path are used for detecting if site is viewed in CMS preview
    // and for fetching Page Model for the viewed page
    const request = { hostname: window.location.hostname, path: window.location.pathname + window.location.search };

    return (
      <CmsPage componentDefinitions={componentDefinitions} cmsUrls={cmsUrls} request={request} createLink={createLink}>
        <div id="header">
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <span className="navbar-brand" href="#">Client-side React Demo</span>
            <button type="button"
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <RenderCmsComponent path="menu" renderComponent={CmsMenu} />
            </div>
          </nav>
        </div>
        <div className="container marketing">
          <RenderCmsComponent />
        </div>
      </CmsPage>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/(.*)" component={App} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
