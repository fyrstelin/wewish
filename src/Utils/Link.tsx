import React from 'react';
import * as ReactRouterDom from 'react-router-dom';

type Props = ReactRouterDom.LinkProps & {
  href: string
};

export class Link extends React.PureComponent<Props> {
  render() {
    const { to, ...props} = this.props
    return <ReactRouterDom.Link to={to || this.props.href} {...props}>
      {this.props.children}
    </ReactRouterDom.Link>;
  }
}
