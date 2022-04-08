import { PureComponent } from "react";
import { LinkProps, Link as L } from "react-router-dom";

type Props = LinkProps & {
  href: string
};

export class Link extends PureComponent<Props> {
  render() {
    const { to, ...props } = this.props
    return <L to={to || this.props.href} {...props}>
      {this.props.children}
    </L>;
  }
}
